const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = function(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token ungültig' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Kein Token bereitgestellt' });
  }
};
