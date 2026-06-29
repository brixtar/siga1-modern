import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Duenios from './pages/Duenios';
import Animales from './pages/Animales';
import Consultas from './pages/Consultas';
import ConsultaDetail from './pages/ConsultaDetail';
import Examenes from './pages/Examenes';
import Derivaciones from './pages/Derivaciones';
import Retornos from './pages/Retornos';
import Usuarios from './pages/Usuarios';
import Reportes from './pages/Reportes';
import Perfil from './pages/Perfil';
import Farmacia from './pages/Farmacia';
import Auditorias from './pages/Auditorias';
import Turnos from './pages/Turnos';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/duenios" element={<ProtectedRoute><Duenios /></ProtectedRoute>} />
        <Route path="/animales" element={<ProtectedRoute><Animales /></ProtectedRoute>} />
        <Route path="/consultas" element={<ProtectedRoute><Consultas /></ProtectedRoute>} />
        <Route path="/consultas/:id" element={<ProtectedRoute><ConsultaDetail /></ProtectedRoute>} />
        <Route path="/examenes" element={<ProtectedRoute><Examenes /></ProtectedRoute>} />
        <Route path="/derivaciones" element={<ProtectedRoute><Derivaciones /></ProtectedRoute>} />
        <Route path="/retornos" element={<ProtectedRoute><Retornos /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute requiredRole="ADMIN"><Usuarios /></ProtectedRoute>} />
        <Route path="/auditorias" element={<ProtectedRoute><Auditorias /></ProtectedRoute>} />
        <Route path="/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
        <Route path="/farmacia" element={<ProtectedRoute><Farmacia /></ProtectedRoute>} />
        <Route path="/turnos" element={<ProtectedRoute><Turnos /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}

export default App;
