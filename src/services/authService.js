import { BASE_URL } from '../config';

const API_URL = `${BASE_URL}/auth`;


export const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    window.location.href = '/'; 
};

export const getToken = () => {
    return sessionStorage.getItem('token');
};

export const getUsuarioNombre = () => {
    const userGuardado = sessionStorage.getItem('user');
    if (userGuardado) {
        const userObj = JSON.parse(userGuardado);
        return userObj.nombre;
    }
    return null;
};

export const isAuthenticated = () => {
    return getToken() !== null; 
};