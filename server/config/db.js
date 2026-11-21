import mongoose from "mongoose";

// Serverless functions are reused across requests, so cache one connection
// promise instead of calling mongoose.connect() on every cold start.
let connectionPromise = null;

const connectDB = async () => {
  // Warm invocation: the connection is already open, nothing to do.
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "MONGO_URI is not set. Add it to the learnmind-ai-server Vercel project (Settings > Environment Variables) and redeploy."
    );
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      // Fail fast with the real cause instead of buffering queries for 10s.
      bufferCommands: false,
    });
  }

  try {
    const conn = await connectionPromise;

    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection is not ready");
    }

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // Clear the cached promise so the next request can try again.
    connectionPromise = null;
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
