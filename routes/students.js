const express = require("express");
const { authenticate } = require("../config/verifyToken");
const {
  getAllStudents,
  getStudentById,
  verifyStudent,
  deleteStudent,
} = require("../controllers/studentsControllers");
const route = express.Router();

route.get("/allStudents", getAllStudents);

//getting a random Student
route.post("/student", authenticate, getStudentById);

//getting a donors Students
// route.get("/myStudents/:id", authenticate, getDonorsStudents);

route.put("/verifyStudent/:id", authenticate, verifyStudent);

route.delete("/deleteStudent/:id", authenticate, deleteStudent);

module.exports = route;
