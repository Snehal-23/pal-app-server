const expressJwt = require("express-jwt");

function authJwt() {
  return expressJwt
    .expressjwt({
      secret: process.env.SECRET,
      algorithms: ["HS256"],
      isRevoked: isRevoked,
      getToken: getTokenFromHeader,
    })
    .unless({
      path: [
        { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
        { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
        { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
        "/api/v1/users/login",
        "/api/v1/users/register",
      ],
    });
}

function getTokenFromHeader(req) {
  // console.log(req.body.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}

async function isRevoked(req, token) {
  if (!token.payload.isAdmin) {
    return true;
  }
}

// async function isRevoked(req, payload, done) {
//   if (!payload.payload.isAdmin) {
//     return done(null, true);
//   }
//   return done(null, false);
// }

module.exports = authJwt;
