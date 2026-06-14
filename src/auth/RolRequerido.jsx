import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuthHook'; 

export default function RolRequerido({ rolesPermitidos }) {
    const { usuario } = useAuth();
    
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
        console.log(`Acceso denegado. Rol actual: ${usuario.rol}, Requerido: ${rolesPermitidos}`);

        return <Navigate to="/tiendas" replace />; 
    }

    // Si tiene permiso, renderiza las páginas hijas
    return <Outlet />;
}