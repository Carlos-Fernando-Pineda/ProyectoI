const mongoose = require('mongoose');

// Utiliza variables de entorno para configurar la URL de conexión
const mongoURL = process.env.MONGO_URL || 'mongodb+srv://cfernando35:enanon55267141@cluster0.oyb4k85.mongodb.net/usuarios_perfiles';

mongoose.connect(mongoURL, {
  useNewUrlParser: true, // Habilita el nuevo motor de análisis de URL
  useUnifiedTopology: true, // Habilita el nuevo motor de topología
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión a MongoDB establecida correctamente.');
});

