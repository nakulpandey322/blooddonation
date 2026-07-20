import express from "express";
import { searchDonors, toggleAvailability, updateLocation, leaderboard } from "../controllers/donorController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, searchDonors);
router.get("/leaderboard", leaderboard);
router.patch("/availability", protect, restrictTo("donor"), toggleAvailability);
router.patch("/location", protect, restrictTo("donor"), updateLocation);

export default router;
