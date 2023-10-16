require("dotenv").config();
const { v4 } = require("uuid");
const database = require("../config/database");

// Create a new visit
exports.createNewVisit = async (req, res) => {
  try {
    const id = v4();
    const { session_id, page_url } = req.body;

    const createVisitQuery = `
          INSERT INTO visits_analytics (visit_id, session_id, page_url)
          VALUES (?, ?,?)
        `;

    const values = [id, session_id, page_url];

    database.query(createVisitQuery, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create a visit" });
      } else {
        res.status(201).json({ message: "Visit created successfully" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//get all Visits
exports.getAllUserVisits = async (req, res) => {
  // const { user_id } = req.params;
  const getVisitsQuery = "SELECT * FROM visits_analytics";
  database.query(getVisitsQuery, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
    res.status(200).json(result);
  });
};
