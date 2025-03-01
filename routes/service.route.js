const express = require("express");

const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  createAServiceController,
  getServicesController,
  deleteServiceByIdController,
} = require("../controllers/service.controller");

const serviceRoute = express.Router();
serviceRoute.get("/", getServicesController);
serviceRoute.use(authenticate);
serviceRoute.use(checkAdminRole);
serviceRoute.post("/", createAServiceController);
serviceRoute.delete("/:serviceId", deleteServiceByIdController);

module.exports = serviceRoute;
