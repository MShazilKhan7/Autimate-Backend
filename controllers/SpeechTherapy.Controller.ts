import ExerciseModule from "../models/SpeechTherapy.js";
import { WordModel } from "../models/SpeechTherapy.js";
import type { Request, Response } from "express";

// GET ALL EXERCISES
export const getModules = async (req: Request, res: Response) => {
  try {
    const exercises = await ExerciseModule.find()
      .populate("steps.wordId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: exercises,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE EXERCISE
export const getModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const exercise = await ExerciseModule.findById(id).populate(
      "steps.wordId"
    );

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: exercise,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE MODULE
export const createModule = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, emoji, color, colorLight, steps } = req.body;

    const exercise = await ExerciseModule.create({
      title,
      subtitle,
      emoji,
      color,
      colorLight,
      steps,
    });

    return res.status(201).json({
      success: true,
      message: "Exercise created successfully",
      data: exercise,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE MODULE
export const updateModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedExercise = await ExerciseModule.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("steps.wordId");

    if (!updatedExercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exercise updated successfully",
      data: updatedExercise,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE MODULE
export const deleteModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedExercise = await ExerciseModule.findByIdAndDelete(id);

    if (!deletedExercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exercise deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   WORDS
========================================================= */

// ALL WORDS
export const getWords = async (req: Request, res: Response) => {
  try {
    const words = await WordModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: words,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE WORD
========================================================= */

export const getWord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const word = await WordModel.findById(id);

    if (!word) {
      return res.status(404).json({
        success: false,
        message: "Word not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: word,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   CREATE WORD
========================================================= */

export const createWord = async (req: Request, res: Response) => {
  try {
    const {
      word,
      emoji,
      image,
      audio,
      category,
      difficulty,
      description,
      color
    } = req.body;

    const createdWord = await WordModel.create({
      word,
      emoji,
      image,
      audio,
      category,
      difficulty,
      description,
      color
    });

    return res.status(201).json({
      success: true,
      message: "Word created successfully",
      data: createdWord,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   UPDATE WORD
========================================================= */

export const updateWord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedWord = await WordModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedWord) {
      return res.status(404).json({
        success: false,
        message: "Word not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Word updated successfully",
      data: updatedWord,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   DELETE WORD
========================================================= */

export const deleteWord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedWord = await WordModel.findByIdAndDelete(id);

    if (!deletedWord) {
      return res.status(404).json({
        success: false,
        message: "Word not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Word deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};