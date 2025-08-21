import mongoose from "mongoose";
import crypto from 'crypto';

// Counter models for auto-increment
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 }
});

const Counter = mongoose.model("Counter", CounterSchema);

/**
 * Get the next sequence number for a given counter
 * @param {string} counterName - The name of the counter
 * @returns {Promise<number>} The next sequence number
 */
const getNextSequence = async (counterName) => {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

/**
 * Generate a unique course ID in format: "${CollegeID}-${Auto Increment From 001}"
 * @param {string} collegeId - The college ID
 * @returns {Promise<string>} The generated course ID
 */
export const generateCourseId = async (collegeId) => {
  const sequence = await getNextSequence(`course_${collegeId}`);
  return `${collegeId}-${sequence.toString().padStart(3, '0')}`;
};

/**
 * Generate a unique application ID in format: "${CollegeID}-${User ID}-${Auto Increment From 001}"
 * @param {string} collegeId - The college ID
 * @param {string} userId - The user ID
 * @returns {Promise<string>} The generated application ID
 */
export const generateApplicationId = async (collegeId, userId) => {
  const sequence = await getNextSequence(`application_${collegeId}_${userId}`);
  return `${collegeId}-${userId}-${sequence.toString().padStart(3, '0')}`;
};

/**
 * Generate a unique document ID in format: "${User ID}-DOC-${Auto Increment From 001}"
 * @param {string} userId - The user ID
 * @returns {Promise<string>} The generated document ID
 */
export const generateDocumentId = async (userId) => {
  const sequence = await getNextSequence(`document_${userId}`);
  return `${userId}-DOC-${sequence.toString().padStart(3, '0')}`;
};

/**
 * Generate a unique ID using crypto.randomUUID() (kept for backward compatibility)
 * This creates a version 4 UUID which is cryptographically secure and unique
 * @returns {string} A unique UUID string
 */
export const generateUniqueId = () => {
  return crypto.randomUUID();
};

/**
 * Alternative method using crypto.randomBytes if randomUUID is not available
 * @returns {string} A unique hex string
 */
export const generateShortId = () => {
  return crypto.randomBytes(4).toString('hex');
};
