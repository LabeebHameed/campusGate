import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/express";

/**
 * Update the current user's profile in MongoDB by Clerk userId.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, { new: true });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({ user });
});

/**
 * Idempotently sync the Clerk user into MongoDB. Links by email to avoid duplicates.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
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
  let clerkUser;
  try {
    clerkUser = await clerkClient.users.getUser(userId);
  } catch {
    return res.status(502).json({ error: "Failed to retrieve user from Clerk. Check CLERK_SECRET_KEY and network." });
  }

  if (!clerkUser) {
    return res.status(404).json({ error: "User not found in Clerk" });
  }
  if (!clerkUser.emailAddresses || clerkUser.emailAddresses.length === 0) {
    return res.status(400).json({ error: "User email not found" });
  }

  // Prefer Clerk's primaryEmailAddressId when available
  const primaryEmailId = clerkUser.primaryEmailAddressId;
  const primaryEmail =
    clerkUser.emailAddresses.find((e) => e.id === primaryEmailId)?.emailAddress ||
    clerkUser.emailAddresses[0].emailAddress;

  const phone = clerkUser.phoneNumbers?.[0]?.phoneNumber || "";
  const location = clerkUser.publicMetadata?.location || "";
  const roleFromClerk = clerkUser.publicMetadata?.role;

  // If a user exists with same email, link it to this Clerk account instead of creating a duplicate
  const existingByEmail = await User.findOne({ email: primaryEmail });
  if (existingByEmail) {
    existingByEmail.clerkId = userId;
    existingByEmail.firstName = clerkUser.firstName || existingByEmail.firstName;
    existingByEmail.lastName = clerkUser.lastName || existingByEmail.lastName;
    existingByEmail.phoneNumber = phone || existingByEmail.phoneNumber;
    existingByEmail.location = location || existingByEmail.location;
    if (roleFromClerk) {
      existingByEmail.role = roleFromClerk;
    }

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
    ...(roleFromClerk ? { role: roleFromClerk } : {}),
  };

  try {
    const user = await User.create(userData);
    return res.status(201).json({ user, message: "User created successfully" });
  } catch (err) {
    // Handle duplicate key errors gracefully (race conditions or prior partial inserts)
    if (err && err.code === 11000) {
      const existing = await User.findOne({
        $or: [{ clerkId: userId }, { email: primaryEmail }],
      });
      if (existing) {
        return res.status(200).json({ user: existing, message: "User already exists" });
      }
    }
    throw err;
  }
});

/**
 * Get the current user from MongoDB by Clerk userId.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
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


