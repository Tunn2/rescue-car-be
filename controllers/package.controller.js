const {
  createAPackageService,
  getPackagesService,
  getPackageByIdService,
} = require("../services/package.service");

const getPackageByIdController = async (req, res) => {
  try {
    const { packageId } = req.params;
    return res.send(await getPackageByIdService(packageId));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getPackagesController = async (req, res) => {
  try {
    return res.send(await getPackagesService());
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const createAPackageController = async (req, res) => {
  try {
    const { name, price, services, description } = req.body;
    return res.send(
      await createAPackageService({ name, price, description, services })
    );
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  createAPackageController,
  getPackagesController,
  getPackageByIdController,
};
