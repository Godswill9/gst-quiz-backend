const express = require("express");
const route = express.Router();
const { authenticate } = require("../config/verifyToken");
const { authenticateUser } = require("../config/verifyAdmin2");
const initializePayment = require("../controllers/transactionController"); // import the controller

route.post("/acceptpayment", initializePayment.acceptPayment);
route.get("/confirmPayment/:ref", initializePayment.checkPayment);

module.exports = route;
