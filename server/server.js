import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { app } from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

// Set __dirname manually for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Serve the frontend build whenever it exists (independent of NODE_ENV)
const candidates = [
  path.join(process.cwd(), "client", "dist"),
  path.join(process.cwd(), "server", "client", "dist"),
  path.resolve(__dirname, "..", "client", "dist"),
];

let clientBuild = null;
for (const dir of candidates) {
  if (fs.existsSync(dir) && fs.existsSync(path.join(dir, "index.html"))) {
    clientBuild = dir;
    break;
  }
}

if (clientBuild) {
  console.log("Serving client from:", clientBuild);

  // Serve static frontend assets (js, css, images)
  app.use(express.static(clientBuild));

  // Handle single-page app (SPA) fallback routing for React Router
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      res.sendFile(path.join(clientBuild, "index.html"));
    } else {
      next();
    }
  });
} else {
  console.error("Client build not found! Tried directories:", candidates);
}

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
});