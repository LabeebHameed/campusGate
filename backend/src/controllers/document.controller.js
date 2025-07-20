import asyncHandler from "express-async-handler";
import Document from "../models/document.model.js";
import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";


// Upload a new document

export const uploadDocument = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { type } = req.body;
  const documentFile = req.file;

  if (!type || !documentFile) {
    return res.status(400).json({ error: "Must provide document type and file" });
  }

  // Check user exists
  const user = await User.findOne({ clerkId: userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  let fileUrl = "";

  // Upload document to Cloudinary
  try {
    const base64File = `data:${documentFile.mimetype};base64,${documentFile.buffer.toString("base64")}`;

    const uploadResponse = await cloudinary.uploader.upload(base64File, {
      folder: "campus-gate/documents",
      resource_type: "auto",
      transformation: [
        // Optional: file/image transformations
        { quality: "auto" },
        { format: "auto" },
      ],
    });
    fileUrl = uploadResponse.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(400).json({ error: "Failed to upload document" });
  }

  const document = await Document.create({
    id: generateUniqueId(),      // Your preferred ID logic
    ownerId: user._id,
    type,
    fileUrl,
    verifiedStatus: "pending",
    uploadedAt: new Date(),
  });

  res.status(201).json({ document });
});

// Get all documents for current user
export const getDocuments = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const documents = await Document.find({ ownerId: userId });
  res.status(200).json({ documents });
});

// Delete a document (only by owner)
export const deleteDocument = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { id } = req.params;
  const deleted = await Document.findOneAndDelete({ id, ownerId: userId });
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

// (Optional) Verify a document (admin/rep)
export const verifyDocument = asyncHandler(async (req, res) => {
  // Ensure only admin/rep can do this via additional middleware or checks
  const { id } = req.params;
  const { verifiedStatus, verifiedBy } = req.body; // 'verified' or 'rejected'
  const document = await Document.findOneAndUpdate(
    { id },
    { verifiedStatus, verifiedBy },
    { new: true }
  );
  if (!document) return res.status(404).json({ error: "Not found" });
  res.status(200).json({ document });
});
