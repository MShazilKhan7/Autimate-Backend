import Usermodel from "../models/User.js";
import ChildInfo from "../models/childInfo.js";
import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";

// Get all users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await Usermodel.find().select(
    "_id email firstName lastName role caregiverId phone specialization experience isVerified createdAt",
  );
  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// Get single user by ID
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await Usermodel.findById(id).select(
    "_id email firstName lastName role caregiverId phone specialization experience isVerified createdAt",
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const childDoc = await ChildInfo.findOne({ userId: id });

  res.status(200).json({
    success: true,
    data: {
      user,
      childInfo: childDoc, // will be null if not found (this is fine)
    },
  });
});

// Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await Usermodel.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, message: "User deleted successfully" });
});

// Update user details
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await Usermodel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({ success: true, data: user });
});

// Get all caregivers
export const getCaregivers = asyncHandler(async (req, res) => {
  const caregivers = await Usermodel.find({ role: "caregiver" }).select(
    "_id email firstName lastName role phone specialization experience createdAt"
  );
  res.status(200).json({
    success: true,
    count: caregivers.length,
    data: caregivers
  });
});

// Create caregiver profile
export const createCaregiver = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, specialization, experience } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  const ExistsUser = await Usermodel.findOne({ email });
  if (ExistsUser) {
    return res.status(400).json({ success: false, message: "User already exists with this email" });
  }
  const hashedPassword = await bcryptjs.hashSync(password, 10);
  const user = new Usermodel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "caregiver",
    phone: phone || "",
    specialization: specialization || "",
    experience: experience || 0,
    isVerified: true
  });
  await user.save();
  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      specialization: user.specialization,
      experience: user.experience,
      createdAt: user.createdAt
    }
  });
});

// Get parent and child accounts with caregiver information
export const getParentsWithChildren = asyncHandler(async (req, res) => {
  const parents = await Usermodel.find({ role: "user" }).select(
    "_id email firstName lastName role caregiverId createdAt"
  ).populate("caregiverId", "_id email firstName lastName phone specialization experience");
  
  const parentChildrenList = [];
  for (const parent of parents) {
    const child = await ChildInfo.findOne({ userId: parent._id });
    parentChildrenList.push({
      user: parent,
      child: child,
      caregiver: parent.caregiverId
    });
  }
  
  res.status(200).json({
    success: true,
    count: parentChildrenList.length,
    data: parentChildrenList
  });
});

// Assign caregiver to parent user
export const assignCaregiver = asyncHandler(async (req, res) => {
  const { userId, caregiverId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }
  
  if (caregiverId) {
    const caregiver = await Usermodel.findOne({ _id: caregiverId, role: "caregiver" });
    if (!caregiver) {
      return res.status(400).json({ success: false, message: "Valid Caregiver ID is required" });
    }
  }
  
  const user = await Usermodel.findByIdAndUpdate(
    userId,
    { caregiverId: caregiverId || null },
    { new: true }
  ).select("-password").populate("caregiverId", "_id email firstName lastName");
  
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  
  res.status(200).json({
    success: true,
    message: "Caregiver assigned successfully",
    data: user
  });
});
