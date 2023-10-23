const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./userRoutes');
const cors = require('cors');
const session = require('express-session');
const redis = require('redis');

const client = redis.createClient();

const app = express();

// Importa el archivo de configuración de la base de datos
require('./db');

const port = process.env.PORT || 5000;

app.use(express.json());

// Habilita CORS para permitir solicitudes desde tu cliente React
app.use(cors());

// Middleware para manejar solicitudes OPTIONS
app.options('*', cors());

app.get('/users', (req, res) => {
  // Aquí debes consultar la base de datos y devolver la lista de usuarios
  // por ejemplo, usando Mongoose:
  User.find({}, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
    }
    res.json(users);
  });
});


app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde el backend!');
});

app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});





