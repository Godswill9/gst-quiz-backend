const express = require("express");
const route = express.Router();
const { authenticate } = require("../config/verifyToken");
const {
  fundWallet,
  sendMoney,
  withdrawMoney,
} = require("../controllers/transactionController");

route.post("/addFunds/:id", fundWallet);
route.post("/sendFunds/:id", sendMoney);
route.post("/withdrawFunds/:id", withdrawMoney);

module.exports = route;
