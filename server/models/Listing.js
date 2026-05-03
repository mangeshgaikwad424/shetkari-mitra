import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  type: { type: String, enum: ["tractor", "labour"], required: true },
  ownerEmail: { type: String, required: true },
  ownerName: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, default: "" },
  available: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  phone: { type: String },
  skill: { type: String }, // for labour
}, { timestamps: true });

export default mongoose.model("Listing", listingSchema);
