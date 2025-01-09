const express = require("express");
const cookieParser = require("cookie-parser");
const rotas = require("./rotas");
const path = require("path");

const app = express();

app.use("/CSS", express.static(path.dirname(__dirname) + "\\public\\CSS"));
app.use("/HTML", express.static(path.dirname(__dirname) + "\\public\\HTML"));
app.use("/JavaScript", express.static(path.dirname(__dirname) + "\\public\\JavaScript"));
app.use(cookieParser());
app.use(express.json());
app.use(rotas);

module.exports = app;