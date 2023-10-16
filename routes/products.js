const express = require("express");
const { authenticate } = require("../config/verifyToken");
const {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  postProduct,
  getSellersProducts,
} = require("../controllers/productsController");
const route = express.Router();
const multer = require("multer");
// const upload = require("../config/uploads");

// var storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });

// var upload = multer({ storage: storage });

//POST A Product
route.post("/postProduct", authenticate, postProduct);

route.get("/allProducts", getAllProducts);

//getting a random Products
route.get("/Product/:id", getProductById);

//getting a Sellers Products
route.get("/myProducts/:id", getSellersProducts);

route.put("/updateProduct/:id", authenticate, updateProduct);

route.delete("/deleteProduct/:id", authenticate, deleteProduct);

module.exports = route;
