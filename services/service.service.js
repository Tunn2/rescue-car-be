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

module.exports = { createAServiceService };
