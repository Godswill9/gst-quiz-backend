const { v4 } = require("uuid");
const database = require("../config/database");

// Get all Students
exports.getAllStudents = async (req, res, next) => {
  try {
    const query = "SELECT * FROM users";
    database.query(query, (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no users" });
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get a specific student by ID
exports.getStudentById = async (req, res, next) => {
  try {
    const { id } = req.body;
    const query = "SELECT * FROM users WHERE id=?";
    database.query(query, [id], (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  } catch (err) {
    next(err);
  }
};

// Update a Student
exports.verifyStudent = async (req, res, next) => {
  const { id } = req.params;
  //   var { firstName, lastName, email, password, phone, accessCode } = req.body;
  const date = new Date();
  try {
    var query = `UPDATE users SET verified= "true" WHERE id = '${id}';`;
    database.query(query, (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: "data updated", result: result });
    });
  } catch (err) {
    next(err);
  }
};

//delete Student
exports.deleteStudent = async (req, res, next) => {
  const { id } = req.params;
  try {
    var deleteQuery = `DELETE FROM users WHERE id = '${id}'`;
    database.query(deleteQuery, (err, result) => {
      if (err) {
        console.error(err); // Log the error to the console
        res.status(500).send({ message: "An error occurred" });
      } else {
        console.log(result);
        res.send({ message: "deleted" });
      }
    });
  } catch (err) {
    next(err);
  }
};
