import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { consultaService } from '../services/consultaService';
import { animalService } from '../services/animalService';
import { doctorService } from '../services/doctorService';
import type { Consulta, Animal, Doctor } from '../types';

const Consultas: React.FC = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Consulta>>({ estado: 'PENDIENTE' });
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const [c, a, d] = await Promise.all([
        consultaService.getAll(),
        animalService.getAll(),
        doctorService.getAll(),
      ]);
      setConsultas(c);
      setAnimales(a);
      setDoctores(d);
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
    try {
      await consultaService.create(form as Omit<Consulta, 'id'>);
      setShowForm(false);
      setForm({ estado: 'PENDIENTE' });
      load();
    } catch {
      alert('Error al guardar');
    }
  };

  const handleDelete = async (consulta: Consulta) => {
    if (!confirm('¿Eliminar consulta?')) return;
    try {
      await consultaService.delete(consulta.id);
      load();
    } catch {
      alert('Error al eliminar');
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'EN_ATENCION': return 'bg-blue-100 text-blue-800';
      case 'COMPLETADA': return 'bg-green-100 text-green-800';
      case 'CANCELADA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { key: 'fecha' as keyof Consulta, header: 'Fecha' },
    { key: 'motivo' as keyof Consulta, header: 'Motivo' },
    { key: 'animal.nombre' as string, header: 'Animal' },
    { key: 'doctor.apellido' as string, header: 'Doctor' },
    {
      key: 'estado' as keyof Consulta,
      header: 'Estado',
      render: (row: Consulta) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(row.estado)}`}>
          {row.estado}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Consultas</h1>
        <button
          onClick={() => { setShowForm(true); setForm({ estado: 'PENDIENTE' }); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nueva Consulta
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Nueva Consulta</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="datetime-local"
                value={form.fecha || ''}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Animal</label>
              <select
                value={form.animalId || ''}
                onChange={(e) => setForm({ ...form, animalId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar...</option>
                {animales.map((a) => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <select
                value={form.doctorId || ''}
                onChange={(e) => setForm({ ...form, doctorId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar...</option>
                {doctores.map((d) => (
                  <option key={d.id} value={d.id}>{d.apellido}, {d.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
              <input
                type="text"
                value={form.motivo || ''}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Anamnesis</label>
              <textarea
                value={form.anamnesis || ''}
                onChange={(e) => setForm({ ...form, anamnesis: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Cargando...</div>
      ) : (
        <DataTable
          columns={columns}
          data={consultas}
          onView={(row) => navigate(`/consultas/${row.id}`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Consultas;
