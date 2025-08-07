import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/express";

export const updateProfile = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, { new: true });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({ user });
});

export const syncUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(400).json({ error: "User ID not found in request" });
  }

  // check if user already exists in mongodb
  const existingUser = await User.findOne({ clerkId: userId });
  if (existingUser) {
    return res.status(200).json({ user: existingUser, message: "User already exists" });
  }

  // create new user from Clerk data
  const clerkUser = await clerkClient.users.getUser(userId);

  if (!clerkUser) {
    return res.status(404).json({ error: "User not found in Clerk" });
  }

  // Ensure we have required data
  if (!clerkUser.emailAddresses || clerkUser.emailAddresses.length === 0) {
    return res.status(400).json({ error: "User email not found" });
  }

  const userData = {
    clerkId: userId,
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    email: clerkUser.emailAddresses[0].emailAddress,
    phoneNumber: clerkUser.phoneNumbers?.[0]?.phoneNumber || "",
    location: clerkUser.publicMetadata?.location || "",
  };

  const user = await User.create(userData);

  res.status(201).json({ user, message: "User created successfully" });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(400).json({ error: "User ID not found in request" });
  }

  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({ user });
});


