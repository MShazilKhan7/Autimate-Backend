import express from "express";
import multer from "multer";
import FormData from "form-data";
import axios from "axios";
import asyncHandler from "express-async-handler";

export const scoreSpeech = asyncHandler(async (req, res) => {
  try {
    const { text } = req.body;
    const audioFile = req.file;

    console.log("text", text);

    const formData = new FormData();
    formData.append("text", `"${text}"`);
    formData.append("user_audio_file", audioFile.buffer, {
      filename: "recording.wav",
    });
    formData.append("question_info", "u1/q1");

    const response = await axios.post(
      `${process.env.SPEECHACE_BASE_URL}/api/scoring/text/v9/json`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        params: {
          key: process.env.SPEECHACE_KEY,
          user_id: "XYZ-ABC-99001",
          dialect: "en-us",
        },
      },
    );
    console.log("respinse from the speech api", response);
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Speechace failed" });
  }
});
