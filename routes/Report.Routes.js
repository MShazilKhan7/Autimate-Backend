// routes/report.routes.js
import express from "express";
import {
  generateSessionReport,
  getSessionReport,
  getUserReports,
} from "../controllers/report.controller.js";
// import { protect } from "../middleware/auth.middleware.js"; // uncomment if you have auth middleware

const router = express.Router();

// POST   /api/reports/generate/:sessionId  → generate (or return cached) report
router.post("/generate/:sessionId", /* protect, */ generateSessionReport);

// GET    /api/reports/:sessionId            → fetch existing report
router.get("/:sessionId", /* protect, */ getSessionReport);

// GET    /api/reports/user/:userId          → all reports for a user
router.get("/user/:userId", /* protect, */ getUserReports);

export default router;

// ─── Mount in your main app.js / server.js ────────────────────────────────────
// import reportRoutes from "./routes/report.routes.js";
// app.use("/api/reports", reportRoutes);