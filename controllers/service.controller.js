const {
  createAServiceService,
  getServicesService,
  deleteServiceByIdService,
} = require("../services/service.service");

const deleteServiceByIdController = async (req, res) => {
  try {
    const { serviceId } = req.params;
    return res.send(await deleteServiceByIdService(serviceId));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const createAServiceController = async (req, res) => {
  try {
    const { name, price } = req.body;
    return res.send(await createAServiceService({ name, price }));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getServicesController = async (req, res) => {
  try {
    return res.send(await getServicesService());
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  createAServiceController,
  getServicesController,
  deleteServiceByIdController,
};
