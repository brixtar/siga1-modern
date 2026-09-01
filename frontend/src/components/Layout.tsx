import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  if (!user || isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950 transition-colors duration-200">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-slate-900 p-4 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
