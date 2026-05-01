import Scheme from "../models/Scheme.js";
import ActivityLog from "../models/ActivityLog.js";

// GET /api/v1/schemes
export const getSchemes = async (req, res) => {
  try {
    const { category, active = "true", page = 1, limit = 20 } = req.query;
    const filter = {};
    if (active === "true") filter.isActive = true;
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const [schemes, total] = await Promise.all([
      Scheme.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Scheme.countDocuments(filter),
    ]);
    res.json({ schemes, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch schemes", error: err.message });
  }
};

// GET /api/v1/schemes/:id
export const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ msg: "Scheme not found" });
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch scheme", error: err.message });
  }
};

// POST /api/v1/schemes — govt adds scheme
export const createScheme = async (req, res) => {
  try {
    if (req.user.role !== "government") {
      return res.status(403).json({ msg: "Only government officials can add schemes" });
    }
    const scheme = await Scheme.create({ ...req.body, createdBy: req.user.email });

    await ActivityLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      userRole: req.user.role,
      action: "create_scheme",
      description: `New scheme created: ${scheme.name}`,
    });

    res.status(201).json(scheme);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create scheme", error: err.message });
  }
};

// PATCH /api/v1/schemes/:id — govt updates scheme
export const updateScheme = async (req, res) => {
  try {
    if (req.user.role !== "government") {
      return res.status(403).json({ msg: "Only government officials can update schemes" });
    }
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scheme) return res.status(404).json({ msg: "Scheme not found" });
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update scheme", error: err.message });
  }
};

// DELETE /api/v1/schemes/:id
export const deleteScheme = async (req, res) => {
  try {
    if (req.user.role !== "government") {
      return res.status(403).json({ msg: "Only government officials can delete schemes" });
    }
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) return res.status(404).json({ msg: "Scheme not found" });
    res.json({ msg: "Scheme deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete scheme", error: err.message });
  }
};
