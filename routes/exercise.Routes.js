import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { getExercisesByLevel } from "../controllers/Exercise.Controller.js";

const router = express.Router();

// GET /api/exercises/:level
router.get("/:level", verifyToken, isAdmin, getExercisesByLevel);

export default router;