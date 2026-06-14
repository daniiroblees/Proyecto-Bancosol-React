import { getToken, logout } from './authService';
import { BASE_URL } from '../config';

const getAuthHeaders = () => {
    return {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
    };
};

const handleResponse = async (response) => {
    if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error("Token expirado o inválido");
    }
    if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);

    const text = await response.text();
    return text ? JSON.parse(text) : null;
};




//Listar todos
export const getCoordinadores = async () => {
    try {
        const response = await fetch(`${BASE_URL}/usuarios/coordinadores`, { 
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando coordinadores:", error);
        return [];
    }
};

//OBTENER COORDINADOR DEL ID
export const buscarCoordinador = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/usuarios/coordinadores/${id}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error buscando coordinador con ID ${id}:`, error);
        return null;
    }
};

// ENVIAR COORDINADOR AL BACKEND PARA GUARDAR
export const guardarCoordinador = async (coordinadorData) => {
    try {
        const response = await fetch(`${BASE_URL}/usuarios/coordinadores/guardar`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(coordinadorData)
        });
        await handleResponse(response);
        return true;
    } catch (error) {
        console.error("Error al guardar el coordinador:", error);
        return false;
    }
};

// SELECCIOANR QUE COORDINADOR ELIMINAR DE LA BASE DE DATOS
export const eliminarCoordinadores = async (idsCoordinadores) => {
    try {
        const response = await fetch(`${BASE_URL}/usuarios/coordinadores`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            body: JSON.stringify(idsCoordinadores)
        });
        await handleResponse(response);
        return true;
    } catch (error) {
        console.error("Error eliminando coordinadores:", error);
        return false;
    }
};

// COORDINADOR FORMULARIO ==================

export const getEntidades = async () => {
    try {
        const response = await fetch(`${BASE_URL}/entidades/`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando entidades:", error);
        return [];
    }
};

export const getZonas = async () => {
    try {
        const response = await fetch(`${BASE_URL}/zonas/`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando zonas:", error);
        return [];
    }
};
