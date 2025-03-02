const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");
const Booking = require("../models/booking.model");

const getAvailableRescuersService = async () => {
  // Tìm danh sách các staff đang có mặt trong booking với trạng thái chưa hoàn thành
  const busyRescuers = await Booking.find(
    {
      status: { $in: ["PENDING", "COMING", "IN-PROGRESS"] }, // Trạng thái chưa hoàn thành
    },
    { staff1: 1, staff2: 1, _id: 0 }
  ).lean();

  const busyStaffIds = new Set(
    busyRescuers
      .flatMap((booking) => [booking.staff1, booking.staff2])
      .filter((id) => id) // Loại bỏ undefined/null
      .map((id) => id.toString()) // Chuyển thành string để so sánh
  );

  // Tìm danh sách nhân viên có role là "rescuer" nhưng không nằm trong danh sách đang bận
  const availableRescuers = await User.find({
    role: "RESCUER",
    _id: { $nin: Array.from(busyStaffIds) }, // Loại bỏ những người đang bận
  }).lean();
  return availableRescuers;
};

const getStaffsService = async () => {
  return await User.find({ role: { $in: ["RESCUER", "RECEPTIONIST"] } })
    .sort([["createdAt", -1]])
    .lean();
};

const getCustomersService = async () => {
  return await User.find({ role: "CUSTOMER" })
    .sort([["createdAt", -1]])
    .lean();
};

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
  getStaffsService,
  getCustomersService,
  getAvailableRescuersService,
};
