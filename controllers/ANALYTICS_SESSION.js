require("dotenv").config();
const { v4 } = require("uuid");
const database = require("../config/database");

exports.createSession = async (req, res) => {
  try {
    // Create a new session
    const sessionId = v4();
    const date = new Date();
    // const userId = req.user.id; // Assuming you have the user's ID available
    const { session_location } = req.body;

    const createSessionQuery = `
        INSERT INTO sessions_analytics (session_id, user_id, session_start, session_end, session_location )
        VALUES (?, ?, ?, ?, ?)
      `;
    const values = [sessionId, "", date, date, "", session_location];

    database.query(createSessionQuery, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create a session" });
      } else {
        res.status(201).json({ s_id: sessionId });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all sessions for a specific user
exports.getUserSessions = async (req, res) => {
  const { user_id } = req.params;

  const getSessionsQuery = "SELECT * FROM sessions_analytics WHERE user_id = ?";
  database.query(getSessionsQuery, [user_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    res.status(200).json({ sessions: result });
  });
};

//get all sessions
exports.getAllUserSessions = async (req, res) => {
  // const { user_id } = req.params;
  const getSessionsQuery = "SELECT * FROM sessions_analytics";
  database.query(getSessionsQuery, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    res.status(200).json(result);
  });
};

exports.updateSessionUser = async (req, res) => {
  const { session_id } = req.params;
  const { userId } = req.body;
  const date = new Date();

  const updateSessionQuery = `UPDATE sessions_analytics SET user_id = ${userId} WHERE session_id = ?`;
  database.query(updateSessionQuery, [session_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    res.status(200).json({ message: "Session user updated successfully" });
  });
};

// Update the end time of a session
exports.updateSession = async (req, res) => {
  const { session_id } = req.params;
  const date = new Date();

  const updateSessionQuery = `UPDATE sessions_analytics SET session_end = ${date} WHERE session_id = ?`;
  database.query(updateSessionQuery, [session_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    res.status(200).json({ message: "Session end time updated successfully" });
  });
};

exports.deleteSession = async (req, res) => {
  const { session_id } = req.params;

  const deleteSessionQuery =
    "DELETE FROM sessions_analytics WHERE session_id = ?";
  database.query(deleteSessionQuery, [session_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    res.status(200).json({ message: "Session deleted successfully" });
  });
};
