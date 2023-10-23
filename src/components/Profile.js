import React, { useState, useEffect } from 'react';

function Profile() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    username: '',
    email: '',
    role: 'normal',
  });

  // Realiza una solicitud para obtener la lista de usuarios al cargar el componente
  useEffect(() => {
    fetch('/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error al obtener la lista de usuarios:', error));
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // Cuando se selecciona un usuario, muestra sus detalles en el formulario de edición
    setEditedUser({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleRoleChange = (event) => {
    // Maneja el cambio en el rol del usuario en el formulario
    setEditedUser({ ...editedUser, role: event.target.value });
  };

  const handleSave = () => {
    // Realiza una solicitud para guardar los cambios en el usuario
    fetch(`/users/${selectedUser._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedUser),
    })
      .then((response) => response.json())
      .then(() => {
        // Actualiza la lista de usuarios después de editar
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id ? { ...user, ...editedUser } : user
          )
        );
        setSelectedUser(null);
      })
      .catch((error) => console.error('Error al guardar cambios:', error));
  };

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <div>
        <h3>Editar Usuario</h3>
        <select onChange={(e) => handleUserSelect(users.find((user) => user._id === e.target.value))}>
          <option value="">Selecciona un usuario</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>
        {selectedUser && (
          <div>
            <input
              type="text"
              value={editedUser.username}
              onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
              placeholder="Nombre de usuario"
            />
            <input
              type="text"
              value={editedUser.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              placeholder="Correo Electrónico"
            />
            <select value={editedUser.role} onChange={handleRoleChange}>
              <option value="normal">Usuario Normal</option>
              <option value="admin">Administrador</option>
            </select>
            <button onClick={handleSave}>Guardar Cambios</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

