import express from "express";
import { getExercisesByLevel } from "../controllers/Exercise.Controller.js";

const router = express.Router();

// GET /api/exercises/:level
router.get("/:level", getExercisesByLevel);

export default router;