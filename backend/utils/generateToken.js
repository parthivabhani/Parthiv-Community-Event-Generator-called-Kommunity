const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  // Use a hardcoded secret instead of process.env.JWT_SECRET
  return jwt.sign({ id: userId }, 'parthivatlas123', {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
