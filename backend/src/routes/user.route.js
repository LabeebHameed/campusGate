import express from "express";
import {
  getCurrentUser,
  syncUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


// protected routes
router.post("/sync", protectRoute, syncUser);
router.get("/me", protectRoute, getCurrentUser);
router.put("/profile", protectRoute, updateProfile);

export default router;
