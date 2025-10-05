const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/auth");

// @route POST /api/auth/register
// @desc Register new user
// @access Public

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10); // generates salt
    const hashedPassword = await bcrypt.hash(password, salt); // hash the password

    // create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default to 'user' if not specified
    });

    await user.save();

    // create JWT payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // token expires in 7 days
      (error, token) => {
        if (error) throw error;
        res.json({
          success: true,
          token: "Bearer" + token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/auth/login
// @desc Login user
// @access Public

router.post("/login", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invaild user password" });
    }

    // create JWT payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (error, token) => {
        if (error) throw error;
        res.json({
          success: true,
          token: "Bearer" + token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/auth/me
// @desc get current user
// @access Private

router.get("/me", verifyToken, (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

module.exports = router;
