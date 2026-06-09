import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { 
  getUsers, 
  getUser, 
  deleteUser, 
  updateUser,
  getCaregivers,
  createCaregiver,
  getParentsWithChildren,
  assignCaregiver
} from "../controllers/Users.Controller.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getUsers);
router.get("/caregivers", verifyToken, isAdmin, getCaregivers);
router.post("/caregivers", verifyToken, isAdmin, createCaregiver);
router.get("/parents-with-children", verifyToken, isAdmin, getParentsWithChildren);
router.post("/assign-caregiver", verifyToken, isAdmin, assignCaregiver);

router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, isAdmin, updateUser);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;  
