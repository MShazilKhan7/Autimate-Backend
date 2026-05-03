import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import {
  getSocialSkills,
  createSocialSkill,
  updateSocialSkill,
  deleteSocialSkill
} from "../controllers/SocialSkill.Controller.js";

const router = express.Router();

router.route("/")
  .get(verifyToken, getSocialSkills)
  .post(verifyToken, isAdmin, createSocialSkill);

router.route("/:id")
  .put(verifyToken, isAdmin, updateSocialSkill)
  .delete(verifyToken, isAdmin, deleteSocialSkill);

export default router;
