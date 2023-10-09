const express = require("express");
const { authenticate } = require("../config/verifyToken");
const {
  createNewOrder,
  fetchMyOrders,
  updateAnOrder,
} = require("../controllers/orderController");
const route = express.Router();

route.post("/order", authenticate, createNewOrder);
route.get("/fetchMyOrders", authenticate, fetchMyOrders);
route.put("/confirmAnOrder", authenticate, updateAnOrder);

module.exports = route;
