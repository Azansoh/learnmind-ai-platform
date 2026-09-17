import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/course.js";
import quizRoutes from "./routes/quiz.js";
import studyplanRoutes from "./routes/studyplan.js";
import activityRoutes from "./routes/activity.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();

const app = express();

const isProduction =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === undefined;

app.use(
  cors({
    origin: isProduction ? true : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "LearnMind AI server is running",
    production: isProduction,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/studyplan", studyplanRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/ai", aiRoutes);

// Global Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Server error" });
});

export { app, isProduction };