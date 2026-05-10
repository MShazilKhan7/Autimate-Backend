// controllers/Feedback.Controller.js

import { generateFeedback } from "../aiService/aiService.js";

import { getSessionByUserAndWord } from "../services/session.service.js";

export const generateSpeechFeedback = async (req, res) => {
  try {
    const { wordId } = req.body;

    const userId = req.userId;

    if (!wordId) {
      return res.status(400).json({
        success: false,
        message: "wordId is required",
      });
    }

    // FETCH SESSION
    const session = await getSessionByUserAndWord({
      userId,
      wordId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // LAST 5 ATTEMPTS
    const recentAttempts = session.attempts.slice(-5);

    // FORMAT FOR LLM
    const formattedAttempts = recentAttempts.map((attempt) => ({
      word: attempt.word,
      quality_score: attempt.quality_score,
      quality_class: attempt.quality_class,
      phone_score_list: attempt.phone_score_list.map((phone) => ({
        phone: phone.phone,
        quality_score: phone.quality_score,
        sound_most_like: phone.sound_most_like,
      })),
      createdAt: attempt.createdAt,
    }));

    const scoreReport = {
      word: session.word,
      attempts: formattedAttempts,
    };

    // GENERATE FEEDBACK
    const feedbackText = await generateFeedback(scoreReport);
    // SAVE TO LATEST ATTEMPT
    const latestAttempt = session.attempts[session.attempts.length - 1];

    latestAttempt.llmFeedback = feedbackText;

    await session.save();
    return res.status(200).json({
      success: true,
      word: session.word,
      feedback: feedbackText,
      attemptsAnalyzed: formattedAttempts.length,
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
