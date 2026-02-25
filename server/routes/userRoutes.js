import express from "express";
import {
  getUserData,
  storeRecentSearchedCities,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUserData);
router.post("/store-recent-search", storeRecentSearchedCities);

export default router;
