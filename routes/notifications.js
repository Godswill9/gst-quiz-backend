const express = require("express");
const { authenticate } = require("../config/verifyToken");
const { authenticateUser } = require("../config/verifyAdmin2");
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

route.post("/newBuyerNotification", authenticateUser, createBuyerNotification);
route.post(
  "/newSellerNotification",
  authenticateUser,
  createSellerNotification
);
route.put("/updateSellerNotification", authenticate, updateNotificationSeller);
route.put(
  "/updateBuyerNotification",
  authenticateUser,
  updateNotificationBuyer
);
route.get(
  "/getBuyerNotifications/:buyerId",
  authenticateUser,
  getAllBuyerNotifications
);
route.get(
  "/getSellerNotifications/:sellerId",
  authenticate,
  getAllSellerNotifications
);
route.delete("/deleteNotification/:id", authenticate, deleteNotification);

module.exports = route;
