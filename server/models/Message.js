import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  fromEmail: { type: String, required: true, index: true },
  fromName: { type: String, required: true },
  toEmail: { type: String, required: true, index: true },
  toName: { type: String, required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
  conversationKey: { type: String, index: true }, // sorted pair: "a|||b"
}, { timestamps: true });

messageSchema.index({ conversationKey: 1, createdAt: 1 });
messageSchema.index({ toEmail: 1, read: 1 });

export default mongoose.model("Message", messageSchema);
