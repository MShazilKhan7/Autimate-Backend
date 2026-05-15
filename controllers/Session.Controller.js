// controllers/Session.Controller.js

import Session from "../models/Session.js";


// CREATE or ADD ATTEMPT
export const createOrUpdateSession = async (req, res) => {
  try {
    const {
      userId,
      wordId,
      word,
      attempt,
    } = req.body;

    const session = await Session.findOne({
      userId,
      wordId,
    });

    if (session) {
      session.attempts.push(attempt);

      await session.save();

      return res.status(200).json({
        success: true,
        message: "Attempt added successfully",
        data: session,
      });
    }

    const newSession = await Session.create({
      userId,
      wordId,
      word,
      attempts: [attempt],
    });

    return res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: newSession,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL SESSIONS
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("userId")
      .populate("wordId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all sessions by the userId
export const getAllSessionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await Session.find({ userId })
      .populate("userId")
      .populate("wordId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE SESSION
export const getSingleSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("userId")
      .populate("wordId");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SESSION BY USER + WORD
export const getSessionByUserAndWord = async (req, res) => {
  try {
    const { userId, wordId } = req.params;

    const session = await Session.findOne({
      userId,
      wordId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE LLM FEEDBACK OF ATTEMPT
export const updateAttemptFeedback = async (req, res) => {
  try {
    const { sessionId, attemptId } = req.params;

    const { llmFeedback } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const attempt = session.attempts.id(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    attempt.llmFeedback = llmFeedback;

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE SESSION
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findByIdAndDelete(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE SINGLE ATTEMPT
export const deleteAttempt = async (req, res) => {
  try {
    const { sessionId, attemptId } = req.params;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    session.attempts = session.attempts.filter(
      (attempt) => attempt._id.toString() !== attemptId
    );

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Attempt deleted successfully",
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
