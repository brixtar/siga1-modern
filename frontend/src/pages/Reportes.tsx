import React, { useState } from 'react';
import { reporteService } from '../services/reporteService';
import type { ReporteEstadisticas } from '../types';

const Reportes: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [reporte, setReporte] = useState<ReporteEstadisticas | null>(null);
  const [loading, setLoading] = useState(false);

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
          <h2 className="text-lg font-semibold mb-4">Resultados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Consultas</p>
              <p className="text-2xl font-bold text-blue-800">{reporte.totalConsultas}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Derivaciones</p>
              <p className="text-2xl font-bold text-green-800">{reporte.totalDerivaciones}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Retornos</p>
              <p className="text-2xl font-bold text-purple-800">{reporte.totalRetornos}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Exámenes</p>
              <p className="text-2xl font-bold text-orange-800">{reporte.totalExamenes}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reporte.porDoctor && reporte.porDoctor.length > 0 && (
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">Consultas por Doctor</h3>
                <table className="min-w-full bg-white border border-gray-200 rounded">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Doctor</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reporte.porDoctor.map((item) => (
                      <tr key={item.doctorId}>
                        <td className="px-4 py-2 text-sm text-gray-700">{item.nombre}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{item.cantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {reporte.porAlumno && reporte.porAlumno.length > 0 && (
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">Consultas por Alumno</h3>
                <table className="min-w-full bg-white border border-gray-200 rounded">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Alumno</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reporte.porAlumno.map((item) => (
                      <tr key={item.alumnoId}>
                        <td className="px-4 py-2 text-sm text-gray-700">{item.nombre}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{item.cantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;
