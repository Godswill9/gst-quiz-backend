const express = require("express");
const { authenticate } = require("../config/verifyToken");
const {
  getAllBuyerNotifications,
  getAllSellerNotifications,
  deleteNotification,
  createBuyerNotification,
  createSellerNotification,
  updateNotificationBuyer,
  updateNotificationSeller,
} = require("../controllers/notificationsControllers");
const route = express.Router();

route.post("/newBuyerNotification", authenticate, createBuyerNotification);
route.post("/newSellerNotification", authenticate, createSellerNotification);
route.put("/updateSellerNotification", authenticate, updateNotificationSeller);
route.put("/updateBuyerNotification", authenticate, updateNotificationBuyer);
route.get(
  "/getBuyerNotifications/:buyerId",
  authenticate,
  getAllBuyerNotifications
);
route.get(
  "/getSellerNotifications/:sellerId",
  authenticate,
  getAllSellerNotifications
);
route.delete("/deleteNotification/:id", authenticate, deleteNotification);

module.exports = route;
