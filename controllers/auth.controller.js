const {
  registerService,
  loginService,
  refreshTokenService,
} = require("../services/auth.service");

const registerController = async (req, res) => {
  try {
    const { fullName, phone, email, password, role } = req.body;
    user = await registerService({ fullName, phone, email, password });
    return res.send(user);
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    return res.send(await loginService({ email, password }));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const registerForAdminController = async (req, res) => {
  try {
    const { fullName, phone, email, password, role } = req.body;
    user = await registerService({ fullName, phone, email, password, role });
    return res.send(user);
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.send({ errorCode: 1, message: "Refresh token not found" });
    const token = await refreshTokenService(refreshToken);

    return res.send(token);
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  registerController,
  loginController,
  refreshTokenController,
  registerForAdminController,
};
