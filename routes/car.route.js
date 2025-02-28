const express = require("express");

const { authenticate } = require("../middlewares/auth.middleware");
const {
  createCarController,
  getCarByUserIdController,
} = require("../controllers/car.controller");
const carRoute = express.Router();

carRoute.use(authenticate);
carRoute.post("/", createCarController);
carRoute.get("/my-cars", getCarByUserIdController);

module.exports = carRoute;
