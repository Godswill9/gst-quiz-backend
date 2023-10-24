const express = require("express");
const { authenticateUser } = require("../config/verifyAdmin2");
const route = express.Router();

route.get("/verifyUser", authenticateUser, (req, res) => {
  console.log("ride on...");
  //   res.send({ message: "authenticated" });
});

module.exports = route;
