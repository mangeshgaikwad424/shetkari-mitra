import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getJobs,
  getJobById,
  createJob,
  applyForJob,
  updateJob,
} from "../controllers/jobController.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", protect, createJob);
router.post("/:id/apply", protect, applyForJob);
router.patch("/:id", protect, updateJob);

export default router;
