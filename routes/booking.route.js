const express = require("express");

const { authenticate } = require("../middlewares/auth.middleware");
const {
  createBookingController,
} = require("../controllers/booking.controller");
const bookingRoute = express.Router();

bookingRoute.use(authenticate);
bookingRoute.post("/", createBookingController);
// bookingRoute.get("/my-cars", getCarByUserIdController);

module.exports = bookingRoute;
