import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '/src/assets/LOGO_BANCOSOL.png';

import { logout } from '../services/authService';

export default function Navbar() {
    const location = useLocation();

    const nombreUsuario = localStorage.getItem('usuario_nombre') || 'Usuario';
    const rolUsuario = localStorage.getItem('usuario_rol');
    
    // Sacamos la primera letra y la ponemos en mayúscula para el avatar
    const inicial = nombreUsuario.charAt(0).toUpperCase();
    
    // Comprobamos si es administrador
    const esAdmin = rolUsuario === 'ROLE_ADMIN';

    //  marcar la pestaña activa
    const checkActive = (path) => {
        return location.pathname.includes(path) ? "nav-item active" : "nav-item";
    };

    //  añadir la clase disabled si no es admin
    const checkActiveWithRole = (path, requiereAdmin) => {
        let className = checkActive(path);
        if (requiereAdmin && !esAdmin) {
            className += " disabled";
        }
        return className;
    };

    const handleLogout = (e) => {
        e.preventDefault(); // Evitamos que el navegador recargue o salte arriba
        logout(); // Ejecutamos el borrado de JWT y la redirección
    };


    return (
        <div className="main-header">
            <div className="top-navbar">
                <div className="logo-container">
                    <img src={logo} alt="Logo Bancosol" className="logo-img" />
                </div>
            </div>
            
            <nav className="bottom-navbar">
                <ul className="nav-menu">
                    <li className={checkActive('/campanyas')}>
                        <Link to="/campanyas" className="nav-link">
                            <i className="ri-megaphone-line"></i>
                            <span>Gestión de Campañas</span>
                        </Link>
                    </li>
                    
                    <li className={checkActive('/tiendas')}>
                        <Link to="/tiendas" className="nav-link">
                            <i className="ri-store-2-line"></i>
                            <span>Tiendas</span>
                        </Link>
                    </li>
                    
                    <li className={checkActive('/colaboradores')}>
                        <Link to="/colaboradores" className="nav-link">
                            <i className="ri-user-heart-line"></i>
                            <span>Colaboradores</span>
                        </Link>
                    </li>
                    
                    <li className={checkActive('/coordinadores')}>
                        <Link to="/coordinadores" className="nav-link">
                            <i className="ri-team-line"></i>
                            <span>Coordinadores</span>
                        </Link>
                    </li>
                    
                    <li className={checkActive('/asignacion_turno')}>
                        <Link to="/asignacion_turno" className="nav-link">
                            <i className="ri-clipboard-line"></i>
                            <span>Asignación de turno</span>
                        </Link>
                    </li>
                </ul>

                <div className="logout-section">
                    <a href="#" className="logout-link" onClick={handleLogout}>
                        <i className="ri-logout-box-r-line"></i>
                        <span>Cerrar Sesión</span>
                    </a>
                </div>
            </nav>
        </div>
    );
}