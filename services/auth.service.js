require("dotenv").config();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email })
    .select("_id fullName email password phone role")
    .lean();
  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      delete user["password"];
      const { _id, role } = user;
      const token = jwt.sign({ _id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      const refreshToken = jwt.sign({ _id, role }, process.env.JWT_SECRET, {
        expiresIn: "15d",
      });
      return {
        ...user,
        access_token: token,
        refresh_token: refreshToken,
      };
    } else {
      throw new Error("Invalid email or password");
    }
  } else {
    throw new Error("Invalid email or password");
  }
};

const registerService = async ({ fullName, password, email, phone, role }) => {
  const isExistedEmail = await checkEmailExist(email);
  if (isExistedEmail) throw new Error("This email already existed");
  const hashedPassword = await bcrypt.hash(password, 10);
  if (role) {
    await User.create({
      fullName,
      password: hashedPassword,
      email,
      phone,
      role,
    });
  } else {
    await User.create({
      fullName,
      password: hashedPassword,
      email,
      phone,
    });
  }

  const user = await User.findOne({ email })
    .select("-password -updatedAt -createdAt -isActive")
    .lean();
  return user;
};

const refreshTokenService = async (refreshToken) => {
  const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const { _id } = decodedToken;
  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(_id) })
    .select("_id username email password phone role refreshToken")
    .lean();
  if (!user) throw new Error("There's something wrong");
  if (user.refreshToken != refreshToken)
    throw new Error("There's something wrong");

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return {
    access_token: token,
  };
};

const checkEmailExist = async (email) => {
  const foundUser = await User.findOne({ email });
  if (foundUser) return true;
  return false;
};

module.exports = {
  loginService,
  registerService,
  refreshTokenService,
};
