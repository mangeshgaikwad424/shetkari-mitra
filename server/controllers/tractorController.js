import Tractor from "../models/Tractor.js";
import ActivityLog from "../models/ActivityLog.js";

// GET /api/v1/tractors — list with search + filters + pagination
export const getTractors = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, available, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (location) filter.location = { $regex: location, $options: "i" };
    if (available === "true") filter.available = true;
    if (minPrice || maxPrice) {
      filter.priceAmount = {};
      if (minPrice) filter.priceAmount.$gte = Number(minPrice);
      if (maxPrice) filter.priceAmount.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [tractors, total] = await Promise.all([
      Tractor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Tractor.countDocuments(filter),
    ]);

    res.json({
      tractors,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch tractors", error: err.message });
  }
};

// GET /api/v1/tractors/:id
export const getTractorById = async (req, res) => {
  try {
    const tractor = await Tractor.findById(req.params.id);
    if (!tractor) return res.status(404).json({ msg: "Tractor not found" });
    res.json(tractor);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch tractor", error: err.message });
  }
};

// POST /api/v1/tractors — tractor owner adds
export const createTractor = async (req, res) => {
  try {
    const { title, description, brand, model, year, location, price, priceAmount, phone, horsepower, features } = req.body;
    const tractor = await Tractor.create({
      ownerEmail: req.user.email,
      ownerName: req.user.name,
      title, description, brand, model, year,
      location, price, priceAmount, phone, horsepower,
      features: features || [],
      images: [],
    });

    await ActivityLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      userRole: req.user.role,
      action: "create_tractor",
      description: `Tractor listed: ${title} at ${location}`,
    });

    res.status(201).json(tractor);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create tractor", error: err.message });
  }
};

// PATCH /api/v1/tractors/:id
export const updateTractor = async (req, res) => {
  try {
    const tractor = await Tractor.findById(req.params.id);
    if (!tractor) return res.status(404).json({ msg: "Tractor not found" });
    if (tractor.ownerEmail !== req.user.email) return res.status(403).json({ msg: "Not authorized" });

    Object.assign(tractor, req.body);
    await tractor.save();
    res.json(tractor);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update tractor", error: err.message });
  }
};

// DELETE /api/v1/tractors/:id
export const deleteTractor = async (req, res) => {
  try {
    const tractor = await Tractor.findById(req.params.id);
    if (!tractor) return res.status(404).json({ msg: "Tractor not found" });
    if (tractor.ownerEmail !== req.user.email && req.user.role !== "government") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    await tractor.deleteOne();
    res.json({ msg: "Tractor removed" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete tractor", error: err.message });
  }
};
