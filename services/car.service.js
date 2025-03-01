const { default: mongoose } = require("mongoose");
const Car = require("../models/car.model");

const deleteCarByIdService = async ({ userId, carId }) => {
  const foundCar = await Car.findOne({
    _id: new mongoose.Types.ObjectId(carId),
    user: new mongoose.Types.ObjectId(userId),
  });
  if (!foundCar) throw new Error("Yêu cầu không hợp lệ");
  await Car.deleteOne({ _id: carId });
  return true;
};

const createCarService = async ({
  brand,
  model,
  color,
  numberOfSeats,
  licensePlate,
  userId,
}) => {
  await checkCarExist({ licensePlate });
  const car = await Car.create({
    brand,
    color,
    licensePlate,
    numberOfSeats,
    model,
    user: userId,
  });
  return car;
};

const getCarByUserIdService = async (userId) => {
  const cars = await Car.find({ user: new mongoose.Types.ObjectId(userId) })
    .populate("package")
    .lean();
  return cars;
};

const checkCarExist = async ({ licensePlate }) => {
  const car = await Car.findOne({ licensePlate }).select("licensePlate").lean();
  if (car) throw new Error("Xe này đã được đăng ký");
};

module.exports = {
  deleteCarByIdService,
  createCarService,
  getCarByUserIdService,
};
