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

// Configure CORS
const allowedOrigins = [
  'https://campus-gate.vercel.app',
  'https://campus-gate-mobile.vercel.app',
  'http://localhost:3000',
  'http://localhost:5001'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
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

// For Vercel deployment, just connect to DB
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");
    
    // Start the HTTP server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://192.168.1.4:${PORT}`);
      console.log(`Server also accessible on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  }
};

// Start server (both local and Vercel will connect to DB)
startServer();

export default app;
