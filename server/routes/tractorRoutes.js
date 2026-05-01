import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getTractors,
  getTractorById,
  createTractor,
  updateTractor,
  deleteTractor,
} from "../controllers/tractorController.js";

const router = express.Router();

router.get("/", getTractors);
router.get("/:id", getTractorById);
router.post("/", protect, createTractor);
router.patch("/:id", protect, updateTractor);
router.delete("/:id", protect, deleteTractor);

export default router;
