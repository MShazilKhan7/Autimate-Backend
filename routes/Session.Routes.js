// routes/Session.Routes.js

import express from "express"

const router = express.Router();

import {
  createOrUpdateSession,
  getAllSessions,
  getSingleSession,
  getSessionByUserAndWord,
  updateAttemptFeedback,
  deleteSession,
  getAllSessionsByUserId,
  deleteAttempt,
} from "../controllers/Session.Controller.js";

// CREATE SESSION / ADD ATTEMPT
router.post("/", createOrUpdateSession);

// GET ALL SESSIONS
router.get("/", getAllSessions);

// GET SESSION BY USER + WORD
router.get("/user/:userId/word/:wordId", getSessionByUserAndWord);

// GET SINGLE SESSION
router.get("/:id", getSingleSession);

// UPDATE ATTEMPT FEEDBACK
router.patch(
  "/:sessionId/attempt/:attemptId/feedback",
  updateAttemptFeedback
);

// DELETE SINGLE ATTEMPT
router.delete(
  "/:sessionId/attempt/:attemptId",
  deleteAttempt
);

// DELETE SESSION
router.delete("/:id", deleteSession);

// get all sessions by userId
router.get("/user/:userId", getAllSessionsByUserId);

export default router;