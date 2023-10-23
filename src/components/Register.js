import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '', // Agrega el campo 'role' al estado
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Realiza una solicitud POST al servidor
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Usuario registrado con éxito:', data);
        // Redirige a la página de perfil o a donde desees después del registro
      } else {
        console.error('Error al registrar usuario:', response.statusText);
        // Maneja errores aquí
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      // Maneja errores aquí
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
        />
        {/* Campo de selección de rol */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="">Selecciona un rol</option>
          <option value="normal">Normal</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;


