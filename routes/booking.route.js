const express = require("express");

const {
  authenticate,
  checkAdminRole,
  checkRescuerRole,
} = require("../middlewares/auth.middleware");
const {
  createBookingController,
  getBookingsController,
  assignRescuersController,
  getBookingsByRescuerIdController,
  updateBookingStatusByIdController,
  getBookingsByUserIdController,
} = require("../controllers/booking.controller");
const bookingRoute = express.Router();

bookingRoute.use(authenticate);
bookingRoute.post("/", createBookingController);
bookingRoute.get("/user", getBookingsByUserIdController);

bookingRoute.get(
  "/rescuer/:rescuerId",
  checkRescuerRole,
  getBookingsByRescuerIdController
);
bookingRoute.put(
  "/:bookingId/status",
  checkRescuerRole,
  updateBookingStatusByIdController
);

bookingRoute.use(checkAdminRole);
bookingRoute.get("/", getBookingsController);
bookingRoute.put("/:bookingId/assign", assignRescuersController);

module.exports = bookingRoute;
