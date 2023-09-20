const express = require("express");
const { login } = require("../config/authMiddleware");
const route = express.Router();

route.post("/login", login);

module.exports = route;
