const express = require("express");
const { signup } = require("../config/authenticateSeller");
const route = express.Router();

route.post("/signupSeller", signup);

module.exports = route;
