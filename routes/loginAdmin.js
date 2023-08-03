const express = require("express");
const { login } = require("../config/authenticateAdmin");
const { authenticate } = require("../config/verifyAdmin");
const route = express.Router();

route.post("/loginAdmin", login);
route.get("/loginAdmin", (req, res) => {
  res.send("login route");
});

route.post("/checkAdmin", authenticate);

module.exports = route;
