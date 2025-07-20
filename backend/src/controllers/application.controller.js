import asyncHandler from "express-async-handler";
import Application from "../models/application.model.js";
import { getAuth } from "@clerk/express";

// Apply to a course
export const applyToCourse = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { courseId, submittedDocuments } = req.body;

  // Optionally: ensure no duplicate applications for same course
  const alreadyExists = await Application.findOne({ studentId: userId, courseId });
  if (alreadyExists) 
    return res.status(400).json({ error: "Already applied to this course." });

  const application = await Application.create({
    id: generateUniqueId(), // Use your preferred UUID or logic
    studentId: userId,
    courseId,
    submittedDocuments,
    status: "draft",
  });

  res.status(201).json({ application });
});

// Get all applications for current user
export const getUserApplications = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const applications = await Application.find({ studentId: userId });
  res.status(200).json({ applications });
});

// Get a specific application
export const getApplicationById = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { id } = req.params;
  const application = await Application.findOne({ id, studentId: userId });
  if (!application) return res.status(404).json({ error: "Not found" });
  res.status(200).json({ application });
});

// Update application (e.g., change status, add documents)
export const updateApplication = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { id } = req.params;
  const updated = await Application.findOneAndUpdate(
    { id, studentId: userId },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.status(200).json({ application: updated });
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const deleted = await Application.findOneAndDelete({ id: req.params.id });
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});
