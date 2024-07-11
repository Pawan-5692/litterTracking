const JWT = require('jsonwebtoken');

const secret = "Pawan@123";

function createTokenForUser(user) {
  const payload = {
    email: user.email,
    id: user._id,
    role: user.role,
  }
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
