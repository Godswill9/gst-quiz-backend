require("dotenv").config();
const { v4 } = require("uuid");
const database = require("../config/database");
const nodemailer = require("nodemailer");

exports.sendServiceRequest = async (req, res, next) => {
  try {
    const { service, data } = req.body;
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

    //sending the service email request to the developer
    let info = transporter
      .sendMail({
        from: '"Uchechukwu" <guche9@gmail.com>', // sender address
        to: `upworkstar9@gmail.com`, // list of receivers
        subject: "You have a tech order!", // Subject line
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
                <h2 style="color: orange;"> You have a ${service} service order!</h2>
                <p style="color: #333;">Pls allow 48 hours to deliver your order</p>

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
        res.send({ message: "your service has been placed" });
      })
      .catch((err) => console.log(err));
  } catch (err) {
    next(err);
  }
};

//email to the buyer
exports.sendServiceOrder = async (req, res, next) => {
  try {
    const { service, data } = req.body;
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

    //sending the service email request to the developer
    let info = transporter
      .sendMail({
        from: '"Uchechukwu" <guche9@gmail.com>', // sender address
        to: `${data.email}`, // list of receivers
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
                <h2 style="color: orange;"> Your order has placed!</h2>
                <p style="color: #333;">Pls allow 24 hours to confirm your order</p>

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
        res.send({ message: "your service has been placed" });
      })
      .catch((err) => console.log(err));
  } catch (err) {
    next(err);
  }
};
