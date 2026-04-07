import express from "express";
import multer from "multer";
import { scoreSpeech } from "../controllers/speechace.Controller.js";
const router = express.Router();
const upload = multer();

router.post("/", upload.single("audio"), scoreSpeech);


export default router;