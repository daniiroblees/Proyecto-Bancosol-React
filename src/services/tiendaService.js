import { getToken, logout } from './authService';

const API_BASE = 'http://localhost:8080/api';

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

// GET /api/tienda/ -> Listar todas
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

// GET /api/tienda/{id}
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

// GET /api/tienda/filtrar?cadenaId=X&localidadId=Y&zonaId=Z
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

// POST /api/tienda/guardar -
export const guardarTienda = async (tiendaData) => {
    try {
        const response = await fetch(`${API_BASE}/tienda/guardar`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(tiendaData) // Mandamos el objeto que casa con tu record TiendaRequest
        });
        await handleResponse(response);
        return true;
    } catch (error) {
        console.error("Error al guardar la tienda:", error);
        return false;
    }
};

// DELETE /api/tienda/eliminar/{id}
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
// filtros
// -----------------------------

// GET /api/cadenas/
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

// GET /api/zonas/
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

// GET /api/localidades/
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

// GET /api/usuarios/coordinadores
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

// GET /api/usuarios/capitanes
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
