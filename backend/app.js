const express = require("express");
const cors = require("cors");
const passport = require('passport');
const session = require("express-session");
const errorHandler = require("./middlewares/errorHandlerMW");
const path = require('path');

require("dotenv").config({ path: "./config/.env" });
require("./config/passport.js");

const { app, server } = require("./config/socket.js");

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors({
  origin: [`${process.env.FRONTEND_URL}`, "http://localhost:3000"],
  credentials: true,
  exposedHeaders: ['Content-Disposition'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}));

app.options('*', cors({
  origin: [`${process.env.FRONTEND_URL}`, "http://localhost:3000"],
  credentials: true
}));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes Here. Example:
// app.use("/api/v1/auth/", require("./routes/userRoute"));

app.use(errorHandler);

module.exports = { app, server };