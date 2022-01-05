/**
 * Dependencies
 */
const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

/**
 * App
 */
const app = express();

/**
 * Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));

/**
 * Set Global Data
 */
app.set("secret_key", process.env.SECRET_KEY);

/**
 * Start Page
 */
app.get("/", async (req, res, next) => {
  res.send({ message: "Hello World" });
});

/**
 * Routes
 */
app.use("/api", require("./routes/api.route"));

/**
 * Http 404 Error
 */
app.use((req, res, next) => {
  next(createError.NotFound());
});

/**
 * Http 500 Error
 */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});



module.exports = app;
