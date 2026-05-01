import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  userId:      { type: String, required: true },   // MongoDB _id of the user
  userEmail:   { type: String, required: true },
  userName:    { type: String, required: true },
  userRole:    { type: String, required: true },   // farmer | tractor | labour | government
  action:      { type: String, required: true },   // "login" | "register" | "book_tractor" | "book_labour" | "booking_accepted" | "booking_rejected" | "add_listing" etc.
  description: { type: String, default: "" },      // human-readable description
  metadata:    { type: mongoose.Schema.Types.Mixed, default: {} }, // extra data (bookingId, listingId, etc.)
  ip:          { type: String, default: "" },
}, { timestamps: true });

// Index for fast lookups
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ userRole: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);
