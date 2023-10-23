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
  // console.log(req.body);
  var adminId = v4();
  // console.log(req.body)
  var date = new Date();
  var { firstName, lastName, email, password, phone, role, code } = req.body;
  if (
    firstName == "" ||
    lastName == "" ||
    email == "" ||
    password == "" ||
    phone == "" ||
    role == ""
  ) {
    console.log("fill in all details");
    res.send({ status: "error", message: "fill in all details" });
    return;
  } else if (password.length < 7) {
    res.json({ message: "password must be greater than 7 chars" });
    return;
  } else {
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
    //CHECK FOR ADMIN
    var check = "SELECT * FROM admins WHERE email = ? AND adminRole=?";
    database.query(check, [email, role], (err, result) => {
      if (result.length !== 0) {
        console.log(" admin already exists");
        res.json({ message: "admin already exists", redirect: "true" });
        return;
      } else {
        var createAdmin = `INSERT INTO admins (
          admin_Id,
            firstName,
            lastName,
            adminRole, 
            email, 
            password ,
            verified ,
            phone,
            created_at,
            updated_at
             ) VALUES?`;
        var values = [
          [
            adminId,
            firstName,
            lastName,
            role,
            email,
            hashed,
            "not verified",
            phone,
            date,
            date,
          ],
        ];
        database.query(createAdmin, [values], (err, result) => {
          if (err) {
            res.status(500);
            console.log(err);
          }
          console.log(result);
          res.send({ message: "admin registered", status: "success" });
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
          subject: "Welcome new admin!", // Subject line
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
                  <p style="color: #333;">Admin, Here's your verification code. <b>${code}</b></p>
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
  var { email, password, role } = req.body;
  // console.log(req.body);
  var checkForUser = "SELECT * FROM admins WHERE email = ? AND adminRole=?";
  database.query(checkForUser, [email, role], async (err, result) => {
    if (result.length == 0) {
      console.log("user not found");
      res.json({ message: "user not found" });
    } else {
      var checkForUserEmail =
        "SELECT * FROM reg_code WHERE email = ? AND status = ?";
      database.query(
        checkForUserEmail,
        [email, "USED"],
        async (err, resultCode) => {
          if (resultCode.length == 0) {
            console.log("user not verified");
            res.json({ message: "user not verified" });
            return;
          } else {
            // console.log(result[0].password);
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
                    accessToken: accessToken,
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

module.exports = { signup, login };
