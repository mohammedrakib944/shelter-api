const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");

const userRouters = require("./routes/user.route");
const postsRoutes = require("./routes/posts.route");

app.use(express.json());

// FILE UPLOAD
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// SETUP CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
  })
);

// DATABASE SETUP
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const dbName = process.env.DBNAME;
const mongoURL = `mongodb+srv://${user}:${password}@cluster0.es0po.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoURL)
  .then(() => console.log("DB connection success!"))
  .catch((err) => console.log("Error: " + err));

// USER ROUTER
app.use("/api/v1/user", userRouters);
app.use("/api/v1/posts", postsRoutes);

// PAGE NOT FOUND ERROR HANDLER

// ERROR HANDER
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
