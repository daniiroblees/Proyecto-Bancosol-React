import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuthHook'; 

export default function RolRequerido({ rolesPermitidos }) {
    const { usuario } = useAuth();
    
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    const rolNormalizado = usuario.rol?.startsWith('ROLE_') 
        ? usuario.rol 
        : `ROLE_${usuario.rol}`;


    if (!rolesPermitidos.includes(rolNormalizado)) {
        console.log(`Acceso denegado. Rol actual: ${rolNormalizado}, Requerido: ${rolesPermitidos}`);

        return <Navigate to="/tiendas" replace />; 
    }

    // Si tiene permiso, renderiza las páginas hijas
    return <Outlet />;
}