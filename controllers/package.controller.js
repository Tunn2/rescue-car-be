const {
  createAPackageService,
  getPackagesService,
} = require("../services/package.service");

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
};
