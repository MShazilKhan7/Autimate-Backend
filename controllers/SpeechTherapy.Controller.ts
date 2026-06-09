import ModuleModel from "../models/SpeechTherapy.js";
import { WordModel } from "../models/SpeechTherapy.js";
import type { Request, Response } from "express";

// GET ALL EXERCISES
export const getModules = async (req: Request, res: Response) => {
  try {
    const modules = await ModuleModel.find()
      .populate("steps.wordId")
      .sort({ createdAt: -1 })
      .lean();

    modules.forEach((module) => {
      module.steps.sort((a, b) => a.order - b.order);
    });

    return res.status(200).json({
      success: true,
      data: modules,
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

    const module = await ModuleModel.findById(id)
    .populate("steps.wordId")
    .populate("steps.config.distractorWordIds")
    .lean();

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    if (module?.steps) {
      module.steps.sort((a, b) => a.order - b.order);
    }

    return res.status(200).json({
      success: true,
      data: module,
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

    const module = await ModuleModel.create({
      title,
      subtitle,
      emoji,
      color,
      colorLight,
      steps,
    });

    return res.status(201).json({
      success: true,
      message: "Module created successfully",
      data: module,
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

    const updatedModule = await ModuleModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("steps.wordId");

    if (!updatedModule) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Module updated successfully",
      data: updatedModule,
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

    const deletedModule = await ModuleModel.findByIdAndDelete(id);

    if (!deletedModule) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Module deleted successfully",
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
    const words = await WordModel.find().sort({ createdAt: -1 }).lean();

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

    const word = await WordModel.findById(id).lean();

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
      phonemes,
      images,
      videos,
      category,
      color,
    } = req.body;

    const createdWord = await WordModel.create({
      word,
      emoji,
      phonemes,
      images,
      videos,
      category,
      color,
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

    const usedInExercises = await ModuleModel.exists({
      "steps.wordId": id,
    });

    if (usedInExercises) {
      return res.status(400).json({
        success: false,
        message: "Word is being used in an exercise and cannot be deleted",
      });
    }

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