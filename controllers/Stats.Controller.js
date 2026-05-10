import Usermodel from "../models/User.js";
import SocialSkill from "../models/SocialSkill.js";
import SpeechTherapy from "../models/SpeechTherapy.ts";
import SpeechSpace from "../models/SpeechSpace.js";
import asyncHandler from "express-async-handler";

// @desc    Get dashboard statistics
// @route   GET /api/stats/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [userCount, socialCount, therapyCount, spaceCount] = await Promise.all([
    Usermodel.countDocuments(),
    SocialSkill.countDocuments(),
    SpeechTherapy.countDocuments(),
    SpeechSpace.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: userCount,
      socialTasks: socialCount,
      therapyWords: therapyCount,
      spaceLevels: spaceCount,
    },
  });
});
