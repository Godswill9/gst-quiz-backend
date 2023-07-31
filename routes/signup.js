const express = require("express");
const { signup } = require("../config/authentication");
const route = express.Router();

route.post("/signup", signup);

module.exports = route;
