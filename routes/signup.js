const express = require("express");
const { signup } = require("../config/authMiddleware");
const route = express.Router();

route.post("/signup", signup);

module.exports = route;
