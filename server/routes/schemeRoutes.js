import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
} from "../controllers/schemeController.js";

const router = express.Router();

router.get("/", getSchemes);
router.get("/:id", getSchemeById);
router.post("/", protect, createScheme);
router.patch("/:id", protect, updateScheme);
router.delete("/:id", protect, deleteScheme);

export default router;
