const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
