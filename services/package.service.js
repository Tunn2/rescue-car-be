const { default: mongoose } = require("mongoose");
const Package = require("../models/package.model");

const getPackageByIdService = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id))
    throw new Error("ID không hợp lệ");
  const foundPackage = await Package.findOne({
    _id: new mongoose.Types.ObjectId(id),
  })
    .select("name price description")

    .lean();
  if (!foundPackage) throw new Error("Không tìm thấy gói này");
  return foundPackage;
};

const getPackagesService = async () => {
  return await Package.find()
    .populate("services")
    .select("name description price services")
    .sort([["createdAt", -1]])
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

module.exports = {
  createAPackageService,
  getPackagesService,
  getPackageByIdService,
};
