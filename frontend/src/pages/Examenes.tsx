import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { hemogramaService, quimicaService, urianalisisService } from '../services/examenService';
import type { Hemograma, QuimicaClinica, Urianalisis } from '../types';

type ExamenTab = 'hemograma' | 'quimica' | 'urianalisis';

const tabs = [
  { key: 'hemograma' as ExamenTab, label: 'Hemograma' },
  { key: 'quimica' as ExamenTab, label: 'Química Clínica' },
  { key: 'urianalisis' as ExamenTab, label: 'Urianálisis' },
];

const Examenes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ExamenTab>('hemograma');
  const [hemogramas, setHemogramas] = useState<Hemograma[]>([]);
  const [quimicas, setQuimicas] = useState<QuimicaClinica[]>([]);
  const [urianalisis, setUrianalisis] = useState<Urianalisis[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const [h, q, u] = await Promise.all([
        hemogramaService.getAll(),
        quimicaService.getAll(),
        urianalisisService.getAll(),
      ]);
      setHemogramas(h);
      setQuimicas(q);
      setUrianalisis(u);
    } catch {
      alert('Error al cargar exámenes');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number, tipo: ExamenTab) => {
    if (!confirm('¿Eliminar examen?')) return;
    try {
      if (tipo === 'hemograma') await hemogramaService.delete(id);
      else if (tipo === 'quimica') await quimicaService.delete(id);
      else await urianalisisService.delete(id);
      load();
    } catch {
      alert('Error al eliminar');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baseData = {
        fecha: form.fecha || new Date().toISOString().slice(0, 16),
        consultaId: form.consultaId ? Number(form.consultaId) : undefined,
        animalId: form.animalId ? Number(form.animalId) : undefined,
        doctorId: form.doctorId ? Number(form.doctorId) : undefined,
        observaciones: form.observaciones || '',
      };

      if (activeTab === 'hemograma') {
        await hemogramaService.create({
          ...baseData,
          eritrocitos: form.eritrocitos,
          hemoglobina: form.hemoglobina,
          hematocrito: form.hematocrito,
          vcm: form.vcm,
          hcm: form.hcm,
          chcm: form.chcm,
          leucocitos: form.leucocitos,
        } as Omit<Hemograma, 'id'>);
      } else if (activeTab === 'quimica') {
        await quimicaService.create({
          ...baseData,
          glucemia: form.glucemia,
          uremia: form.uremia,
          creatininemia: form.creatininemia,
          got: form.got,
          gpt: form.gpt,
        } as Omit<QuimicaClinica, 'id'>);
      } else {
        await urianalisisService.create({
          ...baseData,
          color: form.color,
          aspecto: form.aspecto,
          ph: form.ph,
          proteina: form.proteina,
          glucosa: form.glucosa,
        } as Omit<Urianalisis, 'id'>);
      }
      setShowForm(false);
      setForm({});
      load();
    } catch {
      alert('Error al guardar');
    }
  };

  const renderTable = () => {
    if (activeTab === 'hemograma') {
      return (
        <DataTable
          columns={[
            { key: 'fecha', header: 'Fecha' },
            { key: 'protocoloLab', header: 'Protocolo' },
            { key: 'eritrocitos', header: 'Eritrocitos' },
            { key: 'hemoglobina', header: 'Hb' },
            { key: 'leucocitos', header: 'Leucocitos' },
          ]}
          data={hemogramas}
          onDelete={(row) => handleDelete(row.id, 'hemograma')}
        />
      );
    } else if (activeTab === 'quimica') {
      return (
        <DataTable
          columns={[
            { key: 'fecha', header: 'Fecha' },
            { key: 'protocoloLab', header: 'Protocolo' },
            { key: 'glucemia', header: 'Glucemia' },
            { key: 'uremia', header: 'Uremia' },
            { key: 'got', header: 'GOT' },
          ]}
          data={quimicas}
          onDelete={(row) => handleDelete(row.id, 'quimica')}
        />
      );
    } else {
      return (
        <DataTable
          columns={[
            { key: 'fecha', header: 'Fecha' },
            { key: 'protocoloLab', header: 'Protocolo' },
            { key: 'color', header: 'Color' },
            { key: 'ph', header: 'pH' },
            { key: 'glucosa', header: 'Glucosa' },
          ]}
          data={urianalisis}
          onDelete={(row) => handleDelete(row.id, 'urianalisis')}
        />
      );
    }
  };

  const renderFormFields = () => {
    const input = (label: string, key: string) => (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          type="text"
          value={form[key] || ''}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );

    const common = (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="datetime-local"
            value={form.fecha || ''}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {input('Protocolo Lab', 'protocoloLab')}
        {input('Consulta ID', 'consultaId')}
        {input('Animal ID', 'animalId')}
        {input('Doctor ID', 'doctorId')}
      </>
    );

    if (activeTab === 'hemograma') {
      return (
        <>
          {common}
          {input('Eritrocitos', 'eritrocitos')}
          {input('Hemoglobina', 'hemoglobina')}
          {input('Hematocrito', 'hematocrito')}
          {input('VCM', 'vcm')}
          {input('HCM', 'hcm')}
          {input('CHCM', 'chcm')}
          {input('Leucocitos', 'leucocitos')}
        </>
      );
    } else if (activeTab === 'quimica') {
      return (
        <>
          {common}
          {input('Glucemia', 'glucemia')}
          {input('Uremia', 'uremia')}
          {input('Creatininemia', 'creatininemia')}
          {input('Fosfatemia', 'fosfatemia')}
          {input('Albuminemia', 'albuminemia')}
          {input('GOT', 'got')}
          {input('GPT', 'gpt')}
          {input('CPK', 'cpk')}
          {input('LDH', 'ldh')}
        </>
      );
    } else {
      return (
        <>
          {common}
          {input('Color', 'color')}
          {input('Aspecto', 'aspecto')}
          {input('Densidad', 'densidad')}
          {input('pH', 'ph')}
          {input('Proteína', 'proteina')}
          {input('Urobilinógeno', 'urobilinogeno')}
          {input('Glucosa', 'glucosa')}
          {input('C. Cetónicos', 'cCetonicos')}
          {input('Leucocitos', 'leucocitos')}
        </>
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Exámenes de Laboratorio</h1>
        <button
          onClick={() => { setShowForm(true); setForm({}); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo Examen
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Nuevo {tabs.find(t => t.key === activeTab)?.label}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderFormFields()}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea
                value={form.observaciones || ''}
                onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div className="md:col-span-3 flex space-x-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Guardar
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Cargando...</div>
      ) : (
        renderTable()
      )}
    </div>
  );
};

export default Examenes;
