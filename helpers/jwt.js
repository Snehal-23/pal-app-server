var jwt = require("express-jwt");

function getTokenFromHeader(req) {
  // console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
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
    getToken: getTokenFromHeader,
  }),
};

module.exports = auth;

// if want to use auth then app.use(route, auth.required/auth.optional,function)
