import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: "",
    },
    speechLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    isOnboardingFinish: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "caregiver"],
      default: "user",
    },
    caregiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    phone: {
      type: String,
      default: "",
    },
    specialization: {
      type: String,
      default: "",
    },
    experience: {
      type: Number,
      default: 0,
    },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    clientToken: String,
    clientTokenExpiresAt: Date,
    resetPasswordToken: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
