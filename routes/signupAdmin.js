const express = require("express");
const { signup } = require("../config/authenticateAdmin");
const route = express.Router();

route.post("/signupAdmin", signup);

module.exports = route;
