const express = require("express");
const { authenticate } = require("../config/verifyToken");
const { verifyCode } = require("../config/authMiddleware");
const route = express.Router();

route.get("/verifyMe", authenticate, (req, res) => {
  console.log("ride on...");
  res.send({ message: "authenticated" });
});

route.post("/verifyEmail", verifyCode);

module.exports = route;
