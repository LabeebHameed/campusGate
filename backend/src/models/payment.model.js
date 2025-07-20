import mongoose from "mongoose";
// Payment Model
const paymentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      required: true,
      ref: "User", 
    },
    applicationId: {
      type: String,
      required: true,
      ref: "Application", 
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "bank_transfer", "paypal", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["initiated", "completed", "pending", "failed", "refunded"],
      required: true,
    },
    transactionRef: {
      type: String,
      default: "",
    },
    paidAt: {
      type: Date,
      default: null,
    },
    gatewayResponse: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
