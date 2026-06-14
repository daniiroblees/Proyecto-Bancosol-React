import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuthHook'; 

export default function RolRequerido({ roles }) {
    const { usuario } = useAuth();
    
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (!roles || roles.length === 0) {
        return <Outlet />;
    }

    // Normalizamos el rol del usuario
    const rolNormalizado = usuario.rol?.startsWith('ROLE_') 
        ? usuario.rol 
        : `ROLE_${usuario.rol}`;

    if (!roles.includes(rolNormalizado)) {
        console.log(`Acceso denegado. Rol: ${rolNormalizado}, Requerido: ${roles}`);
        return <Navigate to="/tiendas" replace />; 
    }

    return <Outlet />;
}