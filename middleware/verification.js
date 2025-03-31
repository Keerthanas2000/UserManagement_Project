const jwt = require("jsonwebtoken");
const User = require("../model/user");

const verify_token = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).json({ message: "No access" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_Key);
    console.log("Decoded Token:", decoded);

    const newUser = await User.findById(decoded.id);
    if (!newUser) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = newUser;
    console.log("Authenticated User:", newUser);

    next();
  } catch (error) {
    console.error("Token verification failed:", error);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = verify_token;
