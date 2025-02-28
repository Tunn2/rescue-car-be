const {
  createCarService,
  getCarByUserIdService,
} = require("../services/car.service");

const getCarByUserIdController = async (req, res) => {
  try {
    const userId = req.userId;
    return res.send(await getCarByUserIdService(userId));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const createCarController = async (req, res) => {
  try {
    const { brand, color, model, numberOfSeats, licensePlate } = req.body;
    const userId = req.userId;
    return res.send(
      await createCarService({
        brand,
        color,
        licensePlate,
        model,
        numberOfSeats,
        userId,
      })
    );
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = { createCarController, getCarByUserIdController };
