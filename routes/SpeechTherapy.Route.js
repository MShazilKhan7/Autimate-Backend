import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import {
  getSpeechTherapyWords,
  createSpeechTherapyWord,
  updateSpeechTherapyWord,
  deleteSpeechTherapyWord
} from "../controllers/SpeechTherapy.Controller.js";

const router = express.Router();

router.route("/")
  .get(verifyToken, getSpeechTherapyWords)
  .post(verifyToken, isAdmin, createSpeechTherapyWord);

router.route("/:id")
  .put(verifyToken, isAdmin, updateSpeechTherapyWord)
  .delete(verifyToken, isAdmin, deleteSpeechTherapyWord);

export default router;
