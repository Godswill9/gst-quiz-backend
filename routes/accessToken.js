const express = require("express");
const { authenticate } = require("../config/verifyAdmin");
const {
  getAllTokens,
  postToken,
} = require("../controllers/accessTokenController");
const route = express.Router();

// route.get("/allTokens", authenticate, getAllTokens);

// route.post("/addToken", authenticate, postToken);
route.get("/allTokens", getAllTokens);

route.post("/addToken", postToken);

module.exports = route;
