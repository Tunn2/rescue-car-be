const express = require("express");

const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  createAServiceController,
} = require("../controllers/service.controller");

const serviceRoute = express.Router();

serviceRoute.use(authenticate);
serviceRoute.use(checkAdminRole);
serviceRoute.post("/", createAServiceController);

module.exports = serviceRoute;
