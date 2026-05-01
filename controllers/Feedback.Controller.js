import { generateFeedback } from "../aiService/aiService.js";
/**
 * POST /api/feedback/generate
 * Accepts a pronunciation score report and returns AI-generated child-friendly feedback
 */
export const generateSpeechFeedback = async (req, res) => {
  try {
    const scoreReport = req.body;

    // Basic validation
    if (!scoreReport || !scoreReport.word) {
      return res.status(400).json({
        success: false,
        message: "Invalid score report. 'word' field is required.",
      });
    }

    if (!scoreReport.mockResponse?.text_score) {
      return res.status(400).json({
        success: false,
        message: "Invalid score report. 'mockResponse.text_score' is required.",
      });
    }

    const feedbackText = await generateFeedback(scoreReport);

    return res.status(200).json({
      success: true,
      word: scoreReport.word,
      overallScore: scoreReport.mockResponse.text_score.quality_score,
      passed:
        scoreReport.mockResponse.text_score.word_score_list?.[0]
          ?.quality_class === "pass",
      feedback: feedbackText,
    });
  } catch (error) {
    console.error("[FeedbackController] Error generating feedback:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate feedback. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};