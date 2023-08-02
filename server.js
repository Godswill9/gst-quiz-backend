require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const database = require("./config/database");
const login = require("./routes/login");
const signup = require("./routes/signup");
const loginAdmin = require("./routes/loginAdmin");
const signupAdmin = require("./routes/signupAdmin");
const questions = require("./routes/questions");
const students = require("./routes/students");
const accessToken = require("./routes/accessToken");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5502",
      "http://127.0.0.1:5500",
      "http://127.0.0.1:5501",
      "http://localhost:5501",
      "http://localhost:3000",
      "https://admingst.netlify.app/",
      // "https://solvegst.onrender.com/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("welcome to the backend system...");
});

app.use("/api", signup);
app.use("/api", login);
app.use("/api", signupAdmin);
app.use("/api", loginAdmin);
app.use("/api", questions);
app.use("/api", students);
app.use("/api", accessToken);

const port = process.env.PORT || 3000;
console.log(new Date());

server.listen(port, () => {
  console.log("Server is running on port", port);
});
