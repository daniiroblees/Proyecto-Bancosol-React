import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { buscarTurno, guardarTurno, getColaboradores } from '../services/turnoService';

export const useCrearTurno = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const idTiendaCampanya = Number(searchParams.get('id'));
    const tipoTurnoId = Number(searchParams.get('turno'));
    const lineal = Number(searchParams.get('lineal'));

    const [colaboradores, setColaboradores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState(null);
    const [contactoPrincipal, setContactoPrincipal] = useState(null);
    const [infoTienda, setInfoTienda] = useState("");
    const [tipoTurnoNombre, setTipoTurnoNombre] = useState("");

    const [formData, setFormData] = useState({
        idTurno: null,
        idTiendaCampanya: idTiendaCampanya,
        idTipoTurno: tipoTurnoId,
        lineal: lineal,
        idColaborador: '',
        numVoluntarios: '',
        horaInicio: '',
        horaFin: '',
        observaciones: ''
    });

    useEffect(() => {
        const cargarData = async () => {
            setCargando(true);

            const colabs = await getColaboradores();
            setColaboradores(colabs);

            const turnoExistente = await buscarTurno(idTiendaCampanya, tipoTurnoId, lineal);
            
            if (turnoExistente && turnoExistente.id) {
                const colabId = turnoExistente.colaborador?.id || '';
                
                setFormData({
                    idTurno: turnoExistente.id,
                    idTiendaCampanya: idTiendaCampanya,
                    idTipoTurno: tipoTurnoId,
                    lineal: lineal,
                    idColaborador: colabId,
                    numVoluntarios: turnoExistente.numVoluntarios || '',
                    horaInicio: turnoExistente.horaInicio || '',
                    horaFin: turnoExistente.horaFin || '',
                    observaciones: turnoExistente.observaciones || ''
                });

                if (colabId) {
                    actualizarPanelColaborador(colabId, colabs);
                }

                if (turnoExistente.tiendaCampanya?.tienda) {
                    setInfoTienda(`${turnoExistente.tiendaCampanya.tienda.nombre} - ${turnoExistente.tiendaCampanya.tienda.domicilio}`);
                }
                if (turnoExistente.tipoTurno) {
                    setTipoTurnoNombre(turnoExistente.tipoTurno.nombre);
                }
            } else {
                setInfoTienda(`Tienda Campaña ID: ${idTiendaCampanya}`);
                const nombresTurno = {1: "Viernes Mañana", 2: "Viernes Tarde", 3: "Sábado Mañana", 4: "Sábado Tarde"};
                setTipoTurnoNombre(nombresTurno[tipoTurnoId] || "Turno Seleccionado");
            }
            
            setCargando(false);
        };
        
        cargarData();
    }, [idTiendaCampanya, tipoTurnoId, lineal]);

    const actualizarPanelColaborador = (idColab, listaColabs) => {
        const colab = listaColabs.find(c => c.id === Number(idColab));
        if (colab) {
            setColaboradorSeleccionado(colab);
            const contacto = colab.contactos?.find(c => c.nombre === colab.contactoPrincipal) || colab.contactos?.[0] || null;
            setContactoPrincipal(contacto);
        } else {
            setColaboradorSeleccionado(null);
            setContactoPrincipal(null);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'idColaborador') {
            actualizarPanelColaborador(value, colaboradores);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.horaInicio || !formData.horaFin) {
            alert("Error: Debes introducir hora de inicio y fin");
            return;
        }
        if (formData.horaInicio > formData.horaFin) {
            alert("Error: La hora de inicio no puede ser posterior a la de fin.");
            return;
        }
        if (formData.numVoluntarios && Number(formData.numVoluntarios) < 1) {
            alert("Error: Debe haber al menos 1 voluntario asignado.");
            return;
        }

        const payload = {
            idTurno: formData.idTurno,
            idTiendaCampanya: formData.idTiendaCampanya,
            idTipoTurno: formData.idTipoTurno,
            lineal: formData.lineal,
            idColaborador: formData.idColaborador ? Number(formData.idColaborador) : null,
            numVoluntarios: formData.numVoluntarios ? Number(formData.numVoluntarios) : null,
            horaInicio: formData.horaInicio,
            horaFin: formData.horaFin,
            observaciones: formData.observaciones
        };

        const exito = await guardarTurno(payload);
        if (exito) {
            navigate('/asignacion_turno');
        } else {
            alert("Error al guardar el turno. Revisa la consola.");
        }
    };

    const handleCancelar = () => {
        navigate('/asignacion_turno');
    };

    return {
        cargando,
        formData,
        colaboradores,
        colaboradorSeleccionado,
        contactoPrincipal,
        infoTienda,
        tipoTurnoNombre,
        lineal,
        handleChange,
        handleSubmit,
        handleCancelar
    };
};