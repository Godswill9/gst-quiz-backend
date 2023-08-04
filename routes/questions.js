const express = require("express");
const { authenticate } = require("../config/verifyToken");
const jwt = require("jsonwebtoken");
const {
  postQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionsControllers");
const route = express.Router();

route.get("/", (req, res) => {
  res.send({ message: "hello and welcome" });
});

route.post("/postQuestion", postQuestion);

route.post("/allQuestions", getAllQuestions);

route.post("/client/allQuestions", authenticate, getAllQuestions);

//getting a random question
route.get("/question/:id", getQuestionById);

//getting a donors Questions
// route.get("/myQuestions/:id", authenticate, getDonorsQuestions);

route.post("/deleteQuestion", deleteQuestion);

module.exports = route;
