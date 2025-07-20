import express from "express";
import {
  applyToCourse,
  getUserApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
} from "../controllers/application.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, applyToCourse);           // Create new application
router.get("/", protectRoute, getUserApplications);      // View all applications for logged-in user
router.get("/:id", protectRoute, getApplicationById);    // Get specific application by ID
router.patch("/:id", protectRoute, updateApplication);   // Update application (add docs, change status, etc.)
router.delete("/:id", protectRoute, deleteApplication);   // College Rep/Admin only


export default router;
