const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");

const findUserByIdService = async (id) => {
  if (id && new mongoose.Types.ObjectId(id))
    return await User.findOne({ _id: id })
      .select("-password -createdAt -updatedAt")
      .lean();
  return null;
};

const findUserByEmailService = async (email) => {
  return await User.findOne({ email });
};

module.exports = { findUserByIdService, findUserByEmailService };
