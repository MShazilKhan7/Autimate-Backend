
import Usermodel from "../models/User.js";
import asyncHandler from "express-async-handler";

// Get all users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await Usermodel.find().select("_id email firstName lastName isVerified createdAt");
  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// Get single user by ID
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await Usermodel.findById(id).select("_id email firstName lastName isVerified createdAt");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await Usermodel.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, message: "User deleted successfully" });
});
