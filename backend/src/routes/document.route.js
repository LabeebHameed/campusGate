import express from "express";
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
  verifyDocument,
} from "../controllers/document.controller.js";
import { protectRoute,protectAdminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, uploadDocument);            // Student: Upload a document
router.get("/", protectRoute, getDocuments);               // Student: Get their documents
router.delete("/:id", protectRoute, deleteDocument);       // Student: Delete one document

router.patch("/:id/verify", protectAdminRoute, verifyDocument); // Admin/Rep: Optionally verify a document (add your role-based middleware)


export default router;
