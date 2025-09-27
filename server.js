require("dotenv").config();


const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/config");

const AuthRoute = require("./routes/Auth.Route");

connectDB();
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
];
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use((err, req, res, next) => {
  console.log("Global error handler:", err);

  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});


// Routers
app.get("/", (req, res) => {
  res.send("Hello, Autimate API is working!");
});
app.get("/api/version", (req, res) => {
  res.json(require("./version.json"));
});
app.use("/api/auth", AuthRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  const token = process.env.ENCODE_TOKEN;
  console.log("Server listen", port);
});
