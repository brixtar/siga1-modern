import React from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const getRoleLabel = () => {
    if (!user) return '';
    if (user.roles.includes('ADMIN')) return 'Admin';
    if (user.roles.includes('DOCTOR')) return 'Médico';
    return 'Alumno';
  };

  const getRoleColor = () => {
    if (!user) return '';
    if (user.roles.includes('ADMIN')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (user.roles.includes('DOCTOR')) return 'bg-sky-50 text-sky-700 border-sky-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex items-center gap-3">
          <span className="text-xl lg:hidden font-bold text-teal-600 tracking-wider">SIGA</span>
          <h2 className="text-base lg:text-lg font-bold text-slate-800 hidden sm:block lg:ml-2">
            Sistema de Gestión Veterinaria
          </h2>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-3 border-r border-slate-100 pr-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {userInitial}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-700 capitalize leading-tight">
                {user?.username}
              </span>
              <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold border mt-0.5 w-max ${getRoleColor()}`}>
                {getRoleLabel()}
              </span>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
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
