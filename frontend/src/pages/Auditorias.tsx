import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import api from '../services/api';
import type { Auditoria } from '../types';

const Auditorias: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [filteredData, setFilteredData] = useState<Auditoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAudit, setSelectedAudit] = useState<Auditoria | null>(null);

  const fetchAuditorias = async () => {
    try {
      setLoading(true);
      const res = await api.get<Auditoria[]>('/auditorias');
      setAuditorias(res.data);
      setFilteredData(res.data);
      setError('');
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar los logs de auditoria');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasAccess = isAdmin || (user?.roles?.includes('DOCTOR') && user?.puedeVerAuditoria);
    if (hasAccess) {
      fetchAuditorias();
    }
  }, [isAdmin, user]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = auditorias.filter((audit: Auditoria) => 
      audit.username.toLowerCase().includes(term) ||
      audit.accion.toLowerCase().includes(term) ||
      audit.tabla.toLowerCase().includes(term) ||
      (audit.detalles && audit.detalles.toLowerCase().includes(term))
    );
    setFilteredData(filtered);
  }, [searchTerm, auditorias]);

  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    
    const headers = ['Fecha y Hora', 'Usuario', 'Accion', 'Modulo', 'ID Registro', 'Detalles'];
    
    const rows = filteredData.map((audit: Auditoria) => [
      new Date(audit.fecha).toLocaleString('es-ES'),
      audit.username,
      audit.accion,
      audit.tabla,
      audit.registroId ?? 'N/A',
      (audit.detalles || '').replace(/"/g, '""')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map((val: any) => `"${val}"`).join(','))
    ].join('\r\n');
    
    // Blob con BOM UTF-8 para que Excel muestre tildes y caracteres especiales en español correctamente
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const nowStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `auditoria_siga_${nowStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { 
      key: 'fecha', 
      header: 'Fecha y Hora',
      render: (row: Auditoria) => new Date(row.fecha).toLocaleString('es-ES')
    },
    { key: 'username', header: 'Usuario' },
    { 
      key: 'accion', 
      header: 'Acción',
      render: (row: Auditoria) => {
        const colors: Record<string, string> = {
          CREATE: 'bg-green-100 text-green-800 border border-green-200',
          UPDATE: 'bg-blue-100 text-blue-800 border border-blue-200',
          DELETE: 'bg-red-100 text-red-800 border border-red-200'
        };
        const color = colors[row.accion] || 'bg-gray-100 text-gray-800';
        return (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
            {row.accion}
          </span>
        );
      }
    },
    { 
      key: 'tabla', 
      header: 'Módulo / Tabla',
      render: (row: Auditoria) => (
        <span className="capitalize font-medium text-gray-600">{row.tabla}</span>
      )
    },
    { key: 'registroId', header: 'ID Registro' },
    { 
      key: 'detalles', 
      header: 'Resumen',
      render: (row: Auditoria) => {
        const text = row.detalles || '';
        return text.length > 60 ? text.substring(0, 60) + '...' : text;
      }
    }
  ];

  const hasAccess = isAdmin || (user?.roles?.includes('DOCTOR') && user?.puedeVerAuditoria);

  if (!hasAccess) {
    return (
      <div className="text-red-600 text-center mt-10 font-semibold">
        No tiene permisos para acceder a esta página.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Auditoría del Sistema</h1>
          <p className="text-sm text-gray-500 mt-1">
            Logs de control médico y tracking de modificaciones.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
          <button
            onClick={exportToCSV}
            disabled={filteredData.length === 0}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow transition-colors"
          >
            <span>📥 Exportar CSV</span>
          </button>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Buscar por usuario, acción, módulo..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-800"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="text-gray-500">Cargando logs de auditoría...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <DataTable 
            columns={columns} 
            data={filteredData} 
            onView={(row) => setSelectedAudit(row)}
          />
        </div>
      )}

      {selectedAudit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Detalle de Registro Auditoría</h3>
              <button 
                onClick={() => setSelectedAudit(null)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase">Fecha y Hora</span>
                  <span className="text-sm font-medium text-gray-800">
                    {new Date(selectedAudit.fecha).toLocaleString('es-ES')}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase">Usuario responsable</span>
                  <span className="text-sm font-medium text-gray-800">{selectedAudit.username}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase">Acción realizada</span>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800 border mt-1">
                    {selectedAudit.accion}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase">Módulo afectado</span>
                  <span className="text-sm font-medium text-gray-800 capitalize">{selectedAudit.tabla}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase">ID Registro</span>
                  <span className="text-sm font-medium text-gray-800">{selectedAudit.registroId ?? 'N/A'}</span>
                </div>
              </div>
              <hr className="border-gray-100" />
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase mb-2">Detalles Técnicos</span>
                <pre className="bg-gray-50 text-gray-700 text-xs font-mono p-4 rounded-lg overflow-x-auto whitespace-pre-wrap border border-gray-100">
                  {selectedAudit.detalles}
                </pre>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50">
              <button
                onClick={() => setSelectedAudit(null)}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auditorias;
