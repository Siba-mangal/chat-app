const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const sequelize = require("./util/database");
const session = require("express-session");
require("dotenv").config();

const User = require("./models/userModule");
const userRoute = require("./route/user");

const app = express();
const { SESSION_SECRET } = process.env;
app.use(session({ secret: SESSION_SECRET }));

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/user", userRoute);

sequelize
  .sync()
  .then((res) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
