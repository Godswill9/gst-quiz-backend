require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const database = require("./config/database");
const buyers = require("./routes/buyer");
const sellers = require("./routes/seller");
const products = require("./routes/products");
const login = require("./routes/login");
const loginSeller = require("./routes/loginSeller");
const loginAdmin = require("./routes/loginAdmin");
const signup = require("./routes/signup");
const signupSeller = require("./routes/signupSeller");
const signupAdmin = require("./routes/signupAdmin");
const transaction = require("./routes/transaction");
const verifyMe = require("./routes/verify");
const carts = require("./routes/carts");
const whatsappEmailOrder = require("./routes/whatappEmail");
const homepageGoods = require("./routes/homepageGoods");
const order = require("./routes/order");
const notification = require("./routes/notifications");
const service = require("./routes/services");
const multer = require("multer");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

multer({
  limits: { fieldSize: 2 * 1024 * 1024 },
});
app.use(multer().any());

app.get("/", (req, res) => {
  res.send("welcome to MY-GIANT-STORE backend system...");
});

app.use("/api", signup);
app.use("/api", signupSeller);
app.use("/api", signupAdmin);
app.use("/api", login);
app.use("/api", loginSeller);
app.use("/api", loginAdmin);
app.use("/api", verifyMe);
app.use("/api", buyers);
app.use("/api", sellers);
app.use("/api", products);
app.use("/api", transaction);
app.use("/api", carts);
app.use("/api", homepageGoods);
app.use("/api", order);
app.use("/api", whatsappEmailOrder);
app.use("/api", service);
app.use("/api", notification);

const port = process.env.PORT || 3000;
console.log(new Date());

server.listen(port, () => {
  console.log("Server is running on port", port);
});
