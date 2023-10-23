const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No se proporcionó un token' });
  }

  jwt.verify(token, 'hamburguesa', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token no válido' });
    }

    // Si el token es válido, puedes acceder a la información del usuario, como el ID del usuario
    req.userId = decoded.userId;
    next(); // No debe haber un punto y coma (;) aquí
  });
};

const checkUserRole = (role) => {
  return (req, res, next) => {
    // Verifica el rol del usuario
    if (req.user && req.user.role === role) {
      // Si el usuario tiene el rol correcto, permite el acceso
      next();
    } else {
      // Si el usuario no tiene el rol adecuado, responde con un error de acceso no autorizado
      res.status(403).json({ error: 'Acceso no autorizado' });
    }
  };
};

module.exports = { requireAuth, checkUserRole };




