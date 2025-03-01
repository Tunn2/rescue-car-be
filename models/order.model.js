const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    package: {
      type: mongoose.Types.ObjectId,
      ref: "Package",
      // required: true,
    },
    car: {
      type: mongoose.Types.ObjectId,
      ref: "Car",
    },
    booking: {
      type: mongoose.Types.ObjectId,
      ref: "Booking",
    },
    voucher: {
      type: mongoose.Types.ObjectId,
      ref: "Voucher",
    },
    price: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "FINISHED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
