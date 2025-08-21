import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    if (!ENV.MONGO_URI) {
      throw new Error("MONGO_URI is not set. Add it to your environment variables.");
    }

    await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error?.message || error);
    // Helpful hints for common failures without leaking secrets
    console.error(
      "Check that your MONGO_URI is correct, credentials are URL-encoded, Atlas IP access allows your server, and network egress is permitted."
    );
    process.exit(1);
  }
};
