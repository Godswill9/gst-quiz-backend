//posting a Product
require("dotenv").config();
const { v4 } = require("uuid");
const database = require("../config/database");

//POSTING A Product

exports.addToNewItems = async (req, res, next) => {
  try {
    const { productId, title, sellerId, sellerStore } = req.body;

    const checkQuery =
      "SELECT * FROM allhomepage WHERE productId = ? and sellerId =? and title=? ";
    database.query(checkQuery, [productId, sellerId, title], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      if (result.length > 0) {
        res
          .status(400)
          .json({ message: "Item already exists in the homepage" });
      } else {
        const createItemQuery = `INSERT INTO allhomepage (productId, 
            title,
            sellerId, 
            sellerStore,
            percentage
        ) VALUES (?, ?, ?, ?, ?)`;

        const values = [productId, title, sellerId, sellerStore, ""];

        database.query(createItemQuery, values, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
            return;
          }

          // console.log(result);
          res.status(200).json({ message: "Item added to the homepage" });
        });
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addToflashsales = async (req, res, next) => {
  try {
    const { productId, title, sellerId, sellerStore, percentage } = req.body;

    const checkQuery =
      "SELECT * FROM allhomepage WHERE productId = ? and sellerId =? and title=?";
    database.query(checkQuery, [productId, sellerId, title], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      if (result.length > 0) {
        res
          .status(400)
          .json({ message: "Item already exists in the homepage" });
      } else {
        const createItemQuery = `INSERT INTO allhomepage (productId, 
            title,
            sellerId, 
            sellerStore,
            percentage
        ) VALUES (?, ?, ?, ?, ?)`;

        const values = [productId, title, sellerId, sellerStore, percentage];

        database.query(createItemQuery, values, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
            return;
          }
          // const query3 = "SELECT * FROM all_products WHERE product_id=?";
          // database.query(query3, [productId], (err, resultProduct) => {
          //   if (err) throw err;
          //   var query4 = `UPDATE all_products SET item_price=${
          //     Number(resultProduct[0].item_price) -
          //     Number(resultProduct[0].item_price) * Number(percentage) * 0.01
          //   } WHERE product_id = '${productId}';`;
          //   database.query(query4, (err, result) => {
          //     if (err) throw err;
          //   });
          // });
          // console.log(result);
          res.status(200).json({ message: "Item added to the homepage" });
        });
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all Products for everyone
exports.getAllHomeProducts = async (req, res, next) => {
  try {
    const query = "SELECT * FROM allhomepage";
    database.query(query, (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no home products" });
      } else {
        const promises = result.map((item) => {
          return new Promise((resolve, reject) => {
            const query = "SELECT * FROM all_products WHERE product_id=?";
            database.query(query, [item.productId], (err, result) => {
              if (err) {
                reject(err);
              } else {
                const queryImage =
                  "SELECT * FROM all_images WHERE product_id=?";
                database.query(
                  queryImage,
                  [item.productId],
                  (err, resultImg) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve([
                        ...result,
                        item.title,
                        item.percentage,
                        resultImg[0],
                      ]);
                      console.log(resultImg);
                    }
                  }
                );
                // resolve([...result, item.title, item.percentage]);
              }
            });
          });
        });

        Promise.all(promises)
          .then((results) => {
            const arr = results.filter((result) => result.length > 0);
            if (arr.length === 0) {
              res.send({ message: "not found" });
            } else {
              res.send(arr);
            }
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
          });
      }
    });
  } catch (err) {
    next(err);
  }
};
// Get all Products for the seller
exports.getAllSellersHomeProducts = async (req, res, next) => {
  const { sellerId } = req.body;
  // console.log(req.body);
  try {
    const query = "SELECT * FROM allhomepage where sellerId=?";
    database.query(query, [buyerId], (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no home products" });
      } else {
        res.send({ data: result });
        // console.log(result);
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.checkProduct = async (req, res, next) => {
  try {
    const { productId, sellerId } = req.body;
    const checkQuery =
      "SELECT * FROM allhomepage WHERE productId = ? and sellerId =?";
    database.query(checkQuery, [productId, sellerId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      if (result.length > 0) {
        res.json({ message: "Item exists in the homepage", result: result });
      } else {
        res.json({ message: "not found", result: result });
      }
    });
  } catch (err) {
    next(err);
  }
};

// // Update a Product
// exports.updateItem = async (req, res, next) => {
//   //   const { id } = req.params;
//   const { quantity, buyerId, item_id } = req.body;
//   const date = new Date();
//   try {
//     var query = `UPDATE homepage_items SET item_quantity=${quantity} WHERE item_id = '${item_id}' AND buyerId='${buyerId}';`;
//     database.query(query, (err, result) => {
//       if (err) throw err;
//       res.status(200).json({ message: "homepage updated", result: result });
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// //delete Product
exports.deleteFromHomePage = async (req, res, next) => {
  const { id, title } = req.params;
  try {
    var deleteQuery = `DELETE FROM allhomepage WHERE productId = '${id}' AND title='${title}';`;
    database.query(deleteQuery, (err, result) => {
      if (err) {
        console.error(err); // Log the error to the console
        res.status(500).send({ message: "An error occurred" });
      } else {
        // console.log(result);
        res
          .status(200)
          .json({ message: "item removed from homepage", result: result });
      }
    });
  } catch (err) {
    next(err);
  }
};

// //delete all homepage appearance
exports.deleteAllItemFromHomePage = async (req, res, next) => {
  const { id } = req.params;
  try {
    var deleteQuery = `DELETE FROM allhomepage WHERE productId = '${id}';`;
    database.query(deleteQuery, (err, result) => {
      if (err) {
        console.error(err); // Log the error to the console
        res.status(500).send({ message: "An error occurred" });
      } else {
        // console.log(result);
        res
          .status(200)
          .json({ message: "item removed from homepage", result: result });
      }
    });
  } catch (err) {
    next(err);
  }
};
