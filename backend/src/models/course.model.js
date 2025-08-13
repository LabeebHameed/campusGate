import mongoose from "mongoose";

// Fee structure subdocument schema
const feeStructureSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  fee: {
    type: String,
    required: true,
  },
  application: {
    type: String,
    required: true,
  },
  other: {
    type: String,
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
}, { _id: false });

// Course Model
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
      // Base fee amount
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
    // Additional fields for UI enhancement
    subtitle: {
      type: String,
      default: "",
      // Course subtitle for display
    },
    type: {
      type: String,
      default: "",
      // Course type (UG, PG, etc.)
    },
    category: {
      type: String,
      default: "",
      // Course category (Science, Engineering, etc.)
    },
    feeStructure: [feeStructureSchema],
    // Detailed fee structure by year
    rating: {
      type: String,
      default: "4.0",
      // Course rating as string
    },
    image: {
      type: String,
      default: "",
      // Course image URL
    },
    prerequisites: {
      type: String,
      default: "",
      // Course prerequisites
    },
    outcomes: {
      type: String,
      default: "",
      // Learning outcomes
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
