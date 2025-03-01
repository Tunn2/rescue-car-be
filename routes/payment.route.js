const express = require("express");

const { authenticate } = require("../middlewares/auth.middleware");
const {
  createPaymentForPackageController,
  verifyIPNCall,
} = require("../controllers/payment.controller");

const paymentRoute = express.Router();

paymentRoute.get("/vnpay-ipn", verifyIPNCall);

paymentRoute.use(authenticate);
paymentRoute.post("/", createPaymentForPackageController);

module.exports = paymentRoute;
