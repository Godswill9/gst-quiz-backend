const express = require("express");
const { authenticate } = require("../config/verifyAdmin");
const {
  addToCart,
  getAllCarts,
  updateItem,
  deleteItem,
} = require("../controllers/cartsController");
const route = express.Router();

//POST A Product
route.post("/addToCart", authenticate, addToCart);

route.post("/myCarts", authenticate, getAllCarts);

route.put("/updateitem/:id", authenticate, updateItem);

route.delete("/deleteitem/:id", authenticate, deleteItem);

module.exports = route;
