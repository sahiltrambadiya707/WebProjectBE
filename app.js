const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
// const Authenticate = require("./middleware/authenticate");
const app = express();
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./config.env" });
require("./db/conn");
app.use(express.json());
app.use(cookieParser());
app.use(require("./router/auth"));
const PORT = process.env.PORT;

app.listen(`${PORT}`, () => {
  console.log(`server is running at port no ${PORT}`);
});
