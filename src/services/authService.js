import { BASE_URL } from '../config';

const API_URL = `${BASE_URL}/auth`;

export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }) 
        });

        if (response.ok) {
            const data = await response.json();
            
            console.log("Respuesta del servidor:", data);
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario_nombre', data.usuario.nombre);
                localStorage.setItem('usuario_rol', data.usuario.rol);
                
                return true; 
            } else {
                return false; 
            }
        }
        return false; 
    } catch (error) {
        console.error("Error en petición de login:", error);
        return false;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_nombre');
    localStorage.removeItem('usuario_rol');
    
    window.location.href = '/'; 
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const getUsuarioNombre = () => {
    return localStorage.getItem('usuario_nombre');
};

export const isAuthenticated = () => {
    return getToken() !== null; 
};