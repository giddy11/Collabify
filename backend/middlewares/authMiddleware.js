// const jwt = require("jsonwebtoken");
// const asyncHandler = require("express-async-handler");

// const authMiddleware = asyncHandler(async (req, res, next) => {
//   const token = req.cookies.accessToken; // Retrieve token from cookies
//   console.log(`token in auth- ${token}`);
//   if (!token) {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }

//   jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ success: false, message: "Invalid or expired token" });
//     }
    
//     // Attach user information to the request object
//     req.user = {
//       id: decoded.id,
//       email: decoded.email,
//       fullName: decoded.fullName,
//     };

//     next(); // Proceed to the next middleware or route handler
//   });
// });

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  // Check if the token is in the Authorization header
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Verify the token
  jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    // Attach user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.fullName,
    };

    next();  // Proceed to the next middleware or route handler
  });
});

module.exports = authMiddleware;