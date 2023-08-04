const database = require("./database");
const { v4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//signup
const signup = async (req, res, next) => {
  if (!req.body) {
    console.log("no body");
    return;
  }
  console.log(req.body);
  var userId = v4();
  // console.log(req.body)
  console.log(req.ip);
  var date = new Date();
  var {
    firstName,
    lastName,
    email,
    password,
    phone,
    accessCode,
    department,
    screenDimensions,
  } = req.body;
  if (
    firstName == "" ||
    lastName == "" ||
    email == "" ||
    password == "" ||
    phone == "" ||
    accessCode == "" ||
    department == "" ||
    screenDimensions == ""
  ) {
    console.log("fill in all details");
    res.send({ message: "Fill in all details", status: "error" });
    return;
  } else if (!email.includes("@") || !email.includes(".")) {
    res.send({ message: "Invalid email", status: "error" });
  } else if (phone.length !== 11) {
    res.send({ message: "Invalid phone number", status: "error" });
  } else if (password.length < 7) {
    res.send({
      message: "Password should have at least 7 characters",
      status: "error",
    });
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
    //CHECK FOR ACCESS TOKEN
    var checkAccess =
      "SELECT * FROM accesstokens WHERE accessToken = ? AND status = ?";
    database.query(checkAccess, [accessCode, "FALSE"], (err, resultToken) => {
      if (resultToken.length == 0) {
        res.json({ message: "Invalid access token", status: "error" });
        return;
      } else {
        //CHECK FOR STUDENT
        var check = "SELECT * FROM users WHERE email = ?";
        database.query(check, [email], (err, result) => {
          if (result.length !== 0) {
            console.log("user has registered with us");
            res.json({
              message: "User already exists",
              redirect: "true",
              status: "error",
            });
            return;
          } else {
            var createUser = `INSERT INTO users (
          id,
          firstName,
          lastName, 
          email,
          password,
          accessToken,
          phone, 
          createdAt,
          updatedAt,
          verified,
          department
          ) VALUES?`;
            var values = [
              [
                userId,
                firstName,
                lastName,
                email,
                hashed,
                accessCode,
                phone,
                date,
                date,
                "false",
                department,
              ],
            ];
            database.query(createUser, [values], (err, result) => {
              if (err) throw err;
              console.log(result);
            });
            var query = `UPDATE accesstokens SET tokenUser = "${
              firstName + "" + lastName
            }",
               tokenUserId = '${userId}', status='USED', userDevice='${screenDimensions}' WHERE accessToken = '${accessCode}';`;

            database.query(query, (err, result) => {
              if (err) throw err;
              res
                .status(200)
                .json({ message: "User fully registered", status: "good" });
            });
          }
        });
      }
    });
  }
};

//login
const login = async (req, res, next) => {
  var { email, password, screenDimensions } = req.body;
  // console.log(req.body);
  if (email == "" || password == "" || screenDimensions == "") {
    console.log("fill in all details");
    res.send({ message: "Fill in all details", status: "error" });
    return;
  }
  var checkForUser = "SELECT * FROM users WHERE email = ?";
  database.query(checkForUser, [email], async (err, result) => {
    if (result.length == 0) {
      console.log("user not found");
      res.json({ message: "User not found", status: "error" });
    } else {
      var checkUserAccess = "SELECT * FROM accesstokens WHERE userDevice = ?";
      database.query(
        checkUserAccess,
        [screenDimensions],
        async (err, resultToken) => {
          if (resultToken.length == 0) {
            res.json({ message: "Device has no access", status: "error" });
            // return;
          } else {
            // console.log(resultToken, screenDimensions);
            // console.log(result[0].password);
            await bcrypt
              .compare(password, result[0].password)
              .then((resultt) => {
                if (!resultt) {
                  console.log("Incorrect password");
                  res.json({ message: "Incorrect password", status: "error" });
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
