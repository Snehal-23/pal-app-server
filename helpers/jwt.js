var jwt = require("express-jwt");

function getTokenFromHeader(req) {
  if (typeof req.body === "object" && Object.keys(req.body).length === 0) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    }
  } else if (
    req.body.headers.authorization &&
    req.body.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.body.headers.authorization.split(" ")[1];
  }
  return "User is not authorized. Please check auth_token";
  // return res
  //   .status(401)
  //   .json({ message: "User is not authorized. Please check auth_token" });
}

var auth = {
  required: jwt.expressjwt({
    secret: "flying-daggers",
    algorithms: ["HS256"],
    userProperty: "payload",
    getToken: getTokenFromHeader,
  }),
  optional: jwt.expressjwt({
    secret: "flying-daggers",
    algorithms: ["HS256"],
    userProperty: "payload",
    credentialsRequired: false,
  }),
};

module.exports = auth;

// if want to use auth then app.use(route, auth.required/auth.optional,function)
