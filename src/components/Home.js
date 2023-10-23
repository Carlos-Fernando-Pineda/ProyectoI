import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bienvenido a la Aplicación de Gestión de Usuarios y Perfiles</h1>
      <p>Selecciona una opción:</p>
      <ul>
        <li>
          <Link to="/login">Iniciar Sesión</Link>
        </li>
        <li>
          <Link to="/register">Registrarse</Link>
        </li>
        <li>
          <Link to="/profile">Perfil de Usuario</Link>
        </li>
        {/* Agrega más enlaces para otras rutas si es necesario */}
      </ul>
    </div>
  );
};

export default Home;
