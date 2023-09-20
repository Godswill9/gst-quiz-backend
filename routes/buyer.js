const express = require("express");
const {
  getAllbuyers,
  getBuyerById,
  updateBuyer,
  deleteBuyer,
} = require("../controllers/buyerController");
const { authenticate } = require("../config/verifyToken");
const route = express.Router();

route.get("/allBuyers", authenticate, getAllbuyers);

route.get("/buyer/:id", authenticate, getBuyerById);

route.put("/updatebuyer/:id", authenticate, updateBuyer);

route.delete("/deletebuyer/:id", authenticate, deleteBuyer);

module.exports = route;
