// import express from "express";
// import multer from "multer";
// import FormData from "form-data";
// import axios from "axios";
// import asyncHandler from "express-async-handler";

// export const scoreSpeech = asyncHandler(async (req, res) => {
//   try {
//     const { userId, wordId, word } = req.body;
//     const audioFile = req.file;

//     console.log("word", word);

//     const formData = new FormData();
//     formData.append("text", `"${word}"`);
//     formData.append("user_audio_file", audioFile.buffer, {
//       filename: "recording.wav",
//     });
//     formData.append("question_info", "u1/q1");

//     const response = await axios.post(
//       `${process.env.SPEECHACE_BASE_URL}/api/scoring/text/v9/json`,
//       formData,
//       {
//         headers: {
//           ...formData.getHeaders(),
//         },
//         params: {
//           key: process.env.SPEECHACE_KEY,
//           user_id: "XYZ-ABC-99001",
//           dialect: "en-us",
//         },
//       },
//     );

//     console.log("respinse from the speech api", response);
//     res.json(response.data);
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ error: "Speechace failed" });
//   }
// });


import FormData from "form-data";
import axios from "axios";
import asyncHandler from "express-async-handler";

import { createOrUpdateSession } from "../services/session.service.js";

export const scoreSpeech = asyncHandler(async (req, res) => {
  try {
    const { wordId, word } = req.body;

    const audioFile = req.file;
    const userId = req.userId

    const formData = new FormData();

    formData.append("text", `"${word}"`);

    formData.append(
      "user_audio_file",
      audioFile.buffer,
      {
        filename: "recording.wav",
      }
    );

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
      }
    );

    const speechData = response.data;

    const wordData =
      speechData?.text_score?.word_score_list[0];

    // FILTER RESPONSE
    const attempt = {
      word: wordData.word,

      quality_score:
        wordData.quality_score,

      quality_class:
        wordData.quality_class,

      phone_score_list:
        wordData.phone_score_list.map(
          (phone) => ({
            phone: phone.phone,

            quality_score:
              phone.quality_score,

            sound_most_like:
              phone.sound_most_like,
          })
        ),

      llmFeedback: "",
    };

    // SAVE SESSION
    const session =
      await createOrUpdateSession({
        userId,
        wordId,
        word,
        attempt,
      });

    return res.status(200).json({
      success: true,
      message:
        "Speech scored successfully",
      data:
        session.attempts[
          session.attempts.length - 1
        ],
    });
  } catch (err) {
    console.error(
      err.response?.data || err.message
    );

    return res.status(500).json({
      success: false,
      error: "Speechace failed",
    });
  }
});