const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    staff1: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    staff2: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    evidence: {
      type: String,
      required: true,
    },
    licensePlate: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    car: {
      type: mongoose.Types.ObjectId,
      ref: "Car",
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "COMING",
        "IN-PROGRESS",
        "PENDING_PAYMENT",
        "FINISHED",
        "CANCELED",
      ],
      default: "PENDING",
    },
    arrivalDate: {
      type: Date,
      default: null,
    },
    completedDate: {
      type: Date,
      default: null,
    },
    price: {
      type: Number,
      default: null,
    },
    totalPrice: {
      type: Number,
      default: null,
    },
    services: [{ type: mongoose.Types.ObjectId, ref: "Service" }],
  },
  {
    timestamps: { createdAt: "bookingDate" },
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
