const express = require("express");
const {
  sendServiceRequest,
  sendServiceOrder,
} = require("../controllers/servicesControllers");
const { authenticate } = require("../config/verifyToken");
const route = express.Router();

route.post("/requestService", authenticate, sendServiceRequest);
route.post("/recieveServiceEmail", authenticate, sendServiceOrder);

module.exports = route;
