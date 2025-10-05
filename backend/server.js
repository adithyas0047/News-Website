const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS Configuration - MUST be before other middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Allow both Vite and CRA
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Passport Config
require("./config/passport")(passport);
app.use(passport.initialize());

// Connect to MongoDB
const connectDB = require("./config/db");
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/articles", require("./routes/articles"));
app.use("/api/news", require("./routes/news"));
app.use("/api/bookmarks", require("./routes/bookmarks"));

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to News API" });
});

// Test route to verify server is responding
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: http://localhost:5173`);
});
