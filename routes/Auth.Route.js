import express from "express";
import {
  Reigster,
  VerifyEmail,
  Login,
  getActiveUser,
  RefreshToken,
  ResendVerification,
  VerifyClientToken,
  SignOut,
} from "../controllers/Auth.Controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { apiKeyAuth } from "../middleware/apiKeyAuth.middlware.js";

const router = express.Router();

router.post("/register", Reigster)
router.post("/verify", VerifyEmail);
router.get("/me", verifyToken, getActiveUser);
router.post("/verify-client/:clientToken", apiKeyAuth, VerifyClientToken);
router.post("/resend-verify", ResendVerification);
router.post("/login", Login);
router.post("/refresh/token", apiKeyAuth, RefreshToken);
router.post("/signout", verifyToken, SignOut);

export default router;
