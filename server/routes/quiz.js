import express from "express";
import { getQuizzesByCourse, getQuiz, submitQuiz, getMyResults } from "../controllers/quiz.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/my-results", protect, getMyResults);
router.get("/course/:courseId", protect, getQuizzesByCourse);
router.get("/:id", protect, getQuiz);
router.post("/:id/submit", protect, submitQuiz);

export default router;
