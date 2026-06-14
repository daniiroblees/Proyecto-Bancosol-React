import { getToken, logout } from './authService';
import { BASE_URL } from '../config';

const API_BASE = BASE_URL;

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

// --------------------------
// SERVICIOS DE TIENDAS 
// --------------------------

export const getTiendas = async () => {
    try {
        const response = await fetch(`${API_BASE}/tienda/`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando tiendas:", error);
        return [];
    }
};

export const buscarTienda = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/tienda/${id}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error buscando tienda con ID ${id}:`, error);
        return null;
    }
};

export const filtrarTiendas = async (cadenaId, localidadId, zonaId) => {
    try {
        const params = new URLSearchParams();
        if (cadenaId) params.append('cadenaId', cadenaId);
        if (localidadId) params.append('localidadId', localidadId);
        if (zonaId) params.append('zonaId', zonaId);

        const response = await fetch(`${API_BASE}/tienda/filtrar?${params.toString()}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error al filtrar tiendas:", error);
        return [];
    }
};

export const guardarTienda = async (dataTienda) => {
    try {
        const response = await fetch(`${API_BASE}/tienda/guardar`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(dataTienda) 
        });

        if (response.ok) {
            return true;
        } else {
            console.error("Error en la respuesta del servidor");
            return false;
        }
    } catch (error) {
        console.error("Error de red al guardar la tienda:", error);
        return false;
    }
};

export const eliminarTienda = async (idTienda) => {
    try {
        const response = await fetch(`${API_BASE}/tienda/eliminar/${idTienda}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        await handleResponse(response);
        return true; 
    } catch (error) {
        console.error("Error eliminando tienda:", error);
        return false;
    }
};

// --------------------------
// SERVICIOS AUXILIARES
// -----------------------------

export const getCadenas = async () => {
    try {
        const response = await fetch(`${API_BASE}/cadenas/`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando cadenas:", error);
        return [];
    }
};

export const getZonas = async () => {
    try {
        const response = await fetch(`${API_BASE}/zonas/`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando zonas:", error);
        return [];
    }
};

export const getLocalidades = async () => {
    try {
        const response = await fetch(`${API_BASE}/localidades/`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando localidades:", error);
        return [];
    }
};

export const getDistritos = async () => {
    try {
        const response = await fetch(`${API_BASE}/distritos/`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando distritos:", error);
        return [];
    }
}

export const getMunicipios = async () => {
    try {
        const response = await fetch(`${API_BASE}/municipios/`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando municipios:", error);
        return [];
    }
}

export const getCoordinadores = async () => {
    try {
        const response = await fetch(`${API_BASE}/usuarios/coordinadores`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando coordinadores:", error);
        return [];
    }
};

export const getCapitanes = async () => {
    try {
        const response = await fetch(`${API_BASE}/usuarios/capitanes`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando capitanes:", error);
        return [];
    }
};

export const getParticipacionesTienda = async (idTienda) => {
    try {
        // <-- AQUI se quita el localhost:8080
        const response = await fetch(`${API_BASE}/tienda/asignarParticipacion/${idTienda}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Error al obtener las participaciones");
            return [];
        }
    } catch (error) {
        console.error("Error de red:", error);
        return [];
    }
};