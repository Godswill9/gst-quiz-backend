const express = require("express");
const { authenticate } = require("../config/verifyToken");
const {
  createNewOrder,
  fetchMyOrders,
  updateAnOrder,
  fetchAllOrders,
  fetchMyOrdersBuyers,
} = require("../controllers/orderController");
const route = express.Router();

route.post("/order", authenticate, createNewOrder);
route.get("/fetchAllOrders", authenticate, fetchAllOrders);
route.get("/fetchMyOrdersBuyers/:id", authenticate, fetchMyOrdersBuyers);
route.get("/fetchMyOrders/:id", authenticate, fetchMyOrders);
route.put("/confirmAnOrder/:id", authenticate, updateAnOrder);

module.exports = route;
