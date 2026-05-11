import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import {
  getModules,
  getModule,
  createModule,
  updateModule,
  deleteModule,
  getWords,
  getWord,
  createWord,
  updateWord,
  deleteWord
} from "../controllers/SpeechTherapy.Controller.js";
import { validateObectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.route("/modules")
  .get(verifyToken, getModules)
  .post(verifyToken, isAdmin, createModule);

router.route("/modules/:id")
  .get(verifyToken, validateObectId, getModule)
  .put(verifyToken, isAdmin, validateObectId, updateModule)
  .delete(verifyToken, isAdmin, deleteModule);


// Words
router.route("/words")
  .get(verifyToken, getWords)
  .post(verifyToken, createWord)

router.route('/words/:id')
  .get(verifyToken, validateObectId, getWord)
  .put(verifyToken, isAdmin, validateObectId, updateWord)
  .delete(verifyToken, isAdmin, validateObectId, deleteWord)

export default router;
