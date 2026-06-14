import { Link, useLocation, Outlet } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '/src/assets/LOGO_BANCOSOL.png';
import { useContext } from 'react';
import { ContextoAuten } from '../auth/ContextoAuten';

import { logout } from '../services/authService';

export default function Navbar() {
    const { usuario } = useContext(ContextoAuten);
    const location = useLocation();

    const nombreUsuario = usuario?.nombre || 'Usuario';
    const rolUsuario = usuario?.rol;

    // Sacamos la primera letra y la ponemos en mayúscula para el avatar
    const inicial = nombreUsuario.charAt(0).toUpperCase();
    
    // Comprobamos si es administrador o coordinador
    const esAdmin = rolUsuario === 'ADMIN';
    const esCoord = rolUsuario === 'COORD';

    //  marcar la pestaña activa
    const checkActive = (path) => {
        return location.pathname.includes(path) ? "nav-item active" : "nav-item";
    };

    const getNavClass = (path, soloAdmin = false, adminOCoord = false) => {
        let className = checkActive(path);

        if (soloAdmin && !esAdmin) {
            className += " disabled";
        } else if (adminOCoord && !esAdmin && !esCoord) {
            className += " disabled";
        }

        return className;
    };

    const handleLogout = (e) => {
        e.preventDefault(); // Evitamos que el navegador recargue o salte arriba
        logout(); // Ejecutamos el borrado de JWT y la redirección
    };


    return (
            <>
            <div className="main-header">
                <div className="top-navbar">
                    <div className="logo-container">
                        <img src={logo} alt="Logo Bancosol" className="logo-img" />
                    </div>
                </div>
                
                <nav className="bottom-navbar">
                    <ul className="nav-menu">
                        <li className={getNavClass('/campanyas', true, false)}>
                            <Link to="#" className="nav-link">
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
                        
                        <li className={getNavClass('/colaboradores', false, true)}>
                            <Link to="/colaboradores" className="nav-link">
                                <i className="ri-user-heart-line"></i>
                                <span>Colaboradores</span>
                            </Link>
                        </li>
                        
                        <li className={getNavClass('/coordinadores', true, false)}>
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
            <div className="page-content" style={{ padding: '20px' }}>
                    <Outlet /> 
            </div>
        </>
    );
}