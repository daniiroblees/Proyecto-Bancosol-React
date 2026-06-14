import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from "../services/authService";
import '../styles/auth.css'; 

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState(null);
    
    // hook de react router pa cambiar de página sin recargar
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que el navegador recargue la página
        setError(null);     // Limpiamos errores previos

        const exito = await login(username, password);

        if (exito) {
            navigate('/tiendas');
        } else {
            setError('Usuario o contraseña incorrectos. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="auth-page">
            <div className="login-container">
                <div className="login-card">

                    <h2 className="login-title">Iniciar sesión</h2>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">

                        <div className="form-group">
                            <label htmlFor="username">Usuario</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>

                        <button type="submit" className="btn-login">
                            Entrar
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}