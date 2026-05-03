import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  farmerId: { type: String, required: true },
  farmerEmail: { type: String, default: "" },
  farmerName: { type: String, required: true },
  farmerPhone: { type: String, default: "N/A" },
  ownerId: { type: String, required: true },
  ownerName: { type: String, required: true },
  ownerPhone: { type: String, default: "N/A" },
  listingId: { type: String, required: true },
  listingTitle: { type: String, required: true },
  listingType: { type: String, enum: ["tractor", "labour"], required: true },
  date: { type: String, required: true },
  message: { type: String, default: "" },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  razorpayOrderId: { type: String },
  paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
  depositAmount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
