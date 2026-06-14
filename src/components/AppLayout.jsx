import { Routes, Route, Navigate } from 'react-router-dom';
import { ProveedorAuten } from '../auth/proveedorAuten';
import RutaProtegida from './RutaProtegida'; 
import Navbar from './Navbar'; 
import RolRequerido from '../auth/RolRequerido';

import LoginPage from '../pages/AuthPage';
import TiendaPage from '../pages/TiendaPage';
import CrearTienda from '../pages/CrearTiendaPage';
import CoordinadoresPage from '../pages/CoordinadoresPage';
import FormularioCoordinador from '../pages/FormularioCoordinador';
import AsignacionTurnoPage from '../pages/AsignacionTurnoPage';
import CrearTurnoPage from '../pages/CrearTurnoPage';
import AsignarParticipacion from '../pages/AsignarParticipacionPage';

import ColaboradoresPage from '../pages/ColaboradoresPage';
import FormularioColaboradorPage from '../pages/FormularioColaboradorPage';
import FormularioContactoPage from '../pages/FormularioContactoPage';

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

              {/* ACCESO GENERAL, sin rol minimo */}
              
              <Route path="/tiendas" element={<TiendaPage />} />
              <Route path="/tiendas/crearTienda" element={<CrearTienda />} />
              <Route path="/tiendas/verTienda" element={<CrearTienda />} />
              <Route path="/tiendas/asignarParticipacion" element={<AsignarParticipacion />} />

              <Route path="/coordinadores" element={<CoordinadoresPage />} />
              <Route path="/coordinadores/crearCoordinador" element={<FormularioCoordinador />} />
              <Route path="/coordinadores/editarCoordinador" element={<FormularioCoordinador />} />
			        <Route path="/coordinadores/crearCoordinador" element={<FormularioCoordinador />} />
          	  <Route path="/coordinadores/editarCoordinador" element={<FormularioCoordinador />} />
          
              <Route path="/asignacion_turno" element={<AsignacionTurnoPage />} />

              <Route path="/colaboradores" element={<RutaProtegida><ColaboradoresPage /></RutaProtegida>} />
              <Route path="/colaboradores/crear" element={<RutaProtegida><FormularioColaboradorPage /></RutaProtegida>} />
              <Route path="/colaboradores/editar/:id" element={<RutaProtegida><FormularioColaboradorPage /></RutaProtegida>} />
              <Route path="/colaboradores/:idColaborador/contacto/crear" element={<RutaProtegida><FormularioContactoPage /></RutaProtegida>} />
              <Route path="/colaboradores/:idColaborador/contacto/editar/:idContacto" element={<RutaProtegida><FormularioContactoPage /></RutaProtegida>} />

              {/*  ACCESO ROLE_ADMIN o ROLE_COORD */}
              <Route element={<RolRequerido roles={['ROLE_ADMIN', 'ROLE_COORD']} />}>
                <Route path="/turnos/crearTurno" element={<CrearTurnoPage />} />
              </Route>

            </Route>
          </Route>

        </Routes>
    </ProveedorAuten>
  );
}
