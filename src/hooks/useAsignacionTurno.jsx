import { useState, useEffect } from 'react';
import { getAsignacionesTurnos, filtrarAsignaciones, getTipoCampanyas, getCampanyasPorTipo } from '../services/turnoService';

export const useAsignacionTurno = () => {
    const [asignaciones, setAsignaciones] = useState([]);
    const [tipoCampanyas, setTipoCampanyas] = useState([]);
    const [campanyas, setCampanyas] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Filtros activos
    const [tipoCampanyaId, setTipoCampanyaId] = useState(0);
    const [campanyaId, setCampanyaId] = useState(0);

    // Estado para saber si el panel se abre
    const [tiendaSeleccionada, setTiendaSeleccionada] = useState(null);
    const [linealesTotales, setLinealesTotales] = useState(1);

    useEffect(() => {
        const cargarDatos = async () => {
            setCargando(true);
            const data = await getAsignacionesTurnos();
            setAsignaciones(data);

            const tipos = await getTipoCampanyas();
            setTipoCampanyas(tipos);

            const camps = await getCampanyasPorTipo(0);
            setCampanyas(camps);
            setCargando(false);
        };
        cargarDatos();
    }, []);

    const handleTipoChange = async (e) => {
        setCargando(true);
        const nuevoTipoId = Number(e.target.value);
        setTipoCampanyaId(nuevoTipoId);
        setCampanyaId(0);

        const camps = await getCampanyasPorTipo(nuevoTipoId);
        setCampanyas(camps);

        const dataFiltrada = await filtrarAsignaciones(nuevoTipoId, 0);
        setAsignaciones(dataFiltrada);
        setCargando(false);
    };

    const handleCampanyaChange = async (e) => {
        setCargando(true);
        const nuevaCampId = Number(e.target.value);
        setCampanyaId(nuevaCampId);

        const dataFiltrada = await filtrarAsignaciones(tipoCampanyaId, nuevaCampId);
        setAsignaciones(dataFiltrada);
        setCargando(false);
    };

    const handleClickFila = (idTiendaCampanya, numLineales, nombreTienda, domicilioTienda) => {
        if (tiendaSeleccionada?.id === idTiendaCampanya) {
            cerrarPanel();
            return;
        }
        setTiendaSeleccionada({ id: idTiendaCampanya, nombre: nombreTienda, domicilio: domicilioTienda });
        setLinealesTotales(Number(numLineales) || 1);
    };

    const cerrarPanel = () => {
        setTiendaSeleccionada(null);
    };

    return {
        asignaciones, tipoCampanyas, campanyas, cargando,
        tipoCampanyaId, campanyaId, tiendaSeleccionada, linealesTotales,
        handleTipoChange, handleCampanyaChange, handleClickFila, cerrarPanel
    };
};