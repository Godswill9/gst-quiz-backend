//api for sending order emails
//api for sending notification emails
//api for sending whatsapp messages
const database = require("../config/database");
const nodemailer = require("nodemailer");

//whatsapp link
// https://wa.me/2348125746595?text=Hi,%20you%20have%20an%20order%20on%20Devout%20store.%20Kindly%20check%20your%20gmail%20for%20details.%20Thanks

// send order email
exports.sendOrderEmail = async (req, res, next) => {
  try {
    let transporter = await nodemailer.createTransport({
      host: "localhost",
      service: "gmail",
      port: 3010,
      secure: false,
      auth: {
        user: "guche9@gmail.com", // generated ethereal user
        pass: "dgphjijafmzvtfoe", // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    function separateItemsById(arr) {
      const groupedItems = new Map();
      // Iterate through the array and group items by their ID
      arr.forEach((item) => {
        if (groupedItems.has(item.seller_id)) {
          groupedItems.get(item.seller_id).push(item);
        } else {
          groupedItems.set(item.seller_id, [item]);
        }
      });
      // Convert the grouped items back into an array
      const separatedItems = [...groupedItems.values()];
      return separatedItems;
    }
    console.log(req.body);
    const { order_id, obj } = req.body;
    var arr = [];
    const query = `SELECT * FROM all_orders WHERE order_id = '${order_id}';`;
    database.query(query, (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no orders" });
      } else {
        const separatedOrdersBySeller = separateItemsById(result);
        var totalAmount = result?.reduce(
          (total, item) => total + item.amount * item.item_quantity,
          0
        );

        //sending email to the buyer
        let info = transporter
          .sendMail({
            from: '"Uchechukwu" <guche9@gmail.com>', // sender address
            to: `${obj.email}`, // list of receivers
            subject: "Thanks for the purchase!", // Subject line
            // text: "Hello world?", // plain text body
            html: `
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" width="600" style="margin: 0 auto;">
              <tr>
                <td style="padding: 20px 0; text-align: center; background-color: #333;">
                  <h1 style="color: #fff;">Your Order Request</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <div style="background-color: #fff; padding: 20px;">
                    <h2 style="color: #333;"> Thanks for the order!</h2>
                    <p style="color: #333;">Pls allow 48 hours to recieve your order</p>
                    <table role="presentation" border="1" cellspacing="0" cellpadding="10" width="100%" style="border-collapse: collapse; color: #333;">
                      <thead style="background-color: #333; color: #fff;">
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                      ${result.map((item, i) => {
                        return `<tr>
                            <td>${item.item_name}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.amount}</td>
                            <td>$${
                              Number(item.quantity) * Number(item.amount)
                            }</td>
                          </tr>`;
                      })}
                      </tbody>
                    </table>
                    <p style="color: #333;">Subtotal: $${totalAmount}</p>
                    <p style="color: #333;">Shipping: $10.00</p>
                    <p style="color: #333;">Total: $${
                      Number(totalAmount) + 10
                    }</p>
                    <h3 style="color: #333;">Shipping Address:</h3>
                    <p style="color: #333;">John Doe<br>123 Main Street<br>Your City, State 12345<br>United States</p>
                    <h3 style="color: #333;">Company Details:</h3>
                    <p style="color: #333;">Devout store<br>23, Church Street<br>Shasha, Lagos State 54321<br>Nigeria<br>Phone: (234) 456-7890</p>
                    <p style="color: #333;">Thank you for shopping with us. If you have any questions or need further assistance, please contact us.</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; text-align: center; background-color: #333; color: #fff;">
                  &copy; 2023 Devout store
                </td>
              </tr>
            </table>
          </body>
                  `,
          })
          .then(() => {
            console.log("Message sent: %s, info.messageId");
            console.log("Preview URL: %s nodemailer.getTestMessageUrl(info)");
          })
          .catch((err) => console.log(err));
        if (separatedOrdersBySeller.length > 1) {
          separatedOrdersBySeller.forEach((seller, i) => {
            console.log(seller[0].seller_id);
            const querySeller = `SELECT * FROM all_sellers WHERE id = '${seller[0].seller_id}';`;
            database.query(query, (err, resultSeller) => {
              if (err) throw err;
              if (resultSeller.length == 0) {
                console.log("no sellers");
                return;
              } else {
                console.log(resultSeller[0].email);
                let info = transporter
                  .sendMail({
                    from: '"Uchechukwu" <guche9@gmail.com>', // sender address
                    to: `${resultSeller[0].email}`, // list of receivers
                    subject: "Devout Store", // Subject line
                    // text: "Hello world?", // plain text body
                    html: `
                    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" width="600" style="margin: 0 auto;">
                      <tr>
                        <td style="padding: 20px 0; text-align: center; background-color: #333;">
                          <h1 style="color: #fff;">Order Request</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px;">
                          <div style="background-color: #fff; padding: 20px;">
                            <h2 style="color: #333;"> You have an order!</h2>
                            <p style="color: #333;">Pls allow 48 hours to deliver your order. Check your 
                            dashboard for details</p>
                            <p style="color: #333;">Remember to copy the orderId to search the order.</p>
                            <b>OrderId:<span>${order_id}</span></b>

                            <p style="color: #333;">John Doe<br>123 Main Street<br>Your City, State 12345<br>United States</p>
                            <h3 style="color: #333;">Company Details:</h3>
                            <p style="color: #333;">Devout store<br>23, Church Street<br>Shasha, Lagos State 54321<br>Nigeria<br>Phone: (234) 456-7890</p>
                            <p style="color: #333;">Thank you for shopping with us. If you have any questions or need further assistance, please contact us.</p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px; text-align: center; background-color: #333; color: #fff;">
                          &copy; 2023 Devout store
                        </td>
                      </tr>
                    </table>
                  </body>
                          `,
                  })
                  .then(() => {
                    console.log("Message sent: %s, info.messageId");
                    console.log(
                      "Preview URL: %s nodemailer.getTestMessageUrl(info)"
                    );
                    // res.send({
                    //   whatsappLink: ` https://wa.me/${result[0].phone}?text=Hi,%20you%20have%20an%20order%20on%20Devout%20store.%20Kindly%20check%20your%20gmail%20for%20details.%20Thanks`,
                    // });
                  })
                  .catch((err) => console.log(err));
              }
            });
          });
        } else {
          const querySeller = `SELECT * FROM all_sellers WHERE id = '${separatedOrdersBySeller[0][0].seller_id}';`;
          database.query(querySeller, (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
              console.log("no sellers");
              return;
            } else {
              console.log(result[0].email);
              let info = transporter
                .sendMail({
                  from: '"Uchechukwu" <guche9@gmail.com>', // sender address
                  to: `${result[0].email}`, // list of receivers
                  subject: "Devout Store", // Subject line
                  // text: "Hello world?", // plain text body
                  html: `
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" width="600" style="margin: 0 auto;">
                  <tr>
                    <td style="padding: 20px 0; text-align: center; background-color: #333;">
                      <h1 style="color: #fff;">Order Request</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px;">
                      <div style="background-color: #fff; padding: 20px;">
                        <h2 style="color: #333;"> You have an order!</h2>
                        <p style="color: #333;">Pls allow 48 hours to deliver your order. Check your 
                            dashboard for details</p>
                            <p style="color: #333;">Remember to copy the orderId to search the order.</p>
                            <b>OrderId:<span>${order_id}</span></b>
                        <table role="presentation" border="1" cellspacing="0" cellpadding="10" width="100%" style="border-collapse: collapse; color: #333;">
                          <thead style="background-color: #333; color: #fff;">
                            <tr>
                              <th>Product</th>
                              <th>Quantity</th>
                              <th>Price</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                          ${result.map((item, i) => {
                            return `<tr>
                                <td>${item.item_name}</td>
                                <td>${item.quantity}</td>
                                <td>$${item.amount}</td>
                                <td>$${
                                  Number(item.quantity) * Number(item.amount)
                                }</td>
                              </tr>`;
                          })}
                           </tbody>
                        </table>
                        <p style="color: #333;">Subtotal: $${totalAmount}</p>
                        <p style="color: #333;">Shipping: $10.00</p>
                        <p style="color: #333;">Total: $${
                          Number(totalAmount) + 10
                        }</p>
                        <p style="color: #333;">Phone Number:${result.phone}</p>
                        <h3 style="color: #333;">Shipping Address:</h3>
                        <p style="color: #333;">John Doe<br>123 Main Street<br>Your City, State 12345<br>United States</p>
                        <h3 style="color: #333;">Company Details:</h3>
                        <p style="color: #333;">Devout store<br>23, Church Street<br>Shasha, Lagos State 54321<br>Nigeria<br>Phone: (234) 456-7890</p>
                        <p style="color: #333;">Thank you for shopping with us. If you have any questions or need further assistance, please contact us.</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; text-align: center; background-color: #333; color: #fff;">
                      &copy; 2023 Devout store
                    </td>
                  </tr>
                </table>
              </body>
                      `,
                })
                .then(() => {
                  console.log("Message sent: %s, info.messageId");
                  console.log(
                    "Preview URL: %s nodemailer.getTestMessageUrl(info)"
                  );
                  res.send({
                    message:
                      "your order has been placed. Check your email for details",
                  });
                  //   res.send({
                  //     whatsappLink: ` https://wa.me/${result[0].phone}?text=Hi,%20you%20have%20an%20order%20on%20Devout%20store.%20Kindly%20check%20your%20gmail%20for%20details.%20Thanks`,
                  //   });
                })
                .catch((err) => console.log(err));
              //   console.log("just one seller get these orders oo...money man");
            }
          });
        }
      }
    });
  } catch (err) {
    next(err);
  }
};
