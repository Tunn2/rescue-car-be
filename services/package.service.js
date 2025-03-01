const Package = require("../models/package.model");

const getPackagesService = async () => {
  return await Package.find()
    .populate("services")
    .select("name description price services")
    .lean();
};

const createAPackageService = async ({
  name,
  price,
  description,
  services,
}) => {
  const foundPackage = await Package.findOne({ name })
    .select("name price")
    .lean();
  if (foundPackage) throw new Error("Gói này đã tồn tại");
  await Package.create({ name, price, description, services });
  const package = await Package.findOne({ name })
    .select("name price services description")
    .populate("services")
    .lean();
  return package;
};

module.exports = { createAPackageService, getPackagesService };
