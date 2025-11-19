import express from 'express';
import { getAllQuestionsWithAnswers, getUserQuizResponse, loadQuizFromJSON, saveQuizResponse } from '../controllers/Onboarding.Controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';


const router = express.Router();

router.get('/', getAllQuestionsWithAnswers);
router.post("/load", loadQuizFromJSON)
router.post("/save", verifyToken , saveQuizResponse)
router.get("/response/:userId", getUserQuizResponse)

export default router;