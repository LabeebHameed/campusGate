import mongoose from "mongoose";
// Notification Model
const notificationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      ref: "User", 
      unique: true,
    },
    recipientId: {
      type: String,
      ref: "User", 
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["status_update", "payment", "deadline", "action_required"],
      required: true,
    },
    readStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true } }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
