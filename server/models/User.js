import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: String,
  village: String,
  role: {
    type: String,
    enum: ["farmer", "tractor", "labour", "government"],
    required: true,
  },
  resetToken: String,
  resetTokenExpire: Date,
  emailOtp: String,
  emailOtpExpire: Date,
}, { timestamps: true });

export default mongoose.model("User", userSchema);
