const express = require("express");
const { authenticate } = require("../config/verifyToken");
const jwt = require("jsonwebtoken");
const route = express.Router();

route.get("/verifyMe", authenticate, (req, res) => {
  res.send({ message: "you are welcome" });
});

module.exports = route;
