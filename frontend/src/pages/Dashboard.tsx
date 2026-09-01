import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { duenioService } from '../services/duenioService';
import { animalService } from '../services/animalService';
import { consultaService } from '../services/consultaService';
import { doctorService } from '../services/doctorService';
import { medicamentoService } from '../services/medicamentoService';
import api from '../services/api';
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
  const [vaccineAlerts, setVaccineAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const [duenios, animales, consultas, doctores, lowStock, vacunasProx] = await Promise.all([
        duenioService.getAll(),
        animalService.getAll(),
        consultaService.getAll(),
        doctorService.getAll(),
        medicamentoService.getLowStock(),
        api.get<any[]>('/vacunas/alertas/proximas'),
      ]);
      setStats({
        duenios: duenios.length,
        animales: animales.length,
        consultas: consultas.length,
        doctores: doctores.length,
      });
      setLowStockMeds(lowStock);
      setVaccineAlerts(vacunasProx.data);
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const statCards = [
    { 
      label: 'Dueños Registrados', 
      value: stats.duenios, 
      icon: (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ), 
      color: 'from-blue-500 to-indigo-500', 
      glow: 'shadow-blue-500/15' 
    },
    { 
      label: 'Pacientes Animales', 
      value: stats.animales, 
      icon: (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ), 
      color: 'from-emerald-500 to-teal-500', 
      glow: 'shadow-emerald-500/15' 
    },
    { 
      label: 'Consultas Clínicas', 
      value: stats.consultas, 
      icon: (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ), 
      color: 'from-amber-500 to-orange-500', 
      glow: 'shadow-amber-500/15' 
    },
    { 
      label: 'Doctores Activos', 
      value: stats.doctores, 
      icon: (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ), 
      color: 'from-violet-500 to-purple-500', 
      glow: 'shadow-violet-500/15' 
    },
  ];

  const quickActions = [
    { 
      label: 'Nueva Consulta', 
      path: '/consultas', 
      color: 'text-blue-600 dark:text-blue-400', 
      icon: (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      label: 'Nuevo Dueño', 
      path: '/duenios', 
      color: 'text-emerald-600 dark:text-emerald-400', 
      icon: (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      )
    },
    { 
      label: 'Nuevo Animal', 
      path: '/animales', 
      color: 'text-amber-600 dark:text-amber-400', 
      icon: (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    },
    { 
      label: 'Ver Reportes', 
      path: '/reportes', 
      color: 'text-violet-600 dark:text-violet-400', 
      icon: (className: string) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent tracking-tight">
            Inicio
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Resumen general y accesos rápidos de SIGA</p>
        </div>
      </div>

      {lowStockMeds.length > 0 && (
        <div className="bg-rose-50/50 dark:bg-rose-950/20 border-l-4 border-rose-500 p-5 rounded-2xl shadow-sm dark:shadow-rose-950/5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border border-rose-100 dark:border-rose-900/30">
          <div className="flex items-center">
            <div className="p-2 bg-rose-100 dark:bg-rose-950/40 rounded-xl mr-3 text-rose-600 dark:text-rose-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300">Alerta de Inventario de Farmacia</h3>
              <p className="text-xs text-rose-650 dark:text-rose-400/80 mt-0.5">
                Hay {lowStockMeds.length} medicamento{lowStockMeds.length > 1 ? 's' : ''} con stock igual o inferior al mínimo configurado.
              </p>
            </div>
          </div>
          <Link
            to="/farmacia"
            className="text-xs font-bold text-rose-700 dark:text-rose-300 hover:text-rose-800 dark:hover:text-rose-200 px-4 py-2 bg-white dark:bg-slate-900 hover:bg-rose-100 dark:hover:bg-slate-800 border border-rose-200 dark:border-rose-800 rounded-xl transition text-center whitespace-nowrap"
          >
            Revisar Farmacia
          </Link>
        </div>
      )}

      {vaccineAlerts.length > 0 && (
        <div className="bg-teal-50/50 dark:bg-teal-950/20 border-l-4 border-teal-500 p-5 rounded-2xl shadow-sm dark:shadow-teal-950/5 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 border border-teal-100 dark:border-teal-900/30">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 dark:bg-teal-950/40 rounded-xl mr-3 text-teal-600 dark:text-teal-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-teal-800 dark:text-teal-300">Recordatorio de Próximas Vacunaciones</h3>
              <p className="text-xs text-teal-650 dark:text-teal-400/80 mt-0.5">
                Hay {vaccineAlerts.length} vacuna{vaccineAlerts.length > 1 ? 's' : ''} programada{vaccineAlerts.length > 1 ? 's' : ''} para vencer en los próximos 30 días.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={async () => {
                try {
                  const res = await api.post('/vacunas/alertas/procesar-manual');
                  alert(res.data);
                  const refreshed = await api.get<any[]>('/vacunas/alertas/proximas');
                  setVaccineAlerts(refreshed.data);
                } catch (err) {
                  console.error(err);
                  alert("Error al simular envío");
                }
              }}
              className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 px-4 py-2 bg-white dark:bg-slate-900 hover:bg-teal-100 dark:hover:bg-slate-800 border border-teal-200 dark:border-teal-800 rounded-xl transition text-center whitespace-nowrap"
            >
              📧 Simular Envío de Alertas
            </button>
            <Link
              to="/animales"
              className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 px-4 py-2 bg-white dark:bg-slate-900 hover:bg-teal-100 dark:hover:bg-slate-800 border border-teal-200 dark:border-teal-800 rounded-xl transition text-center whitespace-nowrap"
            >
              Ver Pacientes
            </Link>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10 text-slate-500 dark:text-slate-400">
          <span className="text-sm">Cargando estadísticas...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statCards.map((card) => (
              <div key={card.label} className="premium-card p-6 flex items-center shadow-lg transition-transform duration-300 hover:scale-[1.01]">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} text-white mr-5 shadow-lg ${card.glow}`}>
                  <span className="text-2xl select-none flex items-center justify-center">
                    {card.icon("w-6 h-6")}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{card.label}</p>
                  <p className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 mt-1">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className={`group flex flex-col items-center justify-center p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] text-center`}
                >
                  <div className={`w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-3 transition-transform duration-250 group-hover:scale-110 shadow-sm`}>
                    {action.icon(`w-6 h-6 ${action.color}`)}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-350">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
