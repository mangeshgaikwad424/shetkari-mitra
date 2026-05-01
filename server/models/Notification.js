import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipientEmail: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: ["booking_request", "booking_update", "payment", "scheme", "system", "message"],
    default: "system",
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  metadata: { type: Object, default: {} },  // extra data (bookingId, schemeId, etc.)
  link: { type: String },                    // optional redirect link
}, { timestamps: true });

notificationSchema.index({ recipientEmail: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
