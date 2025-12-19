const express = require("express");
const cors = require("cors");
const session = require("express-session");
const errorHandler = require("./middlewares/errorHandlerMW");
const path = require("path");

require("dotenv").config({ path: "./config/.env" });

const { app, server, io } = require("./config/socket.js");

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:3001", // Add additional ports if needed
    ],
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.options(
  "*",
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);

// Session configuration - important for production
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Changed to false for security
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Routes
app.use("/api/v1/user", require("./routes/user.routes.js"));
app.use("/api/v1/seller", require("./routes/seller.routes.js"));
app.use("/api/v1/ad", require("./routes/ad.routes.js"));
app.use("/api/v1/chat", require("./routes/chat.routes.js"));
app.use("/api/v1/notifications", require("./routes/notification.routes.js"));
app.use("/api/v1/admins", require("./routes/adminRoute.js"));
app.use("/api/v1/settings/admin", require("./routes/adminSettingsRoute.js"));

app.use(errorHandler);


app.set("io", io);

module.exports = { app, server, io };
