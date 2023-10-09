//posting a Product
require("dotenv").config();
const { v4 } = require("uuid");
const database = require("../config/database");

//POSTING A Product

exports.addToCart = async (req, res, next) => {
  try {
    const cartId = v4();
    const date = new Date();
    const {
      itemName,
      quantity,
      itemPrice,
      imageLink,
      buyerId,
      sellerId,
      productId,
    } = req.body;

    const checkQuery =
      "SELECT * FROM cart_items WHERE product_id = ? and buyerId =? ";
    database.query(checkQuery, [productId, buyerId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      if (result.length > 0) {
        // Item already exists in the cart
        res.status(400).json({ message: "Item already exists in the cart" });
      } else {
        const createItemQuery = `INSERT INTO cart_items (
          item_id,
          item_image,
          item_name,
          item_price,
          item_quantity,
          currency,
          buyerId,
          seller_id,
          product_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
          cartId,
          // imageLink.slice(6, imageLink.length), //i'll remove this in production
          imageLink, //i'll remove this in production
          itemName,
          itemPrice,
          quantity,
          "naira",
          buyerId,
          sellerId,
          productId,
        ];

        database.query(createItemQuery, values, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
            return;
          }

          // console.log(result);
          res.status(200).json({ message: "Item added to the cart" });
        });
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all Products
exports.getAllCarts = async (req, res, next) => {
  const { buyerId } = req.body;
  // console.log(req.body);
  try {
    const query = "SELECT * FROM cart_items where buyerId=?";
    database.query(query, [buyerId], (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no cart items" });
      } else {
        res.send({ data: result });
        // console.log(result);
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update a Product
exports.updateItem = async (req, res, next) => {
  //   const { id } = req.params;
  const { quantity, buyerId, item_id } = req.body;
  const date = new Date();
  try {
    var query = `UPDATE cart_items SET item_quantity=${quantity} WHERE item_id = '${item_id}' AND buyerId='${buyerId}';`;
    database.query(query, (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: "cart updated", result: result });
    });
  } catch (err) {
    next(err);
  }
};

//delete Product
exports.deleteItem = async (req, res, next) => {
  const { id } = req.params;
  try {
    var deleteQuery = `DELETE FROM cart_items WHERE item_id = '${id}'`;
    database.query(deleteQuery, (err, result) => {
      if (err) {
        console.error(err); // Log the error to the console
        res.status(500).send({ message: "An error occurred" });
      } else {
        // console.log(result);
        res.status(200).json({ message: "item deleted", result: result });
      }
    });
  } catch (err) {
    next(err);
  }
};
