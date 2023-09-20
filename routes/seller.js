const express = require("express");
const { authenticate } = require("../config/verifyToken");
const {
  getAllsellers,
  getSellerById,
  updateSeller,
  deleteSeller,
} = require("../controllers/sellerController");
const route = express.Router();

route.get("/allSellers", authenticate, getAllsellers);

route.get("/seller/:id", authenticate, getSellerById);

route.put("/updateSeller/:id", authenticate, updateSeller);

route.delete("/deleteSeller/:id", authenticate, deleteSeller);

module.exports = route;
