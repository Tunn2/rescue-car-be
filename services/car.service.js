const { default: mongoose } = require("mongoose");
const Car = require("../models/car.model");

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
  const cars = await Car.find({ user: new mongoose.Types.ObjectId(userId) });
  return cars;
};

const checkCarExist = async ({ licensePlate }) => {
  const car = await Car.findOne({ licensePlate }).select("licensePlate").lean();
  if (car) throw new Error("Xe này đã được đăng ký");
};

module.exports = {
  createCarService,
  getCarByUserIdService,
};
