require("dotenv").config();
const { v4 } = require("uuid");
const database = require("../config/database");

// Create a new event
exports.createNewClickEvent = async (req, res) => {
  try {
    const date = new Date();
    const { session_id, clicked_element } = req.body;

    const createClickQuery = `
          INSERT INTO clicks_analytics (click_id, session_id, clicked_element)
          VALUES (?, ?, ?)
        `;

    const values = [v4(), session_id, clicked_element]; // JSON.stringify to store data as JSON

    database.query(createClickQuery, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to track the click event" });
      } else {
        res.status(201).json({ message: "click tracked successfully" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all clicks
exports.getAllUserclicks = async (req, res) => {
  // const { user_id } = req.params;
  const getclicksQuery = "SELECT * FROM clicks_analytics";
  database.query(getclicksQuery, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
    res.status(200).json(result);
  });
};
