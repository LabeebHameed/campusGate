import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/user.route.js";
import courseRoutes from "./routes/course.route.js";
import collegeRoutes from "./routes/college.route.js";
import applicationRoutes from "./routes/application.route.js";
import documentRoutes from "./routes/document.route.js";
import notificationRoutes from "./routes/notification.route.js";

// import commentRoutes from "./routes/comment.route.js";
// import notificationRoutes from "./routes/notification.route.js";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
// Arcjet import kept but disabled below
// import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";

const app = express();

// lightweight health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use(cors());
app.use(express.json());

// Validate required envs early
const missingEnv = [
  ["MONGO_URI", ENV.MONGO_URI],
  ["CLERK_PUBLISHABLE_KEY", ENV.CLERK_PUBLISHABLE_KEY],
  ["CLERK_SECRET_KEY", ENV.CLERK_SECRET_KEY],
].filter(([_, v]) => !v);
if (missingEnv.length > 0) {
  const names = missingEnv.map(([n]) => n).join(", ");
  console.error(`Missing required environment variables: ${names}`);
}

// Proper Clerk middleware for Express
app.use(clerkMiddleware());
// Temporarily disable Arcjet to test server startup
// app.use(arcjetMiddleware);

app.get("/", (req, res) => res.send("Hello from server"));

app.use("/api/users", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/college", collegeRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/notifications", notificationRoutes);

// error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();

    // listen for local development
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));
    }
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

<<<<<<< HEAD
export default app;
=======
export default app;
>>>>>>> 7045b0e698edfdf9fcb98496973137e8ef098549
