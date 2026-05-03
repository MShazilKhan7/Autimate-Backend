import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import {
  getSocialSkills,
  getSocialSkillById,
  createSocialSkill,
  updateSocialSkill,
  deleteSocialSkill
} from "../controllers/SocialSkill.Controller.js";

const router = express.Router();

router.route("/")
  .get(verifyToken, getSocialSkills)
  .post(verifyToken, isAdmin, createSocialSkill);

router.route("/:id")
  .get(verifyToken, getSocialSkillById)
  .put(verifyToken, isAdmin, updateSocialSkill)
  .delete(verifyToken, isAdmin, deleteSocialSkill);

export default router;
