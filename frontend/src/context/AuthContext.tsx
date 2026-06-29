import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthUser, Role } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  hasRole: (role: Role) => boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('siga_token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const id = Number(localStorage.getItem('siga_userid') || '0');
      const username = localStorage.getItem('siga_username') || '';
      const rolesStr = localStorage.getItem('siga_roles') || '[]';
      const puedeVerAuditoria = localStorage.getItem('siga_puede_ver_auditoria') === 'true';
      try {
        const roles = JSON.parse(rolesStr) as Role[];
        setUser({ id, token, type: 'Bearer', username, roles, puedeVerAuditoria });
      } catch {
        localStorage.removeItem('siga_token');
        localStorage.removeItem('siga_username');
        localStorage.removeItem('siga_roles');
        localStorage.removeItem('siga_puede_ver_auditoria');
        localStorage.removeItem('siga_userid');
      }
    }
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    api.post('/auth/logout').catch((err) => console.error("Error during server logout", err));
    localStorage.removeItem('siga_token');
    localStorage.removeItem('siga_username');
    localStorage.removeItem('siga_roles');
    localStorage.removeItem('siga_puede_ver_auditoria');
    localStorage.removeItem('siga_userid');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login';
  }, []);

  const login = useCallback((authUser: AuthUser) => {
    localStorage.setItem('siga_userid', String(authUser.id || 0));
    localStorage.setItem('siga_token', authUser.token || '');
    localStorage.setItem('siga_username', authUser.username);
    localStorage.setItem('siga_roles', JSON.stringify(authUser.roles));
    localStorage.setItem('siga_puede_ver_auditoria', String(authUser.puedeVerAuditoria || false));
    if (authUser.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${authUser.token}`;
    }
    setUser(authUser);
  }, []);

  useEffect(() => {
    if (!user) return;

    let timer: any;
    const INACTIVITY_TIMEOUT = 10 * 60 * 1000;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        alert("Tu sesión ha expirado por inactividad de 10 minutos.");
        logout();
      }, INACTIVITY_TIMEOUT);
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
    const handleActivity = () => resetTimer();

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user, logout]);

  const hasRole = useCallback(
    (role: Role) => {
      return user?.roles.includes(role) || false;
    },
    [user]
  );

  const isAdmin = hasRole('ADMIN');

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
