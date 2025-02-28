const express = require("express");
const {
  registerController,
  loginController,
  refreshTokenController,
} = require("../controllers/auth.controller");
const authRoute = express.Router();

authRoute.post("/register", registerController);
authRoute.post("/login", loginController);

authRoute.post("/refresh-token", refreshTokenController);

module.exports = authRoute;
