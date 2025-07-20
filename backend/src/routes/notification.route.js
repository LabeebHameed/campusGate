import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
} from "../controllers/notification.controller.js";
import { protectRoute,protectAdminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectAdminRoute, createNotification);             // Could restrict to system/admin actions
router.get("/", protectRoute, getUserNotifications);            // Get current user's notifications
router.patch("/:id/read", protectRoute, markAsRead);            // Mark a notification as read

export default router;
