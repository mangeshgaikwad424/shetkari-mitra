import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // TTL: auto-delete after 10 min
});

export default mongoose.model("OTP", otpSchema);
