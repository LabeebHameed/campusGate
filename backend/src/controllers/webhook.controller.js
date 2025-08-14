import asyncHandler from "express-async-handler";
import { Webhook } from "svix";
import User from "../models/user.model.js";
import { ENV } from "../config/env.js";

/**
 * Handle Clerk webhook events for user creation and updates
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
export const handleClerkWebhook = asyncHandler(async (req, res) => {
  // Get the headers and body
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Error occurred -- no svix headers" });
  }

  // Get the body
  const payload = JSON.stringify(req.body);
  const body = payload;

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(ENV.CLERK_WEBHOOK_SECRET);

  let evt;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).json({ error: "Error occurred" });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log(`Webhook received: ${eventType}`);

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, phone_numbers, public_metadata } = evt.data;

    // Get primary email
    const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id)?.email_address || email_addresses[0]?.email_address;

    if (!primaryEmail) {
      console.error("No email found for user:", id);
      return res.status(400).json({ error: "No email found for user" });
    }

    // Extract additional data
    const phone = phone_numbers?.[0]?.phone_number || "";
    const location = public_metadata?.location || "";
    const roleFromClerk = public_metadata?.role;

    try {
      if (eventType === "user.created") {
        // Check if user already exists (prevent duplicates)
        const existingUser = await User.findOne({
          $or: [{ clerkId: id }, { email: primaryEmail }]
        });

        if (existingUser) {
          // If user exists, update with Clerk ID
          existingUser.clerkId = id;
          existingUser.firstName = first_name || existingUser.firstName;
          existingUser.lastName = last_name || existingUser.lastName;
          existingUser.phoneNumber = phone || existingUser.phoneNumber;
          existingUser.location = location || existingUser.location;
          if (roleFromClerk) {
            existingUser.role = roleFromClerk;
          }

          await existingUser.save();
          console.log("Linked existing user:", existingUser._id);
        } else {
          // Create new user
          const userData = {
            clerkId: id,
            firstName: first_name || "",
            lastName: last_name || "",
            email: primaryEmail,
            phoneNumber: phone,
            location,
            ...(roleFromClerk ? { role: roleFromClerk } : {}),
          };

          const newUser = await User.create(userData);
          console.log("Created new user:", newUser._id);
        }
      } else if (eventType === "user.updated") {
        // Update existing user
        const existingUser = await User.findOne({ clerkId: id });
        
        if (existingUser) {
          existingUser.firstName = first_name || existingUser.firstName;
          existingUser.lastName = last_name || existingUser.lastName;
          existingUser.email = primaryEmail;
          existingUser.phoneNumber = phone || existingUser.phoneNumber;
          existingUser.location = location || existingUser.location;
          if (roleFromClerk) {
            existingUser.role = roleFromClerk;
          }

          await existingUser.save();
          console.log("Updated user:", existingUser._id);
        } else {
          console.warn("User not found for update:", id);
        }
      }
    } catch (error) {
      console.error("Error processing user webhook:", error);
      return res.status(500).json({ error: "Error processing user data" });
    }
  }

  return res.status(200).json({ message: "Webhook processed successfully" });
});
