const express = require("express");
const { login } = require("../config/authentication");
const route = express.Router();

route.post("/login", login);

module.exports = route;
