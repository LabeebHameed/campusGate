import mongoose from "mongoose";
import { generateCourseId, generateApplicationId, generateDocumentId } from "../utils/idGenerator.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Test the ID generators
const testIdGenerators = async () => {
  try {
    console.log("Testing ID Generators...\n");

    // Test Course ID generation
    const collegeId = "COLL001";
    console.log("Testing Course ID generation:");
    for (let i = 0; i < 3; i++) {
      const courseId = await generateCourseId(collegeId);
      console.log(`  Course ${i + 1}: ${courseId}`);
    }

    // Test Application ID generation
    const userId = "USER123";
    console.log("\nTesting Application ID generation:");
    for (let i = 0; i < 3; i++) {
      const applicationId = await generateApplicationId(collegeId, userId);
      console.log(`  Application ${i + 1}: ${applicationId}`);
    }

    // Test Document ID generation
    console.log("\nTesting Document ID generation:");
    for (let i = 0; i < 3; i++) {
      const documentId = await generateDocumentId(userId);
      console.log(`  Document ${i + 1}: ${documentId}`);
    }

    console.log("\n✅ All ID generators working correctly!");

  } catch (error) {
    console.error("❌ Error testing ID generators:", error);
  }
};

// Run the test
const runTest = async () => {
  await connectDB();
  await testIdGenerators();
  await mongoose.disconnect();
  console.log("\nTest completed. Database disconnected.");
};

runTest().catch(console.error);
