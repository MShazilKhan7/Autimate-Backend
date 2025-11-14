import asyncHandler from "express-async-handler";
import { Answer, Question } from "../models/Quiz.js";
import fs from "fs";
import path from "path";

//@DESC Get all questions with answers
//@Route GET /questions
//@Access Public
export const getAllQuestionsWithAnswers = asyncHandler(async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });

    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await Answer.find({ question: question._id })
          .sort({ createdAt: -1 })
          .select("answerText createdAt");

        return {
          _id: question._id,
          questionText: question.questionText,
          options: question.options,
          createdAt: question.createdAt,
          answers: answers,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: questionsWithAnswers,
      message: "Questions and answers retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching questions and answers",
      error: error.message,
    });
  }
});

// @DESC Load questions and answers from JSON and save to DB
// @Route POST /questions/load
// @Access Public
export const loadQuizFromJSON = asyncHandler(async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "data", "quiz.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const quizData = JSON.parse(rawData);

    const savedData = [];

    for (const q of quizData) {
      let question = await Question.findOne({ questionText: q.question });
      if (!question) {
        question = new Question({ questionText: q.question });
        await question.save();
      }
      if (q.options && q.options.length) {
        for (const opt of q.options) {
          const existingAnswer = await Answer.findOne({
            question: question._id,
            answerText: opt,
          });
          if (!existingAnswer) {
            const answer = new Answer({
              question: question._id,
              answerText: opt,
            });
            await answer.save();
          }
        }
      }

      savedData.push({
        question: question.questionText,
        answers: q.options || [],
      });
    }

    res.status(200).json({
      success: true,
      data: savedData,
      message: "Questions and answers loaded into DB successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error loading quiz questions and answers into DB",
      error: error.message,
    });
  }
});
