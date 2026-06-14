import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarTurno } from '../services/turnoService';

export const useTurnoEspecifico = (tiendaSeleccionada) => {
    const navigate = useNavigate();

    const [turnoActual, setTurnoActual] = useState(1);
    const [linealActual, setLinealActual] = useState(1);
    const [turnoData, setTurnoData] = useState(null);

    useEffect(() => {
        if (tiendaSeleccionada) {
            setTurnoActual(1);
            setLinealActual(1);
            cargarTurnoEspecifico(tiendaSeleccionada.id, 1, 1);
        } else {
            setTurnoData(null);
        }
    }, [tiendaSeleccionada]);

    const cargarTurnoEspecifico = async (idTienda, turno, lineal) => {
        const data = await buscarTurno(idTienda, turno, lineal);
        setTurnoData(data);
    };

    const handleTurnoChange = (e) => {
        const nuevoTurno = Number(e.target.value);
        setTurnoActual(nuevoTurno);
        cargarTurnoEspecifico(tiendaSeleccionada.id, nuevoTurno, linealActual);
    };

    const handleLinealChange = (e) => {
        const nuevoLineal = Number(e.target.value);
        setLinealActual(nuevoLineal);
        cargarTurnoEspecifico(tiendaSeleccionada.id, turnoActual, nuevoLineal);
    };

    const handleCrearEditarTurno = () => {
        if (tiendaSeleccionada) {
            navigate(`/turnos/crearTurno?id=${tiendaSeleccionada.id}&turno=${turnoActual}&lineal=${linealActual}`);
        }
    };

    return {
        turnoActual,
        linealActual,
        turnoData,
        handleTurnoChange,
        handleLinealChange,
        handleCrearEditarTurno
    };
};