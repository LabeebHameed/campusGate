import mongoose from "mongoose";
//Document Model
const studentSchema = new mongoose.Schema(
  {
    userId: { // Reference to User _id
      type: String,
      ref: "User",
      required: true,
      unique: true,
    },
    academicRecords: [
      {
        year: String,
        grade: String,
      },
    ],
    testScores: [
      {
        examName: String,
        score: String,
        date: Date,
      },
    ],
    preferences: [String], // Array of Course IDs
    personalStatement: {
      type: String,
      default: "",
    },
    uploadedDocuments: [String], // Array of Document IDs
  },
  { timestamps: true }
);


const Student = mongoose.model("Student", studentSchema);

export default Student;
