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

  // If a user already exists for this Clerk user, return it
  const existingByClerk = await User.findOne({ clerkId: userId });
  if (existingByClerk) {
    return res.status(200).json({ user: existingByClerk, message: "User already exists" });
  }

  // Fetch from Clerk to construct/create or link
  const clerkUser = await clerkClient.users.getUser(userId);
  if (!clerkUser) {
    return res.status(404).json({ error: "User not found in Clerk" });
  }
  if (!clerkUser.emailAddresses || clerkUser.emailAddresses.length === 0) {
    return res.status(400).json({ error: "User email not found" });
  }

  const primaryEmail = clerkUser.emailAddresses[0].emailAddress;
  const phone = clerkUser.phoneNumbers?.[0]?.phoneNumber || "";
  const location = clerkUser.publicMetadata?.location || "";

  // If a user exists with same email, link it to this Clerk account instead of creating a duplicate
  const existingByEmail = await User.findOne({ email: primaryEmail });
  if (existingByEmail) {
    existingByEmail.clerkId = userId;
    existingByEmail.firstName = clerkUser.firstName || existingByEmail.firstName;
    existingByEmail.lastName = clerkUser.lastName || existingByEmail.lastName;
    existingByEmail.phoneNumber = phone || existingByEmail.phoneNumber;
    existingByEmail.location = location || existingByEmail.location;

    const updated = await existingByEmail.save();
    return res.status(200).json({ user: updated, message: "Linked existing user by email" });
  }

  // Otherwise, create fresh
  const userData = {
    clerkId: userId,
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    email: primaryEmail,
    phoneNumber: phone,
    location,
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


