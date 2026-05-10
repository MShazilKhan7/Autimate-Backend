import express from "express";
import multer from "multer";
import { scoreSpeech } from "../controllers/speechace.Controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();
const upload = multer();



router.post("/", upload.single("audio"), verifyToken, scoreSpeech);


export default router;