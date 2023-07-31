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
  var adminId = v4();
  // console.log(req.body)
  var date = new Date();
  var { firstName, lastName, email, password, phone, role } = req.body;
  if (
    firstName == "" ||
    lastName == "" ||
    email == "" ||
    password == "" ||
    phone == "" ||
    role == ""
  ) {
    console.log("fill in all details");
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
        console.log("user has registered with us");
        res.json({ message: "user already exists", redirect: "true" });
        return;
      } else {
        var createAdmin = `INSERT INTO admins (
            firstName,
            lastName,
            adminId,
            adminRole, 
            email, 
            password ,
            verified ,
            phone,
            createdAt,
            updatedAt
             ) VALUES?`;
        var values = [
          [
            firstName,
            lastName,
            adminId,
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
          if (err) throw err;
          console.log(result);
          res.send({ message: "admin registered" });
        });
      }
    });
  }
};

//login
const login = async (req, res, next) => {
  var { email, password, role } = req.body;
  console.log(req.body);
  var checkForUser = "SELECT * FROM admins WHERE email = ? AND adminRole=?";
  database.query(checkForUser, [email, role], async (err, result) => {
    if (result.length == 0) {
      console.log("user not found");
      res.json({ message: "user not found" });
    } else {
      // console.log(result[0].password);
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
            accessToken: accessToken,
          };
          res.json(allObj);
        }
      });
    }
  });
};

module.exports = { signup, login };
