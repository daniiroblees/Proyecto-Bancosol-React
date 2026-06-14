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

// --------------------------
// SERVICIOS DE TIENDAS 
// --------------------------

export const getTiendas = async () => {
    try {
        const response = await fetch(`${BASE_URL}/tienda/`, {
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
        const response = await fetch(`${BASE_URL}/tienda/${id}`, {
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

        const response = await fetch(`${BASE_URL}/tienda/filtrar?${params.toString()}`, {
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
        const response = await fetch(`${BASE_URL}/tienda/guardar`, {
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
        const response = await fetch(`${BASE_URL}/tienda/eliminar/${idTienda}`, {
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
        const response = await fetch(`${BASE_URL}/cadenas/`, {
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

export const getLocalidades = async () => {
    try {
        const response = await fetch(`${BASE_URL}/localidades/`, {
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
        const response = await fetch(`${BASE_URL}/distritos/`, {
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
        const response = await fetch(`${BASE_URL}/municipios/`, {
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

export const getCapitanes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/usuarios/capitanes`, {
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
        const response = await fetch(`${BASE_URL}/tienda/asignarParticipacion/${idTienda}`, {
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

export const guardarParticipacion = async (idTienda, selecciones) => {
    try {
        const params = new URLSearchParams();
        params.append('idTienda', idTienda);
        
        Object.keys(selecciones).forEach(tipoId => {
            params.append(`tipo_campanya_${tipoId}`, selecciones[tipoId]);
        });

        const response = await fetch(`${BASE_URL}/tienda/guardarParticipacion`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`, 
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
            body: params
        });

        if (response.ok) {
            return true;
        } else {
             console.error("Error del servidor al guardar participaciones");
             return false;
        }
    } catch (error) {
        console.error("Error al guardar participaciones:", error);
        return false;
    }
};


export const getTiposCampanyaParaTienda = async (idTienda) => {
    try {
        const response = await fetch(`${BASE_URL}/tipoCampanyas/participantes/${idTienda}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando tipos de campaña:", error);
        return [];
    }
};

export const getCampanyasParaTienda = async (idTienda) => {
    try {
        const response = await fetch(`${BASE_URL}/campanyas/participantes/${idTienda}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error cargando campañas:", error);
        return [];
    }
};