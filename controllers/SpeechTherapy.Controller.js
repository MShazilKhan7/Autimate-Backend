import SpeechTherapy from "../models/SpeechTherapy.js";
import asyncHandler from "express-async-handler";

// @desc    Get all speech therapy words
// @route   GET /api/speech-therapy
export const getSpeechTherapyWords = asyncHandler(async (req, res) => {
  const words = await SpeechTherapy.find();
  res.status(200).json({ success: true, count: words.length, data: words });
});

// @desc    Add new word to therapy syllabus
// @route   POST /api/speech-therapy
export const createSpeechTherapyWord = asyncHandler(async (req, res) => {
  const word = await SpeechTherapy.create(req.body);
  res.status(201).json({ success: true, data: word });
});

// @desc    Update therapy word
// @route   PUT /api/speech-therapy/:id
export const updateSpeechTherapyWord = asyncHandler(async (req, res) => {
  const word = await SpeechTherapy.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!word) {
    return res.status(404).json({ success: false, message: "Word not found" });
  }
  res.status(200).json({ success: true, data: word });
});

// @desc    Remove word from syllabus
// @route   DELETE /api/speech-therapy/:id
export const deleteSpeechTherapyWord = asyncHandler(async (req, res) => {
  const word = await SpeechTherapy.findByIdAndDelete(req.params.id);
  if (!word) {
    return res.status(404).json({ success: false, message: "Word not found" });
  }
  res.status(200).json({ success: true, message: "Word deleted" });
});
