import mongoose from "mongoose";
//Course Model
const courseSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    collegeId: {
      type: String,
      required: true,
      ref: "College", 
    }, // Reference to College
    programType: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    eligibilityCriteria: {
      type: String,
      default: "",
    },
    fee: {
      type: Number,
      required: true,
    },
    syllabusOutline: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicationStart: {
      type: Date,
      required: true,
    },
    applicationEnd: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
