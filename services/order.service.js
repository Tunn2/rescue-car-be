const { default: mongoose } = require("mongoose");
const Order = require("../models/order.model");
const Package = require("../models/package.model");
const Car = require("../models/car.model");
const moment = require("moment-timezone");
const Booking = require("../models/booking.model");

const getOrderByIdService = async (orderId) => {
  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId))
    throw new Error("ID không hợp lệ");
  return await Order.findOne({ _id: new mongoose.Types.ObjectId(orderId) });
};

const createOrderForBookingService = async ({ bookingId, userId }) => {
  if (
    !bookingId ||
    !userId ||
    !mongoose.Types.ObjectId.isValid(bookingId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  )
    throw new Error("ID không hợp lệ");
  const foundBooking = await Booking.findOne({
    _id: new mongoose.Types.ObjectId(bookingId),
  }).lean();
  if (!foundBooking) throw new Error("Không tìm thấy booking");
  return await Order.create({
    user: userId,
    price: foundBooking.price,
    totalPrice: foundBooking.totalPrice,
    booking: bookingId,
  });
};

const createOrderForPackageService = async ({ packageId, carId, userId }) => {
  if (
    !packageId ||
    !carId ||
    !userId ||
    !mongoose.Types.ObjectId.isValid(packageId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  )
    throw new Error("ID không hợp lệ");
  const foundPackage = await Package.findOne({
    _id: new mongoose.Types.ObjectId(packageId),
  })
    .select("price")
    .lean();
  if (!foundPackage) throw new Error("Không tìm thấy gói dịch vụ");
  return await Order.create({
    car: carId,
    package: packageId,
    user: userId,
    price: foundPackage.price,
    totalPrice: foundPackage.price,
  });
};

const updateOrderByIdService = async (orderId, status = "FINISHED") => {
  if (!mongoose.Types.ObjectId.isValid(orderId))
    throw new Error("ID không hợp lệ");
  const order = await Order.findOne({
    _id: new mongoose.Types.ObjectId(orderId),
  }).lean();
  const expiredDate = moment().tz("Asia/Bangkok").add(1, "year").toDate();

  if (order.booking) {
    await Booking.findByIdAndUpdate(order.booking, { status });
  } else {
    await Car.updateOne(
      { _id: order.car },
      {
        package: order.package,
        expiredDate,
      }
    );
  }

  return await Order.updateOne(
    { _id: new mongoose.Types.ObjectId(orderId) },
    { status }
  );
};

module.exports = {
  createOrderForPackageService,
  getOrderByIdService,
  updateOrderByIdService,
  createOrderForBookingService,
};
