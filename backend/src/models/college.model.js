import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "",
      // This was previously "description" but now represents college category
    },
    state: {
      type: String,
      default: "",
    },
    district: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    establishYear: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: "",
      // College type (different from category)
    },
    manegement: {
      type: String,
      default: "",
    },
    universityName: {
      type: String,
      default: "",
    },
    universityType: {
      type: String,
      default: "",
    },
    // Additional fields for enhanced functionality
    description: {
      type: String,
      default: "",
      // Actual description text for UI
    },
    image: {
      type: String,
      default: "",
      // College image URL
    },
    rating: {
      type: String,
      default: "4.0",
      // College rating as string
    },
    reviews: {
      type: String,
      default: "0 Reviews",
      // Review count display
    },
    courses: [{
      type: String,
      // Array of course IDs offered by this college
    }],
    feeRange: {
      type: String,
      default: "",
      // Fee range display (e.g., "₹20,000 - ₹50,000 per semester")
    },
    isActive: {
      type: Boolean,
      default: true,
      // Whether college is active
    },
  },
  { timestamps: true }
);

const College = mongoose.model("College", collegeSchema);

export default College;
