const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  // Get the token from headers, query, or body
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required.",
    });
  }

  try {
    // Handle Bearer token format
    const bearerToken = token.startsWith("Bearer ")
      ? token.slice(7) // Remove "Bearer " prefix
      : token;

    // Verify the token
    const decodedData = jwt.verify(bearerToken, process.env.TOKEN_SECRET_KEY);

    // Assign decoded data to `req.user`
    req.user = decodedData; // Ensure your JWT payload includes the user details

    return next();
  } catch (error) {
    console.error("Token verification error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
});

module.exports = authMiddleware;
