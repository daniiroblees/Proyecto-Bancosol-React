import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { buscarTurno, guardarTurno, getColaboradores } from '../services/turnoService';
import '../styles/global.css';
import '../styles/formularioTurno.css';
import '../styles/colaboradores.css'; // Importamos para usar las clases de la tarjeta del colaborador

export default function CrearTurnoPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Obtenemos los parámetros pasados desde la tabla
    const idTiendaCampanya = Number(searchParams.get('id'));
    const tipoTurnoId = Number(searchParams.get('turno'));
    const lineal = Number(searchParams.get('lineal'));

    const [colaboradores, setColaboradores] = useState([]);
    
    // Estado de carga
    const [cargando, setCargando] = useState(true);
    
    // Estados para la vista lateral del colaborador
    const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState(null);
    const [contactoPrincipal, setContactoPrincipal] = useState(null);
    
    // Estado del formulario
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

    const [infoTienda, setInfoTienda] = useState("");
    const [tipoTurnoNombre, setTipoTurnoNombre] = useState("");

    // Cargar datos
    useEffect(() => {
        const cargarData = async () => {
            setCargando(true); // Iniciamos la carga

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
            
            setCargando(false); // Finalizamos la carga
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

    // Si está cargando, mostramos un spinner centrado
    if (cargando) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '10px' }}>
                <i className="ri-loader-4-line" style={{ fontSize: '3rem', color: 'var(--primary-blue)', animation: 'spin 1s linear infinite' }}></i>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 500 }}>Cargando datos del turno...</p>
                <style>
                    {`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                </style>
            </div>
        );
    }

    return (
        <div className="crear-turno-wrapper">
            
            {/* PANEL IZQUIERDO: FORMULARIO */}
            <div className="form-turno">
                <div className="turno-info">
                    <div className="turno-info-row">
                        <span>{infoTienda}</span>
                        <span>{tipoTurnoNombre}</span>
                    </div>
                    <div className="turno-info-row">
                        <span></span>
                        <span>Lineal {lineal}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="idColaborador">Colaborador:</label>
                        <select id="idColaborador" name="idColaborador" value={formData.idColaborador} onChange={handleChange}>
                            <option value="">Seleccione un colaborador...</option>
                            {colaboradores.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="numVoluntarios">Número de voluntarios:</label>
                        <input type="number" id="numVoluntarios" name="numVoluntarios" value={formData.numVoluntarios} onChange={handleChange} />
                    </div>

                    <div className="form-group-row">
                        <div className="form-group">
                            <label htmlFor="horaInicio">Hora Inicio:</label>
                            <input type="time" id="horaInicio" name="horaInicio" value={formData.horaInicio} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="horaFin">Hora Fin:</label>
                            <input type="time" id="horaFin" name="horaFin" value={formData.horaFin} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="observaciones">Observaciones:</label>
                        <textarea id="observaciones" name="observaciones" rows="4" value={formData.observaciones} onChange={handleChange}></textarea>
                    </div>

                    <div className="form-group-row">
                        <button type="button" className="btn-outline" onClick={() => navigate('/asignacion_turno')} style={{width: '100%', marginTop: '10px'}}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-submit">Guardar Turno</button>
                    </div>
                </form>
            </div>

            {/* PANEL DERECHO: INFO DEL COLABORADOR */}
            {colaboradorSeleccionado && (
                <div className="card side-panel">
                    <div id="colaborador-localization">
                        <p id="lbl-colaborador">{colaboradorSeleccionado.nombre}</p>
                        <p id="lbl-domicilio">{colaboradorSeleccionado.domicilio}</p>
                        <p className="text-muted">
                            {colaboradorSeleccionado.codigo}, {colaboradorSeleccionado.localidadSede?.nombre}
                        </p>
                        <p className="text-muted">
                            Colabora en: {colaboradorSeleccionado.colaboraEn?.nombre}
                        </p>
                    </div>

                    <div id="colaborador-schedule">
                        <div id="contactosCard">
                            <div className="info-card">
                                <div className="info-header">
                                    <div className="info-main">
                                        <p className="lbl-capitan">
                                            {contactoPrincipal?.nombre || '--'}
                                        </p>
                                    </div>
                                    <div className="info-side">
                                        <div>TELÉFONO</div>
                                        <div>{contactoPrincipal?.telefono || '--'}</div>
                                    </div>
                                </div>
                                <div className="info-body">
                                    <p><strong>Email: </strong>{contactoPrincipal?.email || '--'}</p>
                                </div>
                            </div>
                        </div>

                        <div id="colaborador-observaciones">
                            <p className="section-title">Observaciones</p>
                            <div className="info-card">
                                <div className="info-body">
                                    <p>{colaboradorSeleccionado.observaciones || "Sin observaciones"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}