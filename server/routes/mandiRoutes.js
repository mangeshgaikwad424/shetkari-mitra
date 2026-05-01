import express from "express";
import { getMandiPrices } from "../controllers/mandiController.js";

const router = express.Router();
router.get("/", getMandiPrices);

export default router;
