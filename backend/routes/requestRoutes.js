import express from "express";
import {
  createRequest,
  getRequests,
  getRequestById,
  respondToRequest,
  cancelRequest,
  fulfillRequest,
} from "../controllers/requestController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.post("/", restrictTo("patient", "hospital", "admin"), createRequest);
router.get("/", getRequests);
router.get("/:id", getRequestById);
router.patch("/:id/respond", restrictTo("donor"), respondToRequest);
router.patch("/:id/cancel", cancelRequest);
router.patch("/:id/fulfill", restrictTo("patient", "hospital", "admin"), fulfillRequest);

export default router;
