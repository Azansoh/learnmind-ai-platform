import express from "express";
import { askAI, generateQuiz } from "../controllers/ai.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/ask", protect, askAI);
router.post("/generate-quiz", protect, generateQuiz);

export default router;
