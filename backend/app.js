const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const xss = require("xss-clean");
const helmet = require("helmet");
const { connectToDB } = require("./src/utils/db");
const router = require("./src/routes/api");


require("dotenv").config();

app.use(cors());

app.use(xss());
app.use(helmet());

//increase the request body size this is not necessary
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(
  express.static("public", {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);
//connect database
connectToDB();

//ssl commerz implement 



app.use("/api/v1", router);

module.exports = app;
