import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { retornoService } from '../services/retornoService';
import { consultaService } from '../services/consultaService';
import type { Retorno, Consulta } from '../types';

const Retornos: React.FC = () => {
  const [retornos, setRetornos] = useState<Retorno[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Retorno>>({});

  const load = async () => {
    setLoading(true);
    try {
      const [r, c] = await Promise.all([retornoService.getAll(), consultaService.getAll()]);
      setRetornos(r);
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
      await retornoService.create(form as Omit<Retorno, 'id'>);
      setShowForm(false);
      setForm({});
      load();
    } catch {
      alert('Error al guardar');
    }
  };

  const handleDelete = async (retorno: Retorno) => {
    if (!confirm('¿Eliminar retorno?')) return;
    try {
      await retornoService.delete(retorno.id);
      load();
    } catch {
      alert('Error al eliminar');
    }
  };

  const columns = [
    { key: 'fecha' as keyof Retorno, header: 'Fecha' },
    { key: 'anamnesis' as keyof Retorno, header: 'Anamnesis' },
    { key: 'indicaciones' as keyof Retorno, header: 'Indicaciones' },
    { key: 'consulta' as any, header: 'Consulta', render: (row: Retorno) => row.consulta ? `Consulta #${row.consulta.id}` : '-' },
    { key: 'animal' as any, header: 'Animal', render: (row: Retorno) => row.animal?.nombre || '-' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Retornos</h1>
        <button
          onClick={() => { setShowForm(true); setForm({}); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo Retorno
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Nuevo Retorno</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consulta Original</label>
              <select
                value={form.consultaId || ''}
                onChange={(e) => setForm({ ...form, consultaId: Number(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                {consultas.map((c) => (
                  <option key={c.id} value={c.id}>Consulta #{c.id} - {c.motivo}</option>
                ))}
              </select>
            </div>
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
        <DataTable columns={columns} data={retornos} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Retornos;
