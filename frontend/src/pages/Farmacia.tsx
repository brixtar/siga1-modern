import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { medicamentoService } from '../services/medicamentoService';
import type { Medicamento } from '../types';
import { useAuth } from '../context/AuthContext';

const Farmacia: React.FC = () => {
  const { user } = useAuth();
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Medicamento | null>(null);
  const [form, setForm] = useState<Partial<Medicamento>>({});

  const canModify = user
    ? user.roles.includes('ADMIN') || user.roles.includes('DOCTOR')
    : false;

  const load = async () => {
    setLoading(true);
    try {
      const data = await medicamentoService.getAll();
      setMedicamentos(data);
    } catch {
      alert('Error al cargar medicamentos');
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
      const payload = {
        nombre: form.nombre || '',
        descripcion: form.descripcion || '',
        cantidadStock: Number(form.cantidadStock ?? 0),
        stockMinimo: Number(form.stockMinimo ?? 5),
        precioUnidad: form.precioUnidad != null ? Number(form.precioUnidad) : undefined,
        unidadMedida: form.unidadMedida || '',
      };

      if (editing && editing.id) {
        await medicamentoService.update(editing.id, payload);
      } else {
        await medicamentoService.create(payload);
      }
      setShowForm(false);
      setEditing(null);
      setForm({});
      load();
    } catch {
      alert('Error al guardar medicamento');
    }
  };

  const handleEdit = (med: Medicamento) => {
    if (!canModify) return;
    setEditing(med);
    setForm(med);
    setShowForm(true);
  };

  const handleDelete = async (med: Medicamento) => {
    if (!canModify) return;
    if (!med.id) return;
    if (!confirm(`¿Eliminar medicamento "${med.nombre}"?`)) return;
    try {
      await medicamentoService.delete(med.id);
      load();
    } catch {
      alert('Error al eliminar');
    }
  };

  const columns = [
    { key: 'nombre', header: 'Medicamento' },
    { key: 'descripcion', header: 'Descripción' },
    { key: 'unidadMedida', header: 'Unidad de Medida' },
    {
      key: 'cantidadStock',
      header: 'Stock',
      render: (row: Medicamento) => (
        <div className="flex items-center space-x-2">
          <span className={`font-semibold ${row.cantidadStock <= row.stockMinimo ? 'text-red-600' : 'text-gray-800'}`}>
            {row.cantidadStock}
          </span>
          {row.cantidadStock <= row.stockMinimo && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium border border-red-200">
              Bajo Stock
            </span>
          )}
        </div>
      ),
    },
    { key: 'stockMinimo', header: 'Stock Mínimo' },
    {
      key: 'precioUnidad',
      header: 'Precio Unitario',
      render: (row: Medicamento) =>
        row.precioUnidad != null ? `$${row.precioUnidad.toLocaleString()}` : '-',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Control de Farmacia</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de stock de medicamentos y alertas de inventario</p>
        </div>
        {canModify && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setForm({ cantidadStock: 0, stockMinimo: 5 });
            }}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-medium transition"
          >
            Nuevo Medicamento
          </button>
        )}
      </div>

      {showForm && canModify && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-150">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            {editing ? 'Editar Medicamento' : 'Nuevo Medicamento'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={form.nombre || ''}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida (ml, mg, comprimido, etc.)</label>
              <input
                type="text"
                value={form.unidadMedida || ''}
                onChange={(e) => setForm({ ...form, unidadMedida: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={form.descripcion || ''}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad en Stock</label>
              <input
                type="number"
                value={form.cantidadStock ?? ''}
                onChange={(e) => setForm({ ...form, cantidadStock: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alerta de Stock Mínimo</label>
              <input
                type="number"
                value={form.stockMinimo ?? ''}
                onChange={(e) => setForm({ ...form, stockMinimo: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Unitario ($)</label>
              <input
                type="number"
                step="any"
                value={form.precioUnidad ?? ''}
                onChange={(e) => setForm({ ...form, precioUnidad: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                min={0}
              />
            </div>
            <div className="md:col-span-2 flex space-x-2 mt-2">
              <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                  setForm({});
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
          <span className="ml-3 text-gray-600">Cargando inventario...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
          <DataTable
            columns={columns}
            data={medicamentos}
            onEdit={canModify ? handleEdit : undefined}
            onDelete={canModify ? handleDelete : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default Farmacia;
