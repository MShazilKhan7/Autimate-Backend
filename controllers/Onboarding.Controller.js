import asyncHandler from "express-async-handler";
import { Answer, onBoardingRespons, Question,  } from "../models/Quiz.js";
import fs from "fs";
import path from "path";

//@DESC Get all questions with answers
//@Route GET /api/on-boarding
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
// @Route POST /api/on-boarding/load
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

// @DESC Save user quiz response
// @Route POST /api/on-boarding/save
// @Access Public or Protected (your choice)
export const saveQuizResponse = asyncHandler(async (req, res) => {
  try {
    const answerArray = Array.isArray(req.body.answers)
      ? req.body.answers
      : req.body.answers?.answers || [];

    const userId = req.userId || req.body.userId; 

    console.log("answers:", answerArray);
    console.log("user id:", userId);

    if (!userId || !answerArray.length) {
      return res.status(400).json({
        success: false,
        message: "userId and answers array are required.",
      });
    }

    // Validate each answer
    for (const entry of answerArray) {
      if (!entry.questionId || !entry.answerId) {
        return res.status(400).json({
          success: false,
          message: "Each answer must contain questionId and answerId.",
        });
      }

      const questionExists = await Question.findById(entry.questionId);
      if (!questionExists) {
        return res.status(404).json({
          success: false,
          message: `Question not found: ${entry.questionId}`,
        });
      }

      const answerExists = await Answer.findById(entry.answerId);
      if (!answerExists) {
        return res.status(404).json({
          success: false,
          message: `Answer not found: ${entry.answerId}`,
        });
      }
    }

    const surveyResponse = new onBoardingRespons({
      userId,
      answers: answerArray,
      completed: true,
      completedAt: new Date(),
    });

    await surveyResponse.save();

    res.status(200).json({
      success: true,
      data: surveyResponse,
      message: "Quiz response saved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error saving quiz response",
      error: error.message,
    });
  }
});


// @DESC Get user quiz responses in readable format
// @Route GET /api/on-boarding/response/:userId
// @Access Protected or Public (as needed)
export const getUserQuizResponse = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  try {
    const response = await onBoardingRespons.findOne({ userId });

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "No quiz response found for this user",
      });
    }

    const formattedAnswers = await Promise.all(
      response.answers.map(async (entry) => {
        const question = await Question.findById(entry.questionId);
        const answer = await Answer.findById(entry.answerId);

        return {
          question: question?.questionText || "Question not found",
          answer: answer?.answerText || "Answer not found",
        };
      })
    );

    res.status(200).json({
      success: true,
      userId,
      completed: response.completed,
      completedAt: response.completedAt,
      answers: formattedAnswers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching user quiz response",
      error: error.message,
    });
  }
});