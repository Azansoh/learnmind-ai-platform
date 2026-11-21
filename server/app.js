import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
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

const allowedOrigins = [
  "https://learnmind-ai-client-zeta.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser / same-origin requests with no Origin header
    if (!origin) {
      return callback(null, true);
    }

    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/learnmind-ai-client-[a-z0-9-]+-azan-0a1e\.vercel\.app$/.test(
        origin
      )
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Health Check API (always responds, even when MongoDB is unreachable)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "LearnMind AI server is running",
    production: isProduction,
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Database diagnostic: returns the real MongoDB error instead of a
// "buffering timed out" message. Useful on Vercel cold starts.
app.get("/api/health/db", async (req, res, next) => {
  try {
    await connectDB();
    await mongoose.connection.db.admin().ping();
    res.json({
      status: "ok",
      db: "connected",
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    });
  } catch (error) {
    next(error);
  }
});

// Every DB-backed route waits for a live connection first. This prevents
// cold-start requests from buffering until the 10s timeout.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
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
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

export { isProduction };
export default app;