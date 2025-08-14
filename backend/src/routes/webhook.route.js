import express from "express";
import { handleClerkWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

// Clerk webhook endpoint (no authentication required)
router.post("/clerk", handleClerkWebhook);

export default router;
