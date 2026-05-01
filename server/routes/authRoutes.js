import express from "express";
import {
  register, login, getMe,
  forgotPassword, resetPassword,
  sendPhoneOtp, verifyPhoneOtp,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/send-otp", sendPhoneOtp);
router.post("/verify-otp", verifyPhoneOtp);

export default router;
