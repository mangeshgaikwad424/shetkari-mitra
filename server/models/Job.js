import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  // Posted by farmer
  farmerEmail: { type: String, required: true, index: true },
  farmerName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  location: { type: String, required: true },
  district: { type: String },
  state: { type: String, default: "Maharashtra" },
  type: {
    type: String,
    enum: ["Harvesting", "Sowing", "Weeding", "Irrigation", "Pesticide Spraying", "Other"],
    required: true,
  },
  wage: { type: String, required: true },         // e.g. "₹400/day"
  wageAmount: { type: Number },
  workersRequired: { type: Number, default: 1 },
  startDate: { type: Date },
  endDate: { type: Date },
  duration: { type: String },                     // e.g. "3 days"
  status: { type: String, enum: ["open", "closed", "filled"], default: "open" },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

jobSchema.index({ location: 1, status: 1 });
jobSchema.index({ farmerEmail: 1 });
jobSchema.index({ type: 1 });

export default mongoose.model("Job", jobSchema);
