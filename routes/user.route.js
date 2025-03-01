const express = require("express");

const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const { updateUserByIdController } = require("../controllers/user.controller");

const userRoute = express.Router();

userRoute.use(authenticate);
userRoute.put("/", updateUserByIdController);

// userRoute.use(checkAdminRole);

module.exports = userRoute;
