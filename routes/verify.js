const express = require("express");
const { authenticate } = require("../config/verifyToken");
const route = express.Router();

route.get("/verifyMe", authenticate, (req, res) => {
  console.log("ride on...");
  res.send({ message: "authenticated" });
});

module.exports = route;
