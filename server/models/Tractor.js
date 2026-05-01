import mongoose from "mongoose";

const tractorSchema = new mongoose.Schema({
  ownerEmail: { type: String, required: true, index: true },
  ownerName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  brand: { type: String, default: "" },
  model: { type: String, default: "" },
  year: { type: Number },
  location: { type: String, required: true },
  price: { type: String, required: true }, // e.g. "₹800/day"
  priceAmount: { type: Number },           // numeric for filtering
  available: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  phone: { type: String },
  images: [{ type: String }],             // Cloudinary URLs
  features: [{ type: String }],           // e.g. ["AC", "GPS"]
  horsepower: { type: Number },
  availableDates: [{ type: Date }],
}, { timestamps: true });

tractorSchema.index({ location: 1, available: 1 });
tractorSchema.index({ ownerEmail: 1 });

export default mongoose.model("Tractor", tractorSchema);
