import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { duenioService } from '../services/duenioService';
import { animalService } from '../services/animalService';
import { consultaService } from '../services/consultaService';
import { doctorService } from '../services/doctorService';
import { medicamentoService } from '../services/medicamentoService';
import type { Medicamento } from '../types';

interface Stats {
  duenios: number;
  animales: number;
  consultas: number;
  doctores: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ duenios: 0, animales: 0, consultas: 0, doctores: 0 });
  const [lowStockMeds, setLowStockMeds] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [duenios, animales, consultas, doctores, lowStock] = await Promise.all([
          duenioService.getAll(),
          animalService.getAll(),
          consultaService.getAll(),
          doctorService.getAll(),
          medicamentoService.getLowStock(),
        ]);
        setStats({
          duenios: duenios.length,
          animales: animales.length,
          consultas: consultas.length,
          doctores: doctores.length,
        });
        setLowStockMeds(lowStock);
      } catch {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    { label: 'Dueños', value: stats.duenios, icon: '👤', color: 'bg-blue-500' },
    { label: 'Animales', value: stats.animales, icon: '🐾', color: 'bg-green-500' },
    { label: 'Consultas', value: stats.consultas, icon: '📋', color: 'bg-yellow-500' },
    { label: 'Doctores', value: stats.doctores, icon: '👨‍⚕️', color: 'bg-purple-500' },
  ];

  const quickActions = [
    { label: 'Nueva Consulta', path: '/consultas', color: 'bg-blue-600' },
    { label: 'Nuevo Dueño', path: '/duenios', color: 'bg-green-600' },
    { label: 'Nuevo Animal', path: '/animales', color: 'bg-yellow-600' },
    { label: 'Ver Reportes', path: '/reportes', color: 'bg-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Inicio</h1>

      {lowStockMeds.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-sm font-semibold text-red-800">Alerta de Inventario de Farmacia</h3>
              <p className="text-xs text-red-700 mt-0.5">
                Hay {lowStockMeds.length} medicamento{lowStockMeds.length > 1 ? 's' : ''} con stock igual o inferior al mínimo configurado.
              </p>
            </div>
          </div>
          <Link
            to="/farmacia"
            className="text-xs font-semibold text-red-800 hover:text-red-950 underline px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded border border-red-200 transition"
          >
            Revisar Farmacia
          </Link>
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Cargando estadísticas...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <div key={card.label} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`${card.color} text-white p-3 rounded-lg mr-4`}>
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{card.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className={`${action.color} text-white rounded-lg shadow p-4 text-center hover:opacity-90 transition-opacity`}
              >
                <span className="font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
