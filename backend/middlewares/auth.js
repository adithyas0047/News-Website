const passport = require("passport");

// middleware to verify JWT token
exports.verifyToken = passport.authenticate("jwt", { session: false });

// middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access Denied. Admin only!" });
};
