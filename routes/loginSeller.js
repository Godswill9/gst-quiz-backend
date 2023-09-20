const express = require("express");
const { login } = require("../config/authenticateSeller");
const route = express.Router();

route.post("/loginSeller", login);
module.exports = route;
