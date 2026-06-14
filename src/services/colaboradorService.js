import { getToken, logout } from "./authService";
import { BASE_URL } from "../config";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

const handleResponse = async (response) => {
  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error("Token expirado o inválido");
  }
  if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const getColaboradores = async () => {
  const res = await fetch(`${BASE_URL}/colaboradores/`, {
    headers: getAuthHeaders(),
  });
  return await handleResponse(res);
};

export const buscarColaborador = async (id) => {
  const res = await fetch(`${BASE_URL}/colaboradores/buscar/${id}`, {
    headers: getAuthHeaders(),
  });
  return await handleResponse(res);
};

export const filtrarColaboradores = async (idLocalidad, idCoordinador) => {
  const params = new URLSearchParams();

  if (idLocalidad) params.append("idLocalidad", idLocalidad);
  if (idCoordinador) params.append("idCoordinador", idCoordinador);

  const res = await fetch(
    `${BASE_URL}/colaboradores/filtrar?${params.toString()}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return await handleResponse(res);
};

export const guardarColaborador = async (data) => {
  const res = await fetch(`${BASE_URL}/colaboradores/guardar`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.ok;
};

export const eliminarColaborador = async (id) => {
  const res = await fetch(`${BASE_URL}/colaboradores/eliminar/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return res.ok;
};

// --- CONTACTOS ---
export const buscarContactoPrincipal = async (idColaborador) => {
  const res = await fetch(
    `${BASE_URL}/contacto/contactoPrincipal/${idColaborador}`,
    { headers: getAuthHeaders() },
  );
  return await handleResponse(res);
};

export const buscarContacto = async (id) => {
  const res = await fetch(`${BASE_URL}/contacto/buscar/${id}`, {
    headers: getAuthHeaders(),
  });
  return await handleResponse(res);
};

export const guardarContacto = async (data) => {
  const res = await fetch(`${BASE_URL}/contacto/guardar`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.ok;
};

export const eliminarContacto = async (id) => {
  const res = await fetch(`${BASE_URL}/contacto/eliminar/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return res.ok;
};
