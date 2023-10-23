//create a request
//update positively
//update negatively
//delete record
//fetch all requests
require("dotenv").config();
const { v4 } = require("uuid");
const database = require("../config/database");
const fs = require("fs-extra");

exports.createWithdrawalReq = async (req, res) => {
  const RequestId = v4();
  var date = new Date();
  const { seller_id } = req.params;
  console.log(seller_id);

  var query = `INSERT INTO withdrawal_requests (
        request_id,
            seller_id,
            status,
            amount,
            created_at) VALUES?`;

  var values = [[RequestId, seller_id, "FALSE", 0, date]];

  database.query(query, [values], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send({ message: "request recieved" });
  });
};

exports.fetchWithdrawalReq = async (req, res) => {
  try {
    const query = "SELECT * FROM withdrawal_requests";
    database.query(query, (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.send({ message: "no requests" });
      } else {
        const querySeller = "SELECT * FROM all_sellers WHERE id = ?";
        database.query(
          querySeller,
          [result[0].seller_id],
          (err, resultSeller) => {
            if (err) throw err;
            const combinedData = { data: result, seller: resultSeller };
            res.send(combinedData);
          }
        );
      }
    });
  } catch (err) {
    next(err);
  }
};
