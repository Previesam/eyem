const jwt = require("jsonwebtoken");
const { secret } = require("../config/settings.config");

exports.verifyToken = (req, res, next) => {
  // Retrieve Json Web Token from request header

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Handling Error when token is not provided

  if (!token) {
    return res.status(401).send({ auth: false, message: "no token provided." });
  }

  // Verifying token provided

  jwt.verify(token, secret, function(err, decoded) {
    // Handling Verification Error
    if (err) {
      console.log(err);
      return res.status(403).send({ auth: false, message: "invalid token" });
    }
    // If All is Well Attaching User Infor to request
    req.userId = decoded.sub;
    req.token = token;
    next();
  });
};
