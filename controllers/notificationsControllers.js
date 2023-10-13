require("dotenv").config();
const { v4 } = require("uuid");
const database = require("../config/database");

//create seller notification
//create buyer notification

//check the recipient id if hes a registered seller or a buyer

//type could either be

//SELLER
//1. Creating a new account  (accountCreation)
//2. notification from the admin   (push Notification)
//3. notification for an order   (order success)

//BUYER
//1. Creating a new account
//2. notification from the seller...push notification
//3. notification for a successful order

exports.createSellerNotification = async (req, res, next) => {
  try {
    // const Id = v4();
    const date = new Date();
    let { sellerId, type, orderId } = req.body;
    if (sellerId === "") {
      sellerId = "2ab4eec1-8cb4-4056-b73c-8f71f01d8df9";
    }
    var choice = {};
    var notificationDetailsACC = {
      topic: "Account Creation",
      details: "Account creation successful",
    };
    var notificationDetailsPUSH = {
      topic: "Push notification",
      details: "messageData",
    };
    var notificationDetailsORDER = {
      topic: "You have an order",
      details: "Order details",
    };

    if (type == "Account Creation") {
      choice = notificationDetailsACC;
    } else if (type == "Push notification") {
      choice = notificationDetailsPUSH;
    } else {
      choice = notificationDetailsORDER;
    }

    const checkQuery = "SELECT * FROM all_sellers WHERE id = ? ";
    database.query(checkQuery, [sellerId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
      if (result.length > 0) {
        const createNotification = `INSERT INTO all_notifications (
            id, 
            Title,
            details,
            sellerId,
            buyerId,
            recipient,
            createdAt,
            seen
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
          orderId,
          choice.topic,
          choice.details,
          sellerId,
          "",
          "seller",
          date,
          "FALSE",
        ];

        database.query(createNotification, values, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
            return;
          }
          res.status(200).json({ message: "seller notification created" });
        });
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createBuyerNotification = async (req, res, next) => {
  try {
    // const Id = v4();
    const date = new Date();
    let { buyerId, type, orderId } = req.body;
    if (buyerId === "") {
      buyerId = "8c2f4934-a9d9-4a67-adde-26721e0d8000";
    }
    var choice = {};
    var notificationDetailsACC = {
      topic: "Account Creation",
      details: "Account creation successful",
    };
    var notificationDetailsPUSH = {
      topic: "Push notification",
      details: "messageData",
    };
    var notificationDetailsORDER = {
      topic: "You have placed an order",
      details: "Check order details",
    };

    if (type == "Account Creation") {
      choice = notificationDetailsACC;
    } else if (type == "Push notification") {
      choice = notificationDetailsPUSH;
    } else {
      choice = notificationDetailsORDER;
    }

    const checkQuery = "SELECT * FROM all_buyers WHERE id = ? ";
    database.query(checkQuery, [buyerId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
      if (result.length > 0) {
        const createNotification = `INSERT INTO all_Notifications (
            id, 
            Title,
            details,
            sellerId,
            buyerId,
            recipient,
            createdAt,
            seen
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
          orderId,
          choice.topic,
          choice.details,
          "",
          buyerId,
          "Buyer",
          date,
          "FALSE",
        ];

        database.query(createNotification, values, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
            return;
          }
          res.status(200).json({ message: "buyer notification created" });
        });
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all notifications
exports.getAllSellerNotifications = async (req, res, next) => {
  const { sellerId } = req.params;
  // console.log(req.body);
  try {
    const query = "SELECT * FROM all_notifications where sellerId=?";
    database.query(query, [sellerId], (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no notifications" });
      } else {
        res.send({ data: result });
        // console.log(result);
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get all notifications
exports.getAllBuyerNotifications = async (req, res, next) => {
  const { buyerId } = req.params;
  // console.log(req.body);
  try {
    const query = "SELECT * FROM all_notifications where buyerId=?";
    database.query(query, [buyerId], (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no notifications" });
      } else {
        res.send({ data: result });
        // console.log(result);
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update notification buyer
exports.updateNotificationBuyer = async (req, res, next) => {
  const { orderId, buyerId } = req.body;
  const date = new Date();
  try {
    const query1 = "SELECT * FROM all_notifications where id=? AND buyerId=?";
    database.query(query1, [orderId, buyerId], (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "not found" });
        return;
      } else {
        var query = `UPDATE all_notifications SET seen="TRUE" WHERE id = '${orderId}' AND buyerId='${buyerId}';`;
        database.query(query, (err, result) => {
          if (err) throw err;
          res.status(200).json({ message: "notification read" });
        });
      }
    });
  } catch (err) {
    next(err);
  }
};
// Update notification seller
exports.updateNotificationSeller = async (req, res, next) => {
  const { orderId, sellerId } = req.body;
  const date = new Date();
  try {
    const query1 = "SELECT * FROM all_notifications where id=? AND sellerId=?";
    database.query(query1, [orderId, sellerId], (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "not found" });
        return;
      } else {
        var query = `UPDATE all_notifications SET seen="TRUE" WHERE id = '${orderId}' AND sellerId='${sellerId}';`;
        database.query(query, (err, result) => {
          if (err) throw err;
          res.status(200).json({ message: "notification read" });
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

//delete notification
exports.deleteNotification = async (req, res, next) => {
  const { id } = req.params;
  try {
    var deleteQuery = `DELETE FROM all_notifications WHERE id = '${id}'`;
    database.query(deleteQuery, (err, result) => {
      if (err) {
        console.error(err); // Log the error to the console
        res.status(500).send({ message: "An error occurred" });
      } else {
        // console.log(result);
        res
          .status(200)
          .json({ message: "notification deleted", result: result });
      }
    });
  } catch (err) {
    next(err);
  }
};
