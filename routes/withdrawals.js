const express = require("express");
const { authenticate } = require("../config/verifyToken");
const {
  createWithdrawalReq,
  fetchWithdrawalReq,
} = require("../controllers/withdrawalController");
const route = express.Router();

route.post("/withdraw/:seller_id", authenticate, createWithdrawalReq);
route.get("/withdrawalRequests", authenticate, fetchWithdrawalReq);

module.exports = route;
