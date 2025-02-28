const express = require("express");
const {
  registerController,
  loginController,
  refreshTokenController,
  registerForAdminController,
} = require("../controllers/auth.controller");
const {
  checkAdminRole,
  authenticate,
} = require("../middlewares/auth.middleware");
const { findUserByEmailService } = require("../services/user.service");
const User = require("../models/user.model");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const authRoute = express.Router();

authRoute.post("/register", registerController);
authRoute.post("/login", loginController);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
authRoute.post("/refresh-token", refreshTokenController);

authRoute.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email không tồn tại" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Gửi email chứa link đặt lại mật khẩu
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Lấy lại mật khẩu",
      html: `<p>Nhấn vào link sau để đặt lại mật khẩu: <a href="${resetLink}">${resetLink}</a></p><p>Link này sẽ hết hạn sau 15 phút.</p>`,
    });
    console.log(email);

    res.json({ message: "Email đặt lại mật khẩu đã được gửi" });
  } catch (error) {
    console.log(error.message);
    res.send({ errorCode: 1, message: error.message });
  }
});

authRoute.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(decoded.id),
    });

    if (!user) {
      return res.status(400).json({ message: "Token không hợp lệ" });
    }

    // Mã hóa mật khẩu mới và cập nhật
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Mật khẩu đã được cập nhật thành công" });
  } catch (err) {
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
});

authRoute.use(authenticate);
authRoute.use(checkAdminRole);
authRoute.post("/admin/register", registerForAdminController);

module.exports = authRoute;
