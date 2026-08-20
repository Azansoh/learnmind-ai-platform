import express from "express";
import { getMyActivities } from "../controllers/activity.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getMyActivities);

export default router;
