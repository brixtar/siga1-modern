import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { duenioService } from '../services/duenioService';
import { animalService } from '../services/animalService';
import { useAuth } from '../context/AuthContext';
import type { Duenio, Animal } from '../types';

const Duenios: React.FC = () => {
  const { hasRole } = useAuth();
  const [duenios, setDuenios] = useState<Duenio[]>([]);
  const [allAnimals, setAllAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Duenio | null>(null);
  const [form, setForm] = useState<Partial<Duenio>>({});

  const canModify = hasRole('ADMIN') || hasRole('DOCTOR');

  const load = async () => {
    setLoading(true);
    try {
      const [ownersData, animalsData] = await Promise.all([
        duenioService.getAll(),
        animalService.getAll()
      ]);
      setDuenios(ownersData);
      setAllAnimals(animalsData);
    } catch {
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canModify) return;
    try {
      if (editing) {
        await duenioService.update(editing.id, form);
      } else {
        await duenioService.create(form as Omit<Duenio, 'id'>);
      }
      setShowForm(false);
      setEditing(null);
      setForm({});
      load();
    } catch {
      alert('Error al guardar');
    }
  };

  const handleEdit = (duenio: Duenio) => {
    if (!canModify) return;
    setEditing(duenio);
    setForm(duenio);
    setShowForm(true);
  };

  const handleDelete = async (duenio: Duenio) => {
    if (!canModify) return;
    if (!confirm(`¿Eliminar dueño "${duenio.nombre} ${duenio.apellido}"?`)) return;
    try {
      await duenioService.delete(duenio.id);
      load();
    } catch {
      alert('Error al eliminar');
    }
  };

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'apellido', header: 'Apellido' },
    { key: 'dni', header: 'DNI' },
    { key: 'telefonoCelular', header: 'Teléfono' },
    { key: 'email', header: 'Email' },
    {
      key: 'id',
      header: 'Animales / Mascotas',
      render: (row: Duenio) => {
        const connected = allAnimals.filter(a => a.duenioId === row.id || a.duenio?.id === row.id);
        if (connected.length === 0) {
          return <span className="text-gray-400 text-xs italic">Ninguno asignado</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {connected.map(a => (
              <span 
                key={a.id} 
                className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 shadow-sm"
              >
                🐾 {a.nombre}
              </span>
            ))}
          </div>
        );
      }
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dueños</h1>
          <p className="text-sm text-gray-500 mt-1">Directorio de propietarios y sus mascotas vinculadas.</p>
        </div>
        {canModify && (
          <button
            onClick={() => { setShowForm(true); setEditing(null); setForm({}); }}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
          >
            Nuevo Dueño
          </button>
        )}
      </div>

      {showForm && canModify && (
        <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-bold mb-4 text-gray-800">{editing ? 'Editar Dueño' : 'Nuevo Dueño'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre</label>
              <input
                type="text"
                value={form.nombre || ''}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Apellido</label>
              <input
                type="text"
                value={form.apellido || ''}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">DNI</label>
              <input
                type="text"
                value={form.dni || ''}
                onChange={(e) => setForm({ ...form, dni: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Teléfono Celular</label>
              <input
                type="text"
                value={form.telefonoCelular || ''}
                onChange={(e) => setForm({ ...form, telefonoCelular: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
              <input
                type="email"
                value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Domicilio</label>
              <input
                type="text"
                value={form.domicilio || ''}
                onChange={(e) => setForm({ ...form, domicilio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white text-gray-800"
              />
            </div>
            <div className="md:col-span-2 flex space-x-2 border-t border-gray-100 pt-4 mt-2">
              <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-semibold text-sm transition shadow-sm">
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold text-sm transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando dueños...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <DataTable 
            columns={columns} 
            data={duenios} 
            onEdit={canModify ? handleEdit : undefined} 
            onDelete={canModify ? handleDelete : undefined} 
          />
        </div>
      )}
    </div>
  );
};

export default Duenios;
