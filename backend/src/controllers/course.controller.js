import asyncHandler from "express-async-handler";
import Course from "../models/course.model.js";

// List all courses (public endpoint)
export const getAllCourses = asyncHandler(async (req, res) => {
  const filters = req.query; // Add filter logic as needed
  const courses = await Course.find(filters);
  res.status(200).json({ courses });
});

// Get course by ID
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ id: req.params.id });
  if (!course) return res.status(404).json({ error: "Not found" });
  res.status(200).json({ course });
});

// Create course (Protected)
export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create({ ...req.body, id: generateUniqueId() });
  res.status(201).json({ course });
});

// Update course (Protected)
export const updateCourse = asyncHandler(async (req, res) => {
  const updated = await Course.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.status(200).json({ course: updated });
});

// Delete course (Protected)
export const deleteCourse = asyncHandler(async (req, res) => {
  const deleted = await Course.findOneAndDelete({ id: req.params.id });
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});
