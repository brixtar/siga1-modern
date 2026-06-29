import React, { useState } from 'react';
import { reporteService } from '../services/reporteService';
import type { ReporteEstadisticas } from '../types';

interface ChartItem {
  label: string;
  value: number;
  colorClass: string;
}

const HorizontalBarChart: React.FC<{ items: ChartItem[]; title: string }> = ({ items, title }) => {
  const maxVal = Math.max(...items.map(i => i.value), 1);
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-700 mb-4 tracking-tight">{title}</h3>
      <div className="space-y-4">
        {items.map((item, idx) => {
          const percentage = (item.value / maxVal) * 100;
          return (
            <div key={idx} className="space-y-1 hover:scale-[1.01] transition-transform duration-150">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span className="truncate max-w-[200px]">{item.label}</span>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${item.colorClass}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Reportes: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [reporte, setReporte] = useState<ReporteEstadisticas | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'charts' | 'tables'>('charts');

  const handleGenerate = async () => {
    if (!fechaInicio || !fechaFin) {
      alert('Seleccione ambas fechas');
      return;
    }
    setLoading(true);
    try {
      const data = await reporteService.getEstadisticas(fechaInicio, fechaFin);
      setReporte(data);
    } catch {
      alert('Error al generar reporte');
    } finally {
      setLoading(false);
    }
  };

  const getServiceItems = (rep: ReporteEstadisticas): ChartItem[] => [
    { label: 'Consultas', value: rep.totalConsultas, colorClass: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { label: 'Derivaciones', value: rep.totalDerivaciones, colorClass: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { label: 'Retornos', value: rep.totalRetornos, colorClass: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
    { label: 'Exámenes', value: rep.totalExamenes, colorClass: 'bg-gradient-to-r from-orange-500 to-rose-500' }
  ];

  const getDoctorItems = (rep: ReporteEstadisticas): ChartItem[] => 
    (rep.porDoctor || []).map(d => ({
      label: d.nombre,
      value: d.cantidad,
      colorClass: 'bg-gradient-to-r from-sky-500 to-indigo-500'
    }));

  const getAlumnoItems = (rep: ReporteEstadisticas): ChartItem[] => 
    (rep.porAlumno || []).map(a => ({
      label: a.nombre,
      value: a.cantidad,
      colorClass: 'bg-gradient-to-r from-emerald-500 to-teal-500'
    }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reportes</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generando...' : 'Generar'}
          </button>
        </div>
      </div>

      {reporte && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-800">Resultados</h2>
            
            {/* Control de pestañas */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('charts')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'charts'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📊 Vista Gráfica
              </button>
              <button
                onClick={() => setActiveTab('tables')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'tables'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📋 Vista Tabla
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Consultas</p>
              <p className="text-3xl font-extrabold text-blue-800 mt-1">{reporte.totalConsultas}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Total Derivaciones</p>
              <p className="text-3xl font-extrabold text-green-800 mt-1">{reporte.totalDerivaciones}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Total Retornos</p>
              <p className="text-3xl font-extrabold text-purple-800 mt-1">{reporte.totalRetornos}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm">
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Total Exámenes</p>
              <p className="text-3xl font-extrabold text-orange-800 mt-1">{reporte.totalExamenes}</p>
            </div>
          </div>

          {activeTab === 'charts' ? (
            /* Vista de Gráficos */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HorizontalBarChart
                  items={getServiceItems(reporte)}
                  title="Distribución de Servicios Realizados"
                />
                {reporte.porDoctor && reporte.porDoctor.length > 0 && (
                  <HorizontalBarChart
                    items={getDoctorItems(reporte)}
                    title="Consultas por Médico Veterinario"
                  />
                )}
              </div>
              {reporte.porAlumno && reporte.porAlumno.length > 0 && (
                <div className="max-w-xl mx-auto">
                  <HorizontalBarChart
                    items={getAlumnoItems(reporte)}
                    title="Consultas de Apoyo por Alumno"
                  />
                </div>
              )}
            </div>
          ) : (
            /* Vista de Tablas Tradicionales */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reporte.porDoctor && reporte.porDoctor.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-800 mb-2">Consultas por Doctor</h3>
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Doctor</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reporte.porDoctor.map((item) => (
                        <tr key={item.doctorId} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2.5 text-sm text-gray-700">{item.nombre}</td>
                          <td className="px-4 py-2.5 text-sm text-gray-700 font-bold">{item.cantidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {reporte.porAlumno && reporte.porAlumno.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-800 mb-2">Consultas por Alumno</h3>
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Alumno</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reporte.porAlumno.map((item) => (
                        <tr key={item.alumnoId} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2.5 text-sm text-gray-700">{item.nombre}</td>
                          <td className="px-4 py-2.5 text-sm text-gray-700 font-bold">{item.cantidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reportes;

