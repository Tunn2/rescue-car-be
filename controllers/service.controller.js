const { createAServiceService } = require("../services/service.service");

const createAServiceController = async (req, res) => {
  try {
    const { name, price } = req.body;
    return res.send(await createAServiceService({ name, price }));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  createAServiceController,
};
