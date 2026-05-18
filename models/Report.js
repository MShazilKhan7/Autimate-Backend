// models/report.model.js
import mongoose from "mongoose";

const PhonemeSnapshotSchema = new mongoose.Schema(
  {
    phone:      { type: String, required: true },
    avgScore:   { type: Number, required: true },
    bestScore:  { type: Number, required: true },
    trend:      { type: Number, required: true }, // last attempt score - first attempt score for this phoneme
    status: {
      type: String,
      enum: ["mastered", "improving", "needs_practice", "struggling"],
      required: true,
    },
  },
  { _id: false },
);

// Mirrors each embedded attempt in SessionSchema.attempts
// We store attemptId as a plain ObjectId (not a ref to a separate collection)
// because attempts live inside the Session document as subdocs.
const AttemptSummarySchema = new mongoose.Schema(
  {
    attemptId:     { type: mongoose.Schema.Types.ObjectId, required: true }, // subdoc _id
    attemptNumber: { type: Number, required: true },
    qualityScore:  { type: Number, required: true },
    qualityClass:  { type: String, required: true },
    date:          { type: Date,   required: true }, // maps to attempt.createdAt
  },
  { _id: false },
);

const ReportSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      unique: true, // one report per session
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Denormalized from Session so the report is self-contained
    word: { type: String, required: true },

    // ── Computed Metrics ────────────────────────────────────────────────────
    metrics: {
      totalAttempts:      { type: Number, required: true },
      averageScore:       { type: Number, required: true },
      bestScore:          { type: Number, required: true },
      latestScore:        { type: Number, required: true },
      firstScore:         { type: Number, required: true },
      overallProgress:    { type: Number, required: true }, // latestScore - firstScore
      consistencyScore:   { type: Number, required: true }, // 100 - stdDev (lower variance = higher score)
      masteredPhonemes:   { type: Number, required: true }, // phonemes with avgScore >= 85
      strugglingPhonemes: { type: Number, required: true }, // phonemes with avgScore < 55
    },

    // ── Per-phoneme Analysis ────────────────────────────────────────────────
    phonemeBreakdown: [PhonemeSnapshotSchema],

    // ── Attempt Timeline (lightweight — drives the frontend chart) ──────────
    attemptTimeline: [AttemptSummarySchema],

    // ── LLM-Generated Content ───────────────────────────────────────────────
    llmReport: {
      overallFeedback:   { type: String, required: true },
      strengths:         [{ type: String }],
      areasToImprove:    [{ type: String }],
      practiceExercises: [{ type: String }],
      encouragement:     { type: String, required: true }, // child-facing, no numbers
      therapistNotes:    { type: String },                 // parent/therapist-facing
    },

    // ── Summary Rating ──────────────────────────────────────────────────────
    overallRating: {
      type: String,
      enum: ["excellent", "good", "developing", "needs_support"],
      required: true,
    },

    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("Report", ReportSchema);