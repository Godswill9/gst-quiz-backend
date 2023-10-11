const express = require("express");
const {
  sendOrderEmail,
} = require("../controllers/transactionWhatappController");
const { authenticate } = require("../config/verifyToken");
const route = express.Router();

route.post("/sendOrderEmail", authenticate, sendOrderEmail);

module.exports = route;
