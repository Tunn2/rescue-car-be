const { updateUserByIdService } = require("../services/user.service");

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
};
