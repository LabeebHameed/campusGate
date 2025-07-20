import mongoose from "mongoose";
//Application Model
const applicationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    studentId: {// Reference to StudentProfile
      type: String,
      ref: "User",
      required: true,
    }, 
    courseId: {// Reference to Course
      type: String,
      ref: "Course",
      required: true,
    }, // Reference to Course
    status: {
      type: String,
      enum: [
        "draft",
        "payment_pending",
        "submitted",
        "under_review",
        "accepted",
        "rejected",
      ],
      required: true,
    },
    submittedDocuments: [String], // Array of Document IDs
    remarks: {
      type: String,
      default: "",
    },
    paymentId: {
      type: String,
      default: null,
    }, // Reference to Payment
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
