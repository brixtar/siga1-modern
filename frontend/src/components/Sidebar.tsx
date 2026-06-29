import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { hasRole, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/duenios', label: 'Dueños', icon: '👤' },
    { path: '/animales', label: 'Animales', icon: '🐾' },
    { path: '/consultas', label: 'Consultas', icon: '📋' },
    { path: '/examenes', label: 'Exámenes', icon: '🔬' },
    { path: '/derivaciones', label: 'Derivaciones', icon: '↗️' },
    { path: '/retornos', label: 'Retornos', icon: '↩️' },
    { path: '/turnos', label: 'Agenda / Turnos', icon: '📅' },
    { path: '/farmacia', label: 'Farmacia', icon: '💊' },
    { path: '/reportes', label: 'Reportes', icon: '📊' },
    ...(hasRole('ADMIN') ? [{ path: '/usuarios', label: 'Usuarios', icon: '👥' }] : []),
    ...(hasRole('ADMIN') || (hasRole('DOCTOR') && user?.puedeVerAuditoria) ? [
      { path: '/auditorias', label: 'Auditorías', icon: '🔒' }
    ] : []),
    { path: '/perfil', label: 'Perfil', icon: '⚙️' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b">
          <span className="text-xl font-bold text-teal-600">SIGA</span>
        </div>
        <nav className="mt-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center px-6 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors ${
                    isActive(item.path) ? 'bg-teal-50 text-teal-600 border-r-4 border-teal-600' : ''
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
