import express from 'express';
import { getAllQuestionsWithAnswers, getUserQuizResponse, loadQuizFromJSON, saveQuizResponse, saveOnboarding, getChildInfo, updateChildInfo } from '../controllers/Onboarding.Controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';


const router = express.Router();

router.get('/', getAllQuestionsWithAnswers);
router.post("/load", loadQuizFromJSON)
router.post("/save", verifyToken , saveQuizResponse)
router.post("/submit", verifyToken , saveOnboarding)
router.get("/child-info", verifyToken, getChildInfo)
router.put("/child-info", verifyToken, updateChildInfo)
router.get("/response/:userId", getUserQuizResponse)

export default router;