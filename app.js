const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
// const expressValidator = require("express-validator");
dotenv.config();

// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// app
const app = express();

// db
const dbURL = "mongodb://localhost:27017/ecommerce";
mongoose
  .connect(dbURL, { useNewUrlParser: true })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", err => {
  console.log(`DB connection error: ${err.message}`);
});

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(expressValidator());

// routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
