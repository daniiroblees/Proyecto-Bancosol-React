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

export const getAsignacionesTurnos = async () => {
    try {
        const response = await fetch(`${BASE_URL}/asignacionTurnos/`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando asignaciones:", error);
        return [];
    }
};

export const filtrarAsignaciones = async (tipoCampanyaId, campanyaId) => {
    try {
        const response = await fetch(`${BASE_URL}/asignacionTurnos/filtrar/${tipoCampanyaId}/${campanyaId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error filtrando asignaciones:", error);
        return [];
    }
};

export const buscarTurno = async (idTienda, turno, linealActual) => {
    try {
        const response = await fetch(`${BASE_URL}/asignacionTurnos/buscarTurno/${idTienda}/${turno}/${linealActual}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error buscando el turno:", error);
        return null;
    }
};

export const guardarTurno = async (dataTurno) => {
    try {
        const response = await fetch(`${BASE_URL}/asignacionTurnos/guardar`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(dataTurno)
        });
        return response.ok;
    } catch (error) {
        console.error("Error guardando el turno:", error);
        return false;
    }
};

export const getTipoCampanyas = async () => {
    try {
        const response = await fetch(`${BASE_URL}/tipoCampanyas/`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando tipos de campañas:", error);
        return [];
    }
};

export const getCampanyasPorTipo = async (idTipo) => {
    try {
        const response = await fetch(`${BASE_URL}/campanyas/filtrarPorTipo/${idTipo}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando campañas por tipo:", error);
        return [];
    }
};

export const getColaboradores = async () => {
    try {
        const response = await fetch(`${BASE_URL}/colaboradores/`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando colaboradores:", error);
        return [];
    }
};