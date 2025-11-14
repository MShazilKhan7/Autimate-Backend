import express from 'express';
import { getAllQuestionsWithAnswers, loadQuizFromJSON } from '../controllers/Question.Controller.js';


const router = express.Router();

router.get('/', getAllQuestionsWithAnswers);
router.post("/load", loadQuizFromJSON)

export default router;