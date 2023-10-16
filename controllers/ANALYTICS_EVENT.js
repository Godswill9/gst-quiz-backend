require("dotenv").config();
const { v4 } = require("uuid");
const database = require("../config/database");

// Create a new event
exports.createNewEvent = async (req, res) => {
  try {
    const date = new Date();
    const { session_id, event_type, event_data } = req.body;
    console.log(req.body);
    const createEventQuery = `
          INSERT INTO events_analytics (event_id, session_id, event_type, event_timestamp,event_data)
          VALUES (?, ?, ?,?, ?)
        `;

    const values = [
      v4(),
      session_id,
      event_type,
      date,
      JSON.stringify(event_data),
    ]; // JSON.stringify to store data as JSON

    database.query(createEventQuery, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create an event" });
      } else {
        res.status(201).json({ message: "Event created successfully" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all events
exports.getAllUserevents = async (req, res) => {
  // const { user_id } = req.params;
  const geteventsQuery = "SELECT * FROM events_analytics";
  database.query(geteventsQuery, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
    res.status(200).json(result);
  });
};
