require("dotenv").config();
const {
  VNPay,
  ProductCode,
  dateFormat,
  VnpLocale,
  ignoreLogger,
  IpnFailChecksum,
  IpnOrderNotFound,
  IpnInvalidAmount,
  InpOrderAlreadyConfirmed,
  IpnSuccess,
} = require("vnpay");
const {
  createOrderForPackageService,
  getOrderByIdService,
  updateOrderByIdService,
} = require("../services/order.service");

const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMNCODE,
  secureSecret: process.env.VNP_HASHSECRET,
  vnpayHost: "https://sandbox.vnpayment.vn",
  testMode: true,
  hashAlgorithm: "sha512",
  enableLog: true,
  loggerFn: ignoreLogger,
});

const createPaymentForPackageController = async (req, res) => {
  try {
    const { packageId, carId } = req.body;
    const order = await createOrderForPackageService({
      carId,
      packageId,
      userId: req.userId,
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: order.totalPrice,
      vnp_IpAddr: "127.0.0.1",
      vnp_TxnRef: order._id,
      vnp_OrderInfo: `Thanh toan don hang ${order._id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: "http://localhost:5173/my-cars",
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow),
    });

    return res.json({ paymentUrl });
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const verifyIPNCall = async (req, res) => {
  try {
    const verify = vnpay.verifyIpnCall(req.query);
    if (!verify.isSuccess) {
      return res.json(IpnFailChecksum);
    }

    const foundOrder = await getOrderByIdService(verify.vnp_TxnRef);

    if (!foundOrder || verify.vnp_TxnRef !== foundOrder._id.toString())
      return res.json(IpnOrderNotFound);

    if (verify.vnp_Amount !== foundOrder.totalPrice) {
      return res.json(IpnInvalidAmount);
    }

    if (foundOrder.status === "COMPLETED") {
      return res.json(InpOrderAlreadyConfirmed);
    }

    await updateOrderByIdService(foundOrder._id);

    return res.json(IpnSuccess);
  } catch (error) {
    console.log("verify error", error);
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = { createPaymentForPackageController, verifyIPNCall };
