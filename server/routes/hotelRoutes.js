import express from "express";
import {
  getAllHotels,
  getHotel,
} from "../controllers/hotelController.js";

const router = express.Router();

// ✅ PUBLIC – for homepage & recommended hotels
router.get("/", getAllHotels);

// ✅ PUBLIC – get single hotel
router.get("/:id", getHotel);

export default router;
