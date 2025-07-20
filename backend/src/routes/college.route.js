import express from "express";
import {
  getAllColleges,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege,
} from "../controllers/college.controller.js";
import { protectAdminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllColleges);                      
router.get("/:id", getCollegeById);                      

router.post("/", protectAdminRoute, createCollege);           // Admin/Rep only
router.put("/:id", protectAdminRoute, updateCollege);         // Admin/Rep only
router.delete("/:id", protectAdminRoute, deleteCollege);      // Admin/Rep only

export default router;
