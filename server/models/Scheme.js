import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameHi: { type: String },       // Hindi
  nameMr: { type: String },       // Marathi
  description: { type: String, required: true },
  descriptionHi: { type: String },
  descriptionMr: { type: String },
  category: {
    type: String,
    enum: ["Insurance", "Subsidy", "Credit", "Soil Health", "Irrigation", "Other"],
    default: "Other",
  },
  ministry: { type: String },
  eligibility: { type: String },
  benefits: { type: String },
  applicationLink: { type: String },
  deadline: { type: Date },
  isActive: { type: Boolean, default: true },
  totalApplications: { type: Number, default: 0 },
  approvedApplications: { type: Number, default: 0 },
  disbursedAmount: { type: Number, default: 0 },    // in Crores
  icon: { type: String, default: "📋" },
  tags: [{ type: String }],
  createdBy: { type: String },   // email of govt officer
}, { timestamps: true });

schemeSchema.index({ isActive: 1 });
schemeSchema.index({ category: 1 });

export default mongoose.model("Scheme", schemeSchema);
