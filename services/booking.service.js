const { default: mongoose } = require("mongoose");
const Booking = require("../models/booking.model");
const Car = require("../models/car.model");
const User = require("../models/user.model");
const Service = require("../models/service.model");

const getBookingsByUserIdService = async (userId) => {
  return await Booking.find({ user: userId }).populate("staff1 staff2").lean();
};

const updateBookingStatusByIdService = async ({
  bookingId,
  status,
  services,
}) => {
  if (status === "IN-PROGRESS") {
    await Booking.findByIdAndUpdate(bookingId, {
      status,
      arrivalDate: Date.now(),
    });
  } else if (status === "FINISHED") {
    await Booking.findByIdAndUpdate(bookingId, {
      status,
      completedDate: Date.now(),
    });
  } else if (status === "PENDING_PAYMENT") {
    await Booking.findByIdAndUpdate(bookingId, { services });
    const foundBooking = await Booking.findById(bookingId).lean();
    const foundCar = await Car.findOne({
      licensePlate: foundBooking.licensePlate,
    })
      .populate("package")
      .lean();
    const newServiceIds = services.filter(
      (service) =>
        !foundCar.package.services.some(
          (pkg) => pkg._id.toString() === service.toString()
        )
    );
    if (foundCar) {
      const foundServices = await Service.find({ _id: { $in: newServiceIds } });

      let totalPrice = foundServices.reduce(
        (total, service) => total + (service.price || 0),
        0
      );
      if (totalPrice > 0) {
        await Booking.findByIdAndUpdate(bookingId, {
          price: totalPrice,
          totalPrice,
          status: "PENDING_PAYMENT",
        });
      } else if (totalPrice === 0) {
        await Booking.findByIdAndUpdate(bookingId, {
          price: totalPrice,
          totalPrice: 0,
          status: "FINISHED",
        });
      }
    } else {
      const foundServices = await Service.find({ _id: { $in: services } });
      let totalPrice = foundServices.reduce(
        (total, service) => total + (service.price || 0),
        0
      );
      await Booking.findByIdAndUpdate(bookingId, {
        price: totalPrice,
        totalPrice,
        status: "PENDING_PAYMENT",
      });
    }
  }
  return true;
};

const getBookingsByRescuerIdService = async (rescuerId) => {
  const bookings = await Booking.find({
    $or: [{ staff1: rescuerId }, { staff2: rescuerId }],
  })
    .populate("staff1", "fullName") // Lấy thông tin nhân viên cứu hộ 1
    .populate("staff2", "fullName") // Lấy thông tin nhân viên cứu hộ 2
    .sort({ bookingDate: -1 }); // Sắp xếp từ mới đến cũ

  return bookings;
};

const getBookingsService = async () => {
  return await Booking.find()
    .sort([["bookingDate", -1]])
    .populate("staff1 staff2")
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

const assignRescuersService = async ({ bookingId, staff1, staff2 }) => {
  await Booking.findByIdAndUpdate(bookingId, {
    staff1,
    staff2,
    status: "COMING",
  });
  return true;
};

module.exports = {
  createBookingService,
  getBookingsService,
  assignRescuersService,
  getBookingsByRescuerIdService,
  updateBookingStatusByIdService,
  getBookingsByUserIdService,
};
