const { default: mongoose } = require("mongoose");
const Service = require("../models/service.model");

const createAServiceService = async ({ name, price }) => {
  const foundService = await Service.findOne({ name })
    .select("name price")
    .lean();

  if (foundService) throw new Error("Dịch vụ này đã tồn tại");
  await Service.create({ name, price });
  const service = await Service.findOne({ name }).select("name price").lean();
  return service;
};

const getServicesService = async () => {
  return await Service.find()
    .select("name price")
    .sort([["createdAt", -1]])
    .lean();
};

const deleteServiceByIdService = async (id) => {
  await Service.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
  return true;
};

module.exports = {
  createAServiceService,
  getServicesService,
  deleteServiceByIdService,
};
