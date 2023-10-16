const database = require("./database");
const { v4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//signup
const signup = async (req, res, next) => {
  if (!req.body) {
    console.log("no body");
    return;
  }
  console.log(req.body);
  var userId = v4();
  // console.log(req.body)
  var date = new Date();
  var {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    nationality,
    securityQuestion,
    securityAnswer,
    address,
    code,
  } = req.body;
  if (
    firstName == "" ||
    lastName == "" ||
    email == "" ||
    password == "" ||
    phoneNumber == "" ||
    nationality == ""
  ) {
    console.log("fill in all details");
    res.json({ message: "fill in all details" });
    return;
  } else {
    if (password.length < 7) {
      res.json({ message: "password must be greater than 7 chars" });
      return;
    }
    var salt = await bcrypt.genSalt(10);
    if (!salt) {
      console.log("Error generating salt");
      return;
    }
    var hashed;
    try {
      hashed = await bcrypt.hash(password, salt);
    } catch (err) {
      console.log("Error hashing password:", err);
      return;
    }
    var check = "SELECT * FROM all_buyers WHERE email = ?";
    database.query(check, [email], (err, result) => {
      if (result.length !== 0) {
        console.log("user has registered with us");
        res.json({ message: "user already exists", redirect: "true" });
        return;
      } else {
        var createUser = `INSERT INTO all_buyers (
          id,
          firstName,
          lastName, 
          email,
          password,
          phone, 
          created_at,
          updated_at,
          security_question,
          security_answer,
          nationality,
          wallet_balance,
          connects,
          address,
          verified,
          affiliate,
          storeName) VALUES?`;
        var values = [
          [
            userId,
            firstName,
            lastName,
            email,
            hashed,
            phoneNumber,
            date,
            date,
            securityQuestion,
            securityAnswer,
            nationality,
            0,
            30,
            address,
            "FALSE",
            "FALSE",
            "Best storezz",
          ],
        ];
        database.query(createUser, [values], (err, result) => {
          if (err) throw err;
          console.log(result);
          res.send({ message: "user registered", status: "success" });
        });

        //code generation and storage
        var createCode = `INSERT INTO reg_code (
          code,
          status,
          userId,
          email) VALUES?`;
        var val = [[code, "NOT-USED", "", email]];
        database.query(createCode, [val], (err, result) => {
          if (err) throw err;
          console.log(result);
        });

        //send code mail
        let transporter = nodemailer.createTransport({
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

        //sending the auth mail
        let info = transporter.sendMail({
          from: '"Uchechukwu" <guche9@gmail.com>', // sender address
          to: `${email}`, // list of receivers
          subject: "Welcome new user!", // Subject line
          // text: "Hello world?", // plain text body
          html: `
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" width="600" style="margin: 0 auto;">
            <tr>
              <td style="padding: 20px 0; text-align: center; background-color: 'blue';">
                <h1 style="color: #fff;">User signup</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
                <div style="background-color: #fff; padding: 20px;">
                  <h2 style="color: #333;"> Thanks for signing up!</h2>
                  <p style="color: #333;">Here's your verification code. <b>${code}</b></p>
                  <p style="color: #333;">You will require it in the login process</p>
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
        });
      }
    });
  }
};

//login
const login = async (req, res, next) => {
  var { email, password } = req.body;
  // console.log(req.body);
  var checkForUser = "SELECT * FROM all_buyers WHERE email = ?";
  database.query(checkForUser, [email], async (err, result) => {
    if (result.length == 0) {
      console.log("user not found");
      res.json({ message: "user not found" });
    } else {
      //check if verified
      var checkForUserEmail =
        "SELECT * FROM reg_code WHERE email = ? AND status = ?";
      database.query(
        checkForUserEmail,
        [email, "USED"],
        async (err, resultCode) => {
          if (resultCode.length == 0) {
            console.log("user not verified");
            res.json({ message: "user not verified" });
          } else {
            console.log(result[0].password);
            var queryUpdate = `UPDATE reg_code SET userId = '${result[0].id}' WHERE email = '${email}';`;
            database.query(queryUpdate, (err, result) => {
              if (err) throw err;
            });
            await bcrypt
              .compare(password, result[0].password)
              .then((resultt) => {
                if (!resultt) {
                  console.log("incorrect password");
                  res.json({ message: "incorrect password" });
                } else {
                  const accessToken = jwt.sign(
                    {
                      email: result[0].email,
                      id: result[0].id,
                      firstName: result[0].firstName,
                      lastName: result[0].lastName,
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "10d" }
                  );
                  res.cookie("jwt", accessToken, {
                    maxAge: 3600 * 1000 * 24 * 365 * 100,
                    withCredentials: true,
                    httpOnly: true,
                  });
                  const allObj = {
                    ...result[0],
                    status: "success",
                    redirect: "true",
                  };
                  res.json(allObj);
                }
              });
          }
        }
      );
    }
  });
};

//verify code
const verifyCode = async (req, res, next) => {
  var { code, email } = req.body;
  // console.log(req.body);
  var checkForCode = "SELECT * FROM reg_code WHERE code = ?";
  database.query(checkForCode, [code], async (err, result) => {
    if (result.length == 0) {
      console.log("incorrect");
      res.json({ message: "Incorrect code", status: "disallowed" });
    } else {
      var query = `UPDATE reg_code SET status = "USED" WHERE email = '${email}';`;
      database.query(query, (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "success" });
      });
    }
  });
};

// };

module.exports = { signup, login, verifyCode };
