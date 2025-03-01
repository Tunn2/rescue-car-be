const { default: mongoose } = require("mongoose");
const Booking = require("../models/booking.model");
const Car = require("../models/car.model");
const User = require("../models/user.model");

const getBookingsService = async () => {
  return await Booking.find()
    .sort([["bookingDate", -1]])
    .lean();
};

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
  const foundCar = await Car.findOne({
    _id: new mongoose.Types.ObjectId(carId),
  })
    .select("licensePlate")
    .lean();
  const foundUser = await User.findOne({
    _id: new mongoose.Types.ObjectId(userId),
  })
    .select("fullName")
    .lean();
  const newBooking = await Booking.create({
    user: userId,
    car: carId,
    phone,
    description,
    evidence,
    location,
    licensePlate: foundCar.licensePlate,
    name: foundUser.fullName,
  });
  return newBooking;
};

module.exports = {
  createBookingService,
  getBookingsService,
};
