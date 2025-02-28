const { default: mongoose } = require("mongoose");
const Booking = require("../models/booking.model");

const createBookingService = async ({
  userId,
  carId,
  phone,
  description,
  evidence,
  location,
}) => {
  const booking = await Booking.findOne({
    status: { $ne: "FINISHED" },
    user: new mongoose.Types.ObjectId(userId),
  });
  if (booking)
    throw new Error("Bạn đã book 1 cứu hộ trước đó, hãy đợi nó hoàn thành");
  const newBooking = await Booking.create({
    user: userId,
    car: carId,
    phone,
    description,
    evidence,
    location,
  });
  return newBooking;
};

module.exports = {
  createBookingService,
};
