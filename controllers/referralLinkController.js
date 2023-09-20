//Add an accessToken
const { v4 } = require("uuid");
const database = require("../config/database");

//Create a token
exports.postToken = async (req, res, next) => {
  const { token } = req.body;
  console.log(req.body);
  try {
    var createToken = `INSERT INTO accesstokens (
     accessToken,
     status
     ) VALUES?`;
    var values = [[token, "FALSE"]];
    database.query(createToken, [values], (err, result) => {
      if (err) throw err;
    });
    // Send a successful response
    res.status(201).json({ message: "token created successfully" });
  } catch (err) {
    next(err);
  }
};

// Get all Tokens and token users
exports.getAllTokens = async (req, res, next) => {
  try {
    const query = `SELECT * FROM accesstoken`;
    database.query(query, (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no Tokens" });
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    next(err);
  }
};
