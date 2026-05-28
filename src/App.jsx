import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NexumLogin from './components/NexumLogin';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Buscador from './pages/Buscador';
import MeusProcessos from './pages/MeusProcessos';
import Processos from './pages/Processos';
import Analises from './pages/Analises';
import Integracoes from './pages/Integracoes';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<NexumLogin />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/buscador"
          element={
            <ProtectedRoute>
              <Layout>
                <Buscador />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/meus-processos"
          element={
            <ProtectedRoute>
              <Layout>
                <MeusProcessos />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/processos"
          element={
            <ProtectedRoute>
              <Layout>
                <Processos />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analises"
          element={
            <ProtectedRoute>
              <Layout>
                <Analises />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/integracoes"
          element={
            <ProtectedRoute>
              <Layout>
                <Integracoes />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;