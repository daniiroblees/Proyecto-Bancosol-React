import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProveedorAuten } from '../auth/proveedorAuten';
import RutaProtegida from './RutaProtegida'; 
import Navbar from './Navbar'; 

import LoginPage from '../pages/AuthPage';
import TiendaPage from '../pages/TiendaPage';
import CrearTienda from '../pages/CrearTiendaPage';
import CoordinadoresPage from '../pages/CoordinadoresPage';
import AsignacionTurnoPage from '../pages/AsignacionTurnoPage';
import CrearTurnoPage from '../pages/CrearTurnoPage';
import AsignarParticipacion from '../pages/AsignarParticipacionPage';

export default function AppLayout() {
  return (
    <ProveedorAuten>
        <Routes>
          
          {/* Rutas Públicas */}
          <Route path="/" element={<Navigate to="/tiendas" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas Protegidas y con Cabecera */}
          <Route element={<RutaProtegida />}>
            <Route element={<Navbar />}>
              
              <Route path="/tiendas" element={<TiendaPage />} />
              <Route path="/tiendas/crearTienda" element={<CrearTienda />} />
              <Route path="/tiendas/verTienda" element={<CrearTienda />} />
              <Route path="/tiendas/asignarParticipacion" element={<AsignarParticipacion />} />

              <Route path="/coordinadores" element={<CoordinadoresPage />} />
          
              <Route path="/asignacion_turno" element={<AsignacionTurnoPage />} />
              <Route path="/turnos/crearTurno" element={<CrearTurnoPage />} />

            </Route>
          </Route>

        </Routes>
    </ProveedorAuten>
  );
}