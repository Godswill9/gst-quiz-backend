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
      console.log(result[0].password);
      await bcrypt.compare(password, result[0].password).then((resultt) => {
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
  });
};
// };

module.exports = { signup, login };
