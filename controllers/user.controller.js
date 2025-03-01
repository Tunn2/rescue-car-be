const {
  updateUserByIdService,
  getStaffsService,
  getCustomersService,
} = require("../services/user.service");

const getStaffsController = async (req, res) => {
  try {
    return res.send(await getStaffsService());
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getCustomersController = async (req, res) => {
  try {
    return res.send(await getCustomersService());
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const updateUserByIdController = async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const userId = req.userId;
    return res.send(await updateUserByIdService({ fullName, phone, userId }));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  updateUserByIdController,
  getStaffsController,
  getCustomersController,
};
