import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { derivacionService } from '../services/derivacionService';
import { consultaService } from '../services/consultaService';
import type { Derivacion, Consulta } from '../types';

const Derivaciones: React.FC = () => {
  const [derivaciones, setDerivaciones] = useState<Derivacion[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Derivacion>>({});

  const load = async () => {
    setLoading(true);
    try {
      const [d, c] = await Promise.all([derivacionService.getAll(), consultaService.getAll()]);
      setDerivaciones(d);
      setConsultas(c);
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
      await derivacionService.create(form as Omit<Derivacion, 'id'>);
      setShowForm(false);
      setForm({});
      load();
    } catch {
      alert('Error al guardar');
    }
  };

  const handleDelete = async (derivacion: Derivacion) => {
    if (!confirm('¿Eliminar derivación?')) return;
    try {
      await derivacionService.delete(derivacion.id);
      load();
    } catch {
      alert('Error al eliminar');
    }
  };

  const columns = [
    { key: 'fecha' as keyof Derivacion, header: 'Fecha' },
    { key: 'sistema' as keyof Derivacion, header: 'Sistema' },
    { key: 'indicaciones' as keyof Derivacion, header: 'Indicaciones' },
    { key: 'animal' as any, header: 'Animal', render: (row: Derivacion) => row.animal?.nombre || '-' },
    { key: 'doctor' as any, header: 'Doctor', render: (row: Derivacion) => row.doctor ? `${row.doctor.apellido}, ${row.doctor.nombre}` : '-' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Derivaciones</h1>
        <button
          onClick={() => { setShowForm(true); setForm({}); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nueva Derivación
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Nueva Derivación</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Sistema</label>
              <input
                type="text"
                value={form.sistema || ''}
                onChange={(e) => setForm({ ...form, sistema: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Indicaciones</label>
              <textarea
                value={form.indicaciones || ''}
                onChange={(e) => setForm({ ...form, indicaciones: e.target.value })}
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
        <DataTable columns={columns} data={derivaciones} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Derivaciones;
