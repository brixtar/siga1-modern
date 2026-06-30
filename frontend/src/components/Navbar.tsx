import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getRoleLabel = () => {
    if (!user) return '';
    if (user.roles.includes('ADMIN')) return 'Admin';
    if (user.roles.includes('DOCTOR')) return 'Médico';
    return 'Alumno';
  };

  const getRoleColor = () => {
    if (!user) return '';
    if (user.roles.includes('ADMIN')) return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/50';
    if (user.roles.includes('DOCTOR')) return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800/50';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50';
  };

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-200">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white focus:outline-none p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex items-center gap-3">
          <span className="text-xl lg:hidden font-bold text-teal-600 dark:text-teal-400 tracking-wider">SIGA</span>
          <h2 className="text-base lg:text-lg font-bold text-slate-800 dark:text-slate-100 hidden sm:block lg:ml-2">
            Sistema de Gestión Veterinaria
          </h2>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 text-sm font-semibold flex items-center gap-1.5"
            title="Cambiar Tema"
          >
            {theme === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
          </button>

          <div className="flex items-center gap-3 border-r border-slate-100 dark:border-slate-800 pr-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {userInitial}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize leading-tight">
                {user?.username}
              </span>
              <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold border mt-0.5 w-max ${getRoleColor()}`}>
                {getRoleLabel()}
              </span>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50"
          >
            <span>Cerrar Sesión</span>
            <span className="text-xs">🚪</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
