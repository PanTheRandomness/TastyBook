var express = require("express");
require("dotenv").config();

const app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var cors = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
}

app.use(cors);

const recipeRoutes = require("./src/routes/recipeRoutes");
app.use(recipeRoutes);

const userRoutes = require("./src/routes/userRoutes");
app.use(userRoutes);

const adminRoutes = require("./src/routes/adminRoutes");
app.use(adminRoutes);

const reviewRoutes = require("./src/routes/reviewRoutes");
app.use(reviewRoutes);

const errorHandling = require("./src/middleware/errorHandling");
app.use(errorHandling);

const port = 3004;
const hostname = "127.0.0.1";

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});