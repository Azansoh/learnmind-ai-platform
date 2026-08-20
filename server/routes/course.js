import express from "express";
import {
  getAllCourses,
  getCourseById,
  getMyCourses,
  enrollInCourse,
  unenrollFromCourse,
  getLesson,
  completeLesson,
  getProgress,
} from "../controllers/course.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/my-courses", protect, getMyCourses);
router.get("/progress", protect, getProgress);
router.get("/:id", getCourseById);
router.post("/:courseId/enroll", protect, enrollInCourse);
router.delete("/:courseId/unenroll", protect, unenrollFromCourse);
router.get("/:courseId/lesson/:lessonId", protect, getLesson);
router.post("/:courseId/lesson/:lessonId/complete", protect, completeLesson);

export default router;
