const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  var cookie = req.cookies.jwt;
  if (!cookie) {
    res.json({ message: "login first" });
    console.log({ message: "login first" });
  } else {
    jwt.verify(cookie, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log({ message: "login first" });
        res.send({ message: "login first" });
        return;
      } else {
        // req.userId = user.id;
        next();
      }
    });
  }
};

module.exports = { authenticate };
