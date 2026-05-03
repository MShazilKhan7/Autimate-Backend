import SpeechSpace from "../models/SpeechSpace.js";
import asyncHandler from "express-async-handler";

// @desc    Get all game levels
// @route   GET /api/speech-space
export const getSpeechSpaceLevels = asyncHandler(async (req, res) => {
  const levels = await SpeechSpace.find().sort({ levelNumber: 1 });
  res.status(200).json({ success: true, count: levels.length, data: levels });
});

// @desc    Create new game level
// @route   POST /api/speech-space
export const createSpeechSpaceLevel = asyncHandler(async (req, res) => {
  const level = await SpeechSpace.create(req.body);
  res.status(201).json({ success: true, data: level });
});

// @desc    Update game level
// @route   PUT /api/speech-space/:id
export const updateSpeechSpaceLevel = asyncHandler(async (req, res) => {
  const level = await SpeechSpace.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!level) {
    return res.status(404).json({ success: false, message: "Level not found" });
  }
  res.status(200).json({ success: true, data: level });
});

// @desc    Delete game level
// @route   DELETE /api/speech-space/:id
export const deleteSpeechSpaceLevel = asyncHandler(async (req, res) => {
  const level = await SpeechSpace.findByIdAndDelete(req.params.id);
  if (!level) {
    return res.status(404).json({ success: false, message: "Level not found" });
  }
  res.status(200).json({ success: true, message: "Level deleted" });
});
