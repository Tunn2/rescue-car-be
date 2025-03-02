const {
  createBookingService,
  getBookingsService,
  assignRescuersService,
  getBookingsByRescuerIdService,
  updateBookingStatusByIdService,
  getBookingsByUserIdService,
} = require("../services/booking.service");

const getBookingsByUserIdController = async (req, res) => {
  try {
    const userId = req.userId;
    return res.send(await getBookingsByUserIdService(userId));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const updateBookingStatusByIdController = async (req, res) => {
  try {
    const { status, services } = req.body;
    const { bookingId } = req.params;

    return res.send(
      await updateBookingStatusByIdService({
        bookingId,
        status,
        services,
      })
    );
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getBookingsByRescuerIdController = async (req, res) => {
  try {
    // const { staff1, staff2 } = req.body;
    const { rescuerId } = req.params;
    return res.send(await getBookingsByRescuerIdService(rescuerId));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getBookingsController = async (req, res) => {
  try {
    return res.send(await getBookingsService());
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

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

const assignRescuersController = async (req, res) => {
  try {
    const { staff1, staff2 } = req.body;
    const { bookingId } = req.params;
    return res.send(await assignRescuersService({ bookingId, staff1, staff2 }));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  createBookingController,
  getBookingsController,
  assignRescuersController,
  getBookingsByRescuerIdController,
  updateBookingStatusByIdController,
  getBookingsByUserIdController,
};
