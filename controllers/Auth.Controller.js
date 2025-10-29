import bcryptjs from "bcryptjs";
import { sendVerificationEmail, sendWelcomeEmail } from "../Email/Email.js";
import Usermodel from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../lib/generateTokens.js";
import cookieOptions from "../lib/cookieOption.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { generateSessionId } from "../lib/idGenerator.js";

//@DESC Register
//@Route POST /auth/register
//@Access Private
export const Reigster = asyncHandler(async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const ExistsUser = await Usermodel.findOne({ email });
    if (ExistsUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists Please Login" });
    }

    const hasePassowrd = await bcryptjs.hashSync(password, 10);
    const verficationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const clientToken = generateSessionId();

    const user = new Usermodel({
      email,
      password: hasePassowrd,
      firstName,
      lastName,
      verficationToken,
      clientToken,
      verficationTokenExpiresAt: Date.now() + 60 * 1000,
      clientTokenExpiresAt: Date.now() + 60 * 1000 * 5,
    });
    const name = `${user.firstName} ${user.lastName}`;
    await user.save();

    const clientUrl = `${process.env.CLIENT_URL}/otp-verify/${clientToken}`;

    await sendVerificationEmail(user.email, verficationToken, clientUrl);

    return res.status(200).json({
      user: {
        id: user._id,
        fullName: name,
        email: user.email,
        clientToken: user?.clientToken,
        isVerified: user?.isVerified,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "internal server error" });
  }
});

//@DESC Verify Email
//@Route POST /auth/verify
//@Access Private
export const VerifyEmail = asyncHandler(async (req, res) => {
  try {
    const { code } = req.body;
    console.log("Received verification code:", code);

    const user = await Usermodel.findOne({ verficationToken: code });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.isVerified = true;
    user.verficationToken = "";
    user.verficationTokenExpiresAt = undefined;
    user.refreshToken = refreshToken;

    const name = `${user.firstName} ${user.lastName}`;
    await user.save();

    sendWelcomeEmail(user.email, name).catch((err) =>
      console.log("Failed to send welcome email:", err.message)
    );

    return res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullName: name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.log("VerifyEmail error:", error);
    return res.status(500).json({ success: false, message: error });
  }
});

//@DESC Resend Verification Code
//@Route POST /auth/resend-verification
//@Access Private
export const ResendVerification = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Usermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified. Please login.",
      });
    }

    const verficationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.verficationToken = verficationToken;
    user.verficationTokenExpiresAt = Date.now() + 60 * 1000; // 1 min

    await user.save();

    const name = `${user.firstName} ${user.lastName}`;
    await sendVerificationEmail(user.email, verficationToken);

    return res.status(200).json({
      success: true,
      message: "New verification code sent to your email",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

//@DESC Login
//@Route POST /auth/login
//@Access Private
export const Login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await Usermodel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // if (!user.isVerified) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "Please verify your email first" });
    // }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    const name = `${user.firstName} ${user.lastName}`;
    await user.save();

    res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          fullName: name,
          email: user.email,
          isVerified: user.isVerified,
        },
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

//@DESC Refresh Token
//@Route POST /auth/refresh/token
//@Access Private
export const RefreshToken = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token provided" });
    }

    const user = await Usermodel.findOne({ refreshToken });
    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err || decoded.id !== user._id.toString()) {
          return res.status(403).json({
            success: false,
            message: "Invalid or expired refresh token",
          });
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        const name = `${user.firstName} ${user.lastName}`;
        await user.save();

        return res
          .cookie("refreshToken", newRefreshToken, cookieOptions)
          .status(200)
          .json({
            success: true,
            user: {
              id: user._id,
              fullName: name,
              email: user.email,
              accessToken: newAccessToken,
            },
          });
      }
    );
  } catch (error) {
    console.log("RefreshToken error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

//@DESC Verify Client Token
//@Route GET /auth/verify-client/:clientToken
//@Access Public
export const VerifyClientToken = asyncHandler(async (req, res) => {
  try {
    const { clientToken } = req.params;

    if (!clientToken) {
      return res.status(400).json({
        success: false,
        message: "Client token is required",
      });
    }

    const user = await Usermodel.findOne({
      clientToken,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired client token",
      });
    }

    if (user.clientTokenExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired client token",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Valid client token",
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export const getActiveUser = asyncHandler(async (req, res) => {
  const userId = req.userId
  console.log(userId)
  try {
    const user = await Usermodel.findById(userId).select("_id email firstName lastName isVerified createdAt");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
})

export const SignOut = asyncHandler(async (req, res) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Successfully signed out",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
})