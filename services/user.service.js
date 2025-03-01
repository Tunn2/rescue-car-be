const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");

const updateUserByIdService = async ({ userId, fullName, phone }) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }
  console.log(userId, fullName, phone);

  const foundUser = await User.findOne({
    _id: new mongoose.Types.ObjectId(userId),
  }).lean();
  if (!foundUser) throw new Error("Không tìm thấy ID người dùng");
  await User.updateOne(
    { _id: new mongoose.Types.ObjectId(userId) },
    { fullName, phone }
  );

  return await User.findOne({ _id: new mongoose.Types.ObjectId(userId) })
    .select("-password -createdAt -updatedAt")
    .lean();
};

const findUserByIdService = async (id) => {
  if (id && new mongoose.Types.ObjectId(id))
    return await User.findOne({ _id: new mongoose.Types.ObjectId(id) })
      .select("-password -createdAt -updatedAt")
      .lean();
  return null;
};

const findUserByEmailService = async (email) => {
  return await User.findOne({ email });
};

module.exports = {
  findUserByIdService,
  findUserByEmailService,
  updateUserByIdService,
};
