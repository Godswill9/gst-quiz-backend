//posting a Product
require("dotenv").config();
const { v4 } = require("uuid");
const database = require("../config/database");

//POSTING A Product

exports.createNewOrder = async (req, res, next) => {
  try {
    const date = new Date();
    const {
      order,
      orderId,
      buyerId,
      nameIdentity,
      address,
      city,
      state,
      postalCode,
      email,
      phone,
    } = req.body;

    const insertions = order.map((element) => {
      return new Promise((resolve, reject) => {
        const createOrder = `
          INSERT INTO all_orders (
            order_id, 
            item_name, 
            quantity, 
            buyer_id, 
            seller_id, 
            amount, 
            created_at, 
            updated_at,
            status,
            item_id,
            name, 
            address,
            city, 
            state, 
            postalcode, 
            email,
            phone,
            ref
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          orderId,
          element.item_name,
          element.item_quantity,
          element.buyerId,
          element.seller_id,
          element.item_price,
          date,
          date,
          "NOT DELIVERED",
          element.product_id,
          nameIdentity,
          address,
          city,
          state,
          postalCode,
          email,
          phone,
          "",
        ];

        database.query(createOrder, values, (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log("ORDER CREATED!");
            resolve();
          }
        });

        const find_the_product = `SELECT * FROM all_products WHERE product_id = '${element.product_id}';`;
        database.query(find_the_product, (err, result) => {
          if (err) throw err;
          if (result.length == 0) {
            res.send({ message: "error" });
            return;
          } else {
            //update product quantity
            var query = `UPDATE all_products SET item_quantity=${
              Number(result[0].item_quantity) - Number(element.item_quantity)
            } WHERE product_id = '${result[0].product_id}';`;
            database.query(query, (err, result) => {
              if (err) throw err;
            });
            // //update homepage product quantity
            // var query2 = `UPDATE allhomepage SET quantity=${
            //   Number(result[0].item_quantity) - Number(element.item_quantity)
            // } WHERE productId = '${result[0].product_id}';`;
            // database.query(query2, (err, result) => {
            //   if (err) throw err;
            // });
          }
        });
      });
    });

    // Wait for all insertions to complete
    Promise.all(insertions)
      .then(() => {
        var deleteQuery = `DELETE FROM cart_items WHERE buyerId = '${buyerId}'`;
        database.query(deleteQuery, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({
              message: "An error occurred while deleting items from the cart.",
            });
          } else {
            console.log("All items deleted for buyer ID");
            res.status(200).json({
              message: "ORDER CREATED and All items deleted for buyer ID",
            });
          }
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      });
  } catch (error) {
    next(error);
  }
};

exports.fetchMyOrders = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM all_orders WHERE seller_id = '${id}';`;
    database.query(query, (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no orders" });
      } else {
        res.send(result);
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAnOrder = async (req, res, next) => {
  const { item_id } = req.body;
  const { id } = req.params;
  try {
    var query = `UPDATE all_orders SET status = 'DELIVERED' WHERE  seller_id = '${id}' AND item_id = '${item_id}';`;
    database.query(query, (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: "data updated", result: result });
    });
  } catch (error) {
    next(error);
  }
};
