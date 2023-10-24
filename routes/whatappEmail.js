const express = require("express");
const {
  sendOrderEmail,
} = require("../controllers/transactionWhatappController");
const { authenticate } = require("../config/verifyToken");
const { authenticateUser } = require("../config/verifyAdmin2");
const route = express.Router();

route.post("/sendOrderEmail", authenticateUser, sendOrderEmail);

module.exports = route;
