// controllers/report.controller.js
import Report from "../models/Report.js";
import Session from "../models/Session.js";
import { generateReport } from "../aiService/reportService.js";

// ─── Generate Report ──────────────────────────────────────────────────────────
/**
 * POST /api/reports/generate/:sessionId
 * Generates a new report for a session (idempotent — returns cached if already exists).
 */
export const generateSessionReport = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id; // set by your auth middleware

    // Return existing report if already generated (idempotent)
    const existing = await Report.findOne({ sessionId });
    if (existing) {
      return res
        .status(200)
        .json({ success: true, report: existing, cached: true });
    }

    // Attempts are embedded subdocs inside Session — no .populate() needed
    const session = await Session.findById(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }
    if (!session.attempts || session.attempts.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No attempts found for this session",
        });
    }

    // Generate report via LLM + computed metrics
    const {
      llmReport,
      metrics,
      phonemeBreakdown,
      attemptTimeline,
      overallRating,
    } = await generateReport(session.word, session.attempts);

    // Persist to DB - saving the fields to database
    const report = await Report.create({
      sessionId,
      userId: userId ?? session.userId, // session.userId is always present per your schema
      word: session.word,
      metrics,
      phonemeBreakdown,
      attemptTimeline,
      llmReport,
      overallRating,
      generatedAt: new Date(),
    });

    // Mark the session as having a report
    // NOTE: add `hasReport: { type: Boolean, default: false }` to your SessionSchema
    await Session.findByIdAndUpdate(sessionId, { hasReport: true });

    return res.status(201).json({ success: true, report });
  } catch (err) {
    console.error("[generateSessionReport]", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Get Report ───────────────────────────────────────────────────────────────
/**
 * GET /api/reports/:sessionId
 * Fetches an existing report for a session.
 */
export const getSessionReport = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const report = await Report.findOne({ sessionId });
    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    return res.status(200).json({ success: true, report });
  } catch (err) {
    console.error("[getSessionReport]", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── List Reports for a User ──────────────────────────────────────────────────
/**
 * GET /api/reports/user/:userId
 * Returns all reports for a given user.
 */
export const getUserReports = async (req, res) => {
  try {
    const { userId } = req.params;
    const reports = await Report.find({ userId }).sort({ generatedAt: -1 });
    return res.status(200).json({ success: true, reports });
  } catch (err) {
    console.error("[getUserReports]", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
