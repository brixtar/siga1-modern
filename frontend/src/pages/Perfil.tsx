import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Perfil: React.FC = () => {
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProfile = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/users/${user.id}`);
      setUsername(res.data.username);
      setEmail(res.data.email || '');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error al cargar la información del perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await api.put(`/users/${user.id}`, {
        username,
        email,
        password: password || null,
        role: user.roles[0],
        enabled: true
      });
      setSuccess('Tu perfil ha sido actualizado correctamente.');
      setPassword('');
      if (user) {
        login({
          ...user,
          username
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const getRoleTitle = () => {
    if (!user) return '';
    if (user.roles.includes('ADMIN')) return 'Administrador';
    if (user.roles.includes('DOCTOR')) return 'Médico Veterinario (Doctor)';
    return 'Alumno (Estudiante)';
  };

  const getRoleDescription = () => {
    if (!user) return { desc: '', perms: [] as string[] };
    if (user.roles.includes('ADMIN')) {
      return {
        desc: 'Acceso total y administrativo al sistema.',
        perms: [
          'Gestión y creación de cuentas de usuario.',
          'Autorización manual del visor de Auditoría a Médicos.',
          'Control completo de inventario y stock de farmacia.',
          'Configuración global de especies y razas.',
          'Verificación de logs de seguridad del servidor.'
        ]
      };
    }
    if (user.roles.includes('DOCTOR')) {
      return {
        desc: 'Acceso clínico y operativo completo.',
        perms: [
          'Gestión de consultas y expedientes veterinarios.',
          'Prescripción de medicamentos deductiva sobre el inventario.',
          'Organización y gestión de la agenda semanal de turnos.',
          'Acceso a logs de seguridad (solo con autorización del administrador).'
        ]
      };
    }
    return {
      desc: 'Acceso práctico bajo supervisión en formato de Solo Lectura.',
      perms: [
        'Registro y visualización de fichas de consultas.',
        'Revisión clínica e historial cronológico de pacientes.',
        'Lectura del catálogo de inventario de medicamentos.',
        'Visualización de la agenda de citas programadas.',
        'Restricción estricta de edición, creación o eliminación de perfiles.'
      ]
    };
  };

  const roleInfo = getRoleDescription();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
        <p className="text-sm text-gray-500 mt-1">Administra tu información personal y revisa tus credenciales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Lado Izquierdo: Ficha de usuario y limites */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-3xl shadow-md mb-4">
              {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
            <h3 className="text-lg font-bold text-gray-800 capitalize">{user?.username}</h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1.5 bg-teal-50 border border-teal-150 text-teal-800">
              {getRoleTitle()}
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-4">
            <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
              Límites y Permisos del Rol
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">{roleInfo.desc}</p>
            <ul className="space-y-2">
              {roleInfo.perms.map((perm: string, idx: number) => (
                <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5 leading-relaxed">
                  <span className="text-teal-500 font-bold">✓</span>
                  <span>{perm}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lado Derecho: Formulario de edicion */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-150 pb-3">Editar Mis Datos</h3>

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

            {loading ? (
              <div className="text-center py-12 text-gray-500">Cargando perfil...</div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre de Usuario</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Nueva Contraseña <span className="text-gray-400 font-medium">(Dejar en blanco para no modificar)</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
                  />
                </div>

                <div className="border-t border-gray-100 pt-4 mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : 'Actualizar Perfil'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Perfil;
