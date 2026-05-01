import express from "express";
const router = express.Router();
import { generateSpeechFeedback } from "../controllers/Feedback.Controller.js";

// You can add your auth middleware here if needed
// const { protect } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/feedback/generate
 * @desc    Generate AI feedback from a pronunciation score report
 * @access  Private (add middleware as needed)
 * @body    { id, word, image, category, phonemes, mockResponse }
 */
router.post("/generate", generateSpeechFeedback);

export default router;