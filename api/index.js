import { app } from "../server/app.js";
import connectDB from "../server/config/db.js";

// Connect to MongoDB on cold start; mongoose buffers queries until ready.
connectDB().catch((err) => {
  console.error("MongoDB connection error:", err.message);
});

export default app;