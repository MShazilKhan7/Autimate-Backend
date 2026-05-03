import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { getUsers, getUser, deleteUser, updateUser } from "../controllers/Users.Controller.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getUsers);
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, isAdmin, updateUser);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;  
