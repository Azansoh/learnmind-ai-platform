import express from "express";
import { getMyPlan, updateGoal, addTask, toggleTask, deleteTask } from "../controllers/studyplan.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getMyPlan);
router.put("/goal", protect, updateGoal);
router.post("/task", protect, addTask);
router.put("/task/:taskId/toggle", protect, toggleTask);
router.delete("/task/:taskId", protect, deleteTask);

export default router;
