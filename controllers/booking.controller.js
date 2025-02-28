const { createBookingService } = require("../services/booking.service");

const createBookingController = async (req, res) => {
  try {
    const { carId, location, evidence, description, phone } = req.body;
    const userId = req.userId;
    return res.send(
      await createBookingService({
        carId,
        description,
        evidence,
        location,
        phone,
        userId,
      })
    );
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  createBookingController,
};
