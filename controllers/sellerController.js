const database = require("../config/database");

// Get all sellers
exports.getAllsellers = async (req, res, next) => {
  try {
    const query = "SELECT * FROM all_sellers";
    database.query(query, (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no sellers" });
        console.log("no sellers");
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get a specific Seller by ID
exports.getSellerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const query = "SELECT * FROM all_sellers WHERE id=?";
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

// Update a Seller
exports.updateSeller = async (req, res, next) => {
  const { id } = req.params;
  const { email, address } = req.body;
  try {
    var query = `UPDATE all_sellers SET email = '${email}', address="${address}" WHERE id = '${id}';`;
    database.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.status(200).json({ message: "data updated" });
      }
    });
  } catch (err) {
    next(err);
  }
};

//delete Seller
exports.deleteSeller = async (req, res, next) => {
  const { id } = req.params;
  try {
    var deleteQuery = `DELETE FROM all_sellers WHERE id = '${id}'`;
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
