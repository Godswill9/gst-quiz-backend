const express = require("express");
const { authenticate } = require("../config/verifyToken");
const {
  addToflashsales,
  addToNewItems,
  getAllHomeProducts,
  getAllSellersHomeProducts,
  checkProduct,
  deleteFromHomePage,
  deleteAllItemFromHomePage,
} = require("../controllers/homepageController");
const route = express.Router();

//POST A Product
route.post("/addToHomepageNew", authenticate, addToNewItems);
route.post("/addToHomepageFlash", authenticate, addToflashsales);
route.get("/getMyHomeGoods", authenticate, getAllSellersHomeProducts);
route.get("/getAllHomeGoods", getAllHomeProducts);
route.delete(
  "/removeFromHomepage/:id/:title",
  authenticate,
  deleteFromHomePage
);

route.delete(
  "/removeFromHomepage/:id",
  authenticate,
  deleteAllItemFromHomePage
);

route.post("/checkMe", authenticate, checkProduct);

module.exports = route;
