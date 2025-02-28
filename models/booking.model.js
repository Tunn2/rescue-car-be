const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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
    locatrion: {
      type: String,
      required: true,
    },
    car: {
      type: mongoose.Types.ObjectId,
      ref: "Car",
    },
    status: {
      type: String,
      enum: ["PENDING", "COMING", "IN-PROGRESS", "FINISHED", "CANCELED"],
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
  },
  {
    timestamps: { createdAt: "bookingDate" },
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
