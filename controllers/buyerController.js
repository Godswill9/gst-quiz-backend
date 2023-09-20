const database = require("../config/database");

// Get all buyers
exports.getAllbuyers = async (req, res, next) => {
  try {
    const query = "SELECT * FROM all_buyers";
    database.query(query, (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no buyers" });
        console.log("no buyers");
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

// Get a specific buyer by ID
exports.getBuyerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM all_buyers WHERE id=?";
    database.query(query, [id], (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no user with that id" });
      } else {
        res.json(result);
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update a buyer
exports.updateBuyer = async (req, res, next) => {
  const { id } = req.params;
  const { email, address } = req.body;
  try {
    var query = `UPDATE all_buyers SET email = '${email}', address='${address}' WHERE id = '${id}';`;
    database.query(query, (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: "data updated" });
    });
  } catch (err) {
    next(err);
  }
};

//delete buyer
exports.deleteBuyer = async (req, res, next) => {
  const { id } = req.params;
  try {
    var deleteQuery = `DELETE FROM all_buyers WHERE id = '${id}'`;
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
