const jwt = require('jsonwebtoken');
require('dotenv').config();

async function jwtGenerator(id, name) {
  const payload = {
    id,
    name
  };
  return await jwt.sign(payload, process.env.JWTSECRET, { expiresIn: '1000d' });
}

module.exports = jwtGenerator;
