import asyncHandler from "express-async-handler";
import College from "../models/college.model.js";
import { generateUniqueId } from "../utils/idGenerator.js";


// List all colleges (public)
export const getAllColleges = asyncHandler(async (req, res) => {
  const filters = req.query; // Add filter logic as needed
  const college = await College.find(filters);
  res.status(200).json({ college });
});

// Get single college by ID (public)
export const getCollegeById = asyncHandler(async (req, res) => {
  const college = await College.findOne({ id: req.params.id });
  if (!college) return res.status(404).json({ error: "Not found" });
  res.status(200).json({ college });
});

// Create a new college (Admin/Rep only)
export const createCollege = asyncHandler(async (req, res) => {
  // Add role check here if needed
  const college = await College.create({
    ...req.body,
    id: generateUniqueId(), // Use your UUID/v4 logic
  });
  res.status(201).json({ college });
});

// Update a college (Admin/Rep only)
export const updateCollege = asyncHandler(async (req, res) => {
  // Add role check here if needed
  const updated = await College.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.status(200).json({ college: updated });
});

// Delete a college (Admin/Rep only)
export const deleteCollege = asyncHandler(async (req, res) => {
  // Add role check here if needed
  const deleted = await College.findOneAndDelete({ id: req.params.id });
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});
