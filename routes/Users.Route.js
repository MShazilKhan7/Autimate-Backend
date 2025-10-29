import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getUsers, getUser, deleteUser } from "../controllers/Users.Controller.js";

const router = express.Router();

router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, getUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
