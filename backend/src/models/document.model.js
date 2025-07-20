import mongoose from "mongoose";
//Document Model
const documentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  ownerId: {
    type: String,
    required: true,
    ref: "User", 
  }, // Reference to User or StudentProfile
  type: {
    type: String,
    enum: ["transcript", "id", "recommendation", "certificate", "other"],
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  verifiedStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  verifiedBy: {
    type: String,
    default: null,
  }, // Admin ID
},
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
