const express = require("express");
const { authenticate } = require("../config/verifyToken");
const { getLocation } = require("../config/Location");
const jwt = require("jsonwebtoken");
const route = express.Router();

route.get("/verifyMe", authenticate, (req, res) => {
  res.send({ message: "you are welcome" });
});

route.post("/getLocation", getLocation);

module.exports = route;
