// middleware/authMiddleware.js
const jwt  = require("jsonwebtoken");
const User = require("../models/users");   


const authMiddleware = async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token;
    const headerToken = req.header("Authorization")?.replace("Bearer ", "");
    const token       = cookieToken || headerToken;

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    const user = await User.findById(decoded.id).select("-password -__v -activity");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = authMiddleware;
