const express = require("express");

const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  createBookingController,
  getBookingsController,
} = require("../controllers/booking.controller");
const bookingRoute = express.Router();

bookingRoute.use(authenticate);
bookingRoute.post("/", createBookingController);

bookingRoute.use(checkAdminRole);
bookingRoute.get("/", getBookingsController);

module.exports = bookingRoute;
