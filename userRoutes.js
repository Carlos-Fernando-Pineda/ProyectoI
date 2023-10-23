const express = require('express');
const router = express.Router();
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { requireAuth, checkUserRole } = require('./middleware/auth');

// Ruta para el registro de usuarios
router.post('/register',
  // Define las reglas de validación utilizando express-validator
  [
    body('username').not().isEmpty().withMessage('El nombre de usuario es requerido'),
    body('email').isEmail().withMessage('El correo electrónico no es válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  async (req, res) => {
    // Verifica las reglas de validación
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Si las validaciones pasan, continúa con el registro del usuario
    try {
      // Obtén los datos del usuario desde el cuerpo de la solicitud
      const { username, email, password, role } = req.body;

      // Crea un nuevo usuario
      const newUser = new User({
        username,
        email,
        password,
        role,
        // Otros campos según corresponda
      });

      // Guarda el usuario en la base de datos
      const user = await newUser.save();

      // Configura la propiedad userId en la sesión
      if (req.session) {
        req.session.userId = user._id;
        req.session.email = user.email;

        // Genera un token JWT si lo necesitas
        const token = jwt.sign({ userId: user._id, email: user.email }, 'hamburguesa', {
          expiresIn: '1h', // El token expira en 1 hora
        });
      } else {
        // Manejar el caso en el que req.session no está definido
        return res.status(500).json({ error: 'Error en la sesión de usuario' });
      }

      // Respuesta exitosa con el token si es necesario
      res.status(201).json({ message: 'Usuario registrado con éxito', token, user });
    } catch (error) {
      // Error en el registro
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  });


// Ruta protegida: Obtiene el perfil del usuario
router.get('/profile', requireAuth, checkUserRole('admin'), async (req, res) => {
  // Aquí puedes usar req.userId para obtener el ID del usuario y buscar su perfil
  // y luego responder con los detalles del perfil.
});

// Ruta para el inicio de sesión de usuarios
router.post('/login', async (req, res) => {
  try {
    // Obtén las credenciales del usuario desde el cuerpo de la solicitud
    const { email, password } = req.body;

    // Busca al usuario en la base de datos utilizando el modelo User
    const user = await User.findOne({ email });

    if (!user) {
      // Si el usuario no se encuentra, responde con un error de credenciales incorrectas
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verifica la contraseña
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Si la contraseña es incorrecta, responde con un error de credenciales incorrectas
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Si las credenciales son válidas, puedes generar un token de acceso aquí
    const token = jwt.sign({ userId: user._id, email: user.email }, 'hamburguesa', {
      expiresIn: '1h', // El token expira en 1 hora
    });

    // Inicia sesión guardando información del usuario en la sesión
    req.session.userId = user._id;
    req.session.email = user.email;

    res.json({ token, user });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ error: 'Error en el inicio de sesión' });
  }
});

module.exports = router;






