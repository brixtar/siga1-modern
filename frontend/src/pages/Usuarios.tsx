import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import api from '../services/api';
import DataTable from '../components/DataTable';
import type { Role } from '../types';

interface UserRow {
  id: number;
  username: string;
  email: string;
  role: Role;
  enabled: boolean;
  puedeVerAuditoria: boolean;
}

const Usuarios: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    role: 'ALUMNO' as Role,
    enabled: true,
    puedeVerAuditoria: false
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get<UserRow[]>('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (editingUser) {
        // Editar usuario
        await api.put(`/users/${editingUser.id}`, {
          username: form.username,
          email: form.email,
          role: form.role,
          enabled: form.enabled,
          puedeVerAuditoria: form.puedeVerAuditoria,
          password: form.password || null // Opcional al editar
        });
        setSuccess('Usuario actualizado correctamente');
      } else {
        // Registrar nuevo usuario
        if (!form.password) {
          setError('La contraseña es requerida para nuevos usuarios');
          return;
        }
        await authService.register({
          username: form.username,
          password: form.password,
          email: form.email || `${form.username}@siga.local`,
          role: form.role
        });
        
        // Si es doctor y se le habilitó auditoria tras registrar, actualizamos
        if (form.role === 'DOCTOR' && form.puedeVerAuditoria) {
          // Buscamos el usuario creado por username para obtener su ID
          const usersRes = await api.get<UserRow[]>('/users');
          const created = usersRes.data.find(u => u.username === form.username);
          if (created) {
            await api.put(`/users/${created.id}`, {
              ...created,
              puedeVerAuditoria: true
            });
          }
        }
        
        setSuccess('Usuario registrado correctamente');
      }

      setForm({ username: '', password: '', email: '', role: 'ALUMNO', enabled: true, puedeVerAuditoria: false });
      setEditingUser(null);
      setShowForm(false);
      loadUsers();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al procesar el usuario');
    }
  };

  const handleEdit = (user: UserRow) => {
    setEditingUser(user);
    setForm({
      username: user.username,
      password: '', // Dejar vacia a menos que se quiera cambiar
      email: user.email,
      role: user.role,
      enabled: user.enabled,
      puedeVerAuditoria: user.puedeVerAuditoria || false
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (user: UserRow) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente al usuario "${user.username}"?`)) return;
    try {
      await api.delete(`/users/${user.id}`);
      setSuccess('Usuario eliminado');
      loadUsers();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar el usuario');
    }
  };

  const columns = [
    { key: 'username', header: 'Usuario' },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Rol',
      render: (row: UserRow) => {
        const roles: Record<Role, string> = {
          ADMIN: 'Administrador',
          DOCTOR: 'Médico (Doctor)',
          ALUMNO: 'Alumno'
        };
        return <span className="font-semibold text-gray-700">{roles[row.role] || row.role}</span>;
      }
    },
    { 
      key: 'puedeVerAuditoria', 
      header: 'Permiso Auditoría',
      render: (row: UserRow) => {
        if (row.role === 'ADMIN') return <span className="text-xs text-gray-400">Total (Admin)</span>;
        if (row.role === 'DOCTOR') {
          return row.puedeVerAuditoria ? (
            <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded text-[10px] font-bold border border-teal-200">Autorizado</span>
          ) : (
            <span className="text-gray-400 text-xs">Sin acceso</span>
          );
        }
        return <span className="text-gray-300 text-xs">—</span>;
      }
    },
    { 
      key: 'enabled', 
      header: 'Estado',
      render: (row: UserRow) => row.enabled ? (
        <span className="text-green-600 font-medium">Activo</span>
      ) : (
        <span className="text-red-500 font-medium">Inactivo</span>
      )
    }
  ];

  if (!isAdmin) {
    return (
      <div className="text-red-600 text-center mt-10 font-bold">
        No tiene permisos para acceder a esta página.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Administración de Usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">Crea, edita perfiles y autoriza permisos especiales.</p>
        </div>
        <button
          onClick={() => { 
            setEditingUser(null); 
            setForm({ username: '', password: '', email: '', role: 'ALUMNO', enabled: true, puedeVerAuditoria: false });
            setShowForm(true); 
            setError(''); 
            setSuccess(''); 
          }}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          Nuevo Usuario
        </button>
      </div>

      {success && (
        <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-lg mb-6 text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            {editingUser ? `Editar Perfil de "${editingUser.username}"` : 'Crear Nuevo Usuario'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre de Usuario</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
                placeholder="usuario@siga.local"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Contraseña {editingUser && <span className="text-gray-400">(Dejar en blanco para conservar)</span>}
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
                required={!editingUser}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Rol / Tipo de Cuenta</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
                required
              >
                <option value="ALUMNO">Alumno</option>
                <option value="DOCTOR">Doctor (Médico)</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            {/* Checkbox para autorizar auditoria (Solo si es doctor) */}
            {form.role === 'DOCTOR' && (
              <div className="flex items-center space-x-2 p-2 bg-teal-50 rounded-lg border border-teal-100 md:col-span-2">
                <input
                  type="checkbox"
                  id="puedeVerAuditoria"
                  checked={form.puedeVerAuditoria}
                  onChange={(e) => setForm({ ...form, puedeVerAuditoria: e.target.checked })}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="puedeVerAuditoria" className="text-sm font-semibold text-teal-800 cursor-pointer select-none">
                  Autorizar acceso a Logs de Auditoría y Seguridad
                </label>
              </div>
            )}

            <div className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id="enabled"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="enabled" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                Cuenta Habilitada / Activa
              </label>
            </div>

            <div className="md:col-span-2 flex space-x-2 border-t border-gray-100 pt-4 mt-2">
              <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-semibold text-sm transition shadow-sm">
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingUser(null); }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold text-sm transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando cuentas de usuario...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <DataTable 
            columns={columns} 
            data={users} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
};

export default Usuarios;
