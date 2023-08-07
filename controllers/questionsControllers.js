//posting a Question
const { v4 } = require("uuid");
const database = require("../config/database");

//POSTING A QUESTION
exports.postQuestion = async (req, res, next) => {
  const { question, options, answer, course, description, id } = req.body;
  console.log(req.body);
  const questionID = v4();
  const date = new Date();

  if (id !== "") {
    try {
      var query = `UPDATE questiondb SET question = '${question}',
       answer = '${answer}', 
      course = '${course}', options = '${JSON.stringify(options)}',
       description = '${description}' WHERE id = '${id}';`;

      database.query(query, (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "data updated" });
      });
    } catch (err) {
      next(err);
    }
  } else {
    var createQuestion = `INSERT INTO questiondb (id, question, answer, createdAt, updatedAt, course, options, description) VALUES ?`;
    var values = [
      [
        questionID,
        question,
        answer,
        date,
        date,
        course,
        JSON.stringify(options),
        description,
      ],
    ];

    database.query(createQuestion, [values], (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: "Question created successfully" });
    });
  }
};

// Get all Questions
exports.getAllQuestions = async (req, res, next) => {
  try {
    const { course, year } = req.body;
    const query = `SELECT * FROM questiondb WHERE course = '${course}' AND year= '${year}' `;
    database.query(query, (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no Questions" });
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get a specific Question by ID
exports.getQuestionById = (req, res, next) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM questiondb WHERE id=?";
    database.query(query, [id], (err, result) => {
      if (err) throw err;
      console.log(result);
      res.status(200).json(result);
    });
  } catch (err) {
    next(err);
  }
};

// Update a Question

//delete Question
exports.deleteQuestion = async (req, res, next) => {
  const { id } = req.body;
  try {
    var deleteQuery = `DELETE FROM questiondb WHERE id = '${id}'`;
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
