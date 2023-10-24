const express = require("express");
const {
  sendServiceRequest,
  sendServiceOrder,
} = require("../controllers/servicesControllers");
const { authenticate } = require("../config/verifyToken");
const { authenticateUser } = require("../config/verifyAdmin2");
const route = express.Router();

route.post("/requestService", authenticateUser, sendServiceRequest);
route.post("/recieveServiceEmail", authenticateUser, sendServiceOrder);

module.exports = route;
