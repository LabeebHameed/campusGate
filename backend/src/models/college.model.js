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
    description: {
      type: String,
      default: "",
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
      default: false,
    },
    type: {
      type: String,
      default: "",
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
  },
  { timestamps: true }
);

const College = mongoose.model("College", collegeSchema);

export default College;
