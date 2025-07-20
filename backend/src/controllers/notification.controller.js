import asyncHandler from "express-async-handler";
import Notification from "../models/notification.model.js";
import { getAuth } from "@clerk/express";

// CREATE notification (system or admin)
export const createNotification = asyncHandler(async (req, res) => {
  const { recipientId, content, type } = req.body;

  if (!recipientId || !content || !type) {
    return res.status(400).json({ error: "Missing notification fields" });
  }

  const notification = await Notification.create({
    id: generateUniqueId(),
    recipientId,
    content,
    type,
    readStatus: false,
    createdAt: new Date(),
  });

  res.status(201).json({ notification });
});

// GET all notifications for logged user
export const getUserNotifications = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const notifications = await Notification.find({ recipientId: userId }).sort({ createdAt: -1 });
  res.status(200).json({ notifications });
});

// PATCH mark notification as read
export const markAsRead = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { id } = req.params;
  const notification = await Notification.findOneAndUpdate(
    { id, recipientId: userId },
    { readStatus: true },
    { new: true }
  );
  if (!notification) return res.status(404).json({ error: "Notification not found" });
  res.status(200).json({ notification });
});
