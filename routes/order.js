const express = require("express");
const { authenticate } = require("../config/verifyToken");
const { authenticateUser } = require("../config/verifyAdmin2");
const {
  createNewOrder,
  fetchMyOrders,
  updateAnOrder,
  fetchAllOrders,
  fetchMyOrdersBuyers,
} = require("../controllers/orderController");
const route = express.Router();

route.post("/order", authenticateUser, createNewOrder);
route.get("/fetchAllOrders", authenticate, fetchAllOrders);
route.get("/fetchMyOrdersBuyers/:id", authenticateUser, fetchMyOrdersBuyers);
route.get("/fetchMyOrders/:id", authenticate, fetchMyOrders);
route.put("/confirmAnOrder/:id", authenticateUser, updateAnOrder);

module.exports = route;
