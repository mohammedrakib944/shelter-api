const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SCRECT);
    const { userId } = decoded;
    req.userId = userId;
    next();
  } catch {
    next("Authentication Failure!");
  }
};

module.exports = checkAuth;
