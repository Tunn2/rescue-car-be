var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const authRoute = require("./routes/auth.route");
const carRoute = require("./routes/car.route");
const bookingRoute = require("./routes/booking.route");
const serviceRoute = require("./routes/service.route");
const packageRoute = require("./routes/package.route");
const userRoute = require("./routes/user.route");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/cars", carRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/services", serviceRoute);
app.use("/api/packages", packageRoute);
app.use("/api/users", userRoute);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
