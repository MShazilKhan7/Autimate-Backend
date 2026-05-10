import SocialSkill from "../models/SocialSkill.js";
import asyncHandler from "express-async-handler";

// @desc    Get single social skill
// @route   GET /api/social-skills/:id
export const getSocialSkillById = asyncHandler(async (req, res) => {
  const skill = await SocialSkill.findById(req.params.id);
  if (!skill) {
    return res.status(404).json({ success: false, message: "Skill not found" });
  }
  res.status(200).json({ success: true, data: skill });
});

// @desc    Get all social skills
// @route   GET /api/social-skills
export const getSocialSkills = asyncHandler(async (req, res) => {
  const skills = await SocialSkill.find();
  res.status(200).json({ success: true, count: skills.length, data: skills });
});

// @desc    Create new social skill
// @route   POST /api/social-skills
export const createSocialSkill = asyncHandler(async (req, res) => {
  const skill = await SocialSkill.create(req.body);
  res.status(201).json({ success: true, data: skill });
});

// @desc    Update social skill
// @route   PUT /api/social-skills/:id
export const updateSocialSkill = asyncHandler(async (req, res) => {
  const skill = await SocialSkill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!skill) {
    return res.status(404).json({ success: false, message: "Skill not found" });
  }
  res.status(200).json({ success: true, data: skill });
});

// @desc    Delete social skill
// @route   DELETE /api/social-skills/:id
export const deleteSocialSkill = asyncHandler(async (req, res) => {
  const skill = await SocialSkill.findByIdAndDelete(req.params.id);
  if (!skill) {
    return res.status(404).json({ success: false, message: "Skill not found" });
  }
  res.status(200).json({ success: true, message: "Skill deleted" });
});
