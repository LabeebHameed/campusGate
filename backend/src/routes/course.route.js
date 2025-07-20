import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { protectAdminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/:id", getCourseById);

router.post("/", protectAdminRoute, createCourse);        // College Rep/Admin only
router.put("/:id", protectAdminRoute, updateCourse);      // College Rep/Admin only
router.delete("/:id", protectAdminRoute, deleteCourse);   // College Rep/Admin only

export default router;
