import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import {
  getSpeechSpaceLevels,
  createSpeechSpaceLevel,
  updateSpeechSpaceLevel,
  deleteSpeechSpaceLevel
} from "../controllers/SpeechSpace.Controller.js";

const router = express.Router();

router.route("/")
  .get(verifyToken, getSpeechSpaceLevels)
  .post(verifyToken, isAdmin, createSpeechSpaceLevel);

router.route("/:id")
  .put(verifyToken, isAdmin, updateSpeechSpaceLevel)
  .delete(verifyToken, isAdmin, deleteSpeechSpaceLevel);

export default router;
