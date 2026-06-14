import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import RutaProtegida from './RutaProtegida'; 
import LoginPage from '../pages/AuthPage';
import TiendaPage from '../pages/TiendaPage';
import CrearTienda from '../pages/CrearTiendaPage';
import CoordinadoresPage from '../pages/CoordinadoresPage';
import AsignacionTurnoPage from '../pages/AsignacionTurnoPage';
import CrearTurnoPage from '../pages/CrearTurnoPage';

export default function AppLayout() {
  const location = useLocation();
  const esPantallaLogin = location.pathname === '/login';

  return (
    <>
      {!esPantallaLogin && <Navbar />}

      <div className="page-content" style={{ padding: esPantallaLogin ? '0px' : '20px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/tiendas" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/tiendas" element={<RutaProtegida><TiendaPage /></RutaProtegida>} />
          <Route path="/tiendas/crearTienda" element={<RutaProtegida><CrearTienda /></RutaProtegida>} />
          <Route path="/tiendas/verTienda" element={<RutaProtegida><CrearTienda /></RutaProtegida>} />
          <Route path="/coordinadores" element={<RutaProtegida><CoordinadoresPage /></RutaProtegida>} />
		  
		  <Route path="/asignacion_turno" element={<RutaProtegida><AsignacionTurnoPage /></RutaProtegida>} />
          <Route path="/turnos/crearTurno" element={<RutaProtegida><CrearTurnoPage /></RutaProtegida>} />

        </Routes>
      </div>
    </>
  );
}
