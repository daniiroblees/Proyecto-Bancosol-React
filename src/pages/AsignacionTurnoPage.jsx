import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAsignacionesTurnos, filtrarAsignaciones, buscarTurno, getTipoCampanyas, getCampanyasPorTipo } from '../services/turnoService';
import '../styles/global.css';
import '../styles/asignacion_turno.css';

export default function AsignacionTurnoPage() {
    const navigate = useNavigate();

    // Estados para las tablas y combos
    const [asignaciones, setAsignaciones] = useState([]);
    const [tipoCampanyas, setTipoCampanyas] = useState([]);
    const [campanyas, setCampanyas] = useState([]);
    
    // Estado de carga
    const [cargando, setCargando] = useState(true);

    // Filtros activos
    const [tipoCampanyaId, setTipoCampanyaId] = useState(0);
    const [campanyaId, setCampanyaId] = useState(0);

    // Estado del panel lateral
    const [tiendaSeleccionada, setTiendaSeleccionada] = useState(null); 
    const [linealesTotales, setLinealesTotales] = useState(1);
    
    // Parámetros del turno a visualizar
    const [turnoActual, setTurnoActual] = useState(1);
    const [linealActual, setLinealActual] = useState(1);
    const [turnoData, setTurnoData] = useState(null);

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            setCargando(true);
            
            // Cargar turnos iniciales
            const data = await getAsignacionesTurnos();
            setAsignaciones(data);

            // Cargar tipos de campañas
            const tipos = await getTipoCampanyas();
            setTipoCampanyas(tipos);

            // Cargar todas las campañas al principio (el backend permite pasar 0 para traerlas todas)
            const camps = await getCampanyasPorTipo(0);
            setCampanyas(camps);
            
            setCargando(false);
        };
        cargarDatos();
    }, []);

    // Manejar cambio en filtro "Tipo de Campaña"
    const handleTipoChange = async (e) => {
        setCargando(true);
        const nuevoTipoId = Number(e.target.value);
        setTipoCampanyaId(nuevoTipoId);
        
        // Al cambiar de tipo, reseteamos la campaña seleccionada a "Sin filtro"
        setCampanyaId(0);

        // Actualizamos el desplegable de campañas con las de ese tipo (o todas si es 0)
        const camps = await getCampanyasPorTipo(nuevoTipoId);
        setCampanyas(camps);

        // Filtramos la tabla de turnos pasando el nuevo tipo y campaña 0
        const dataFiltrada = await filtrarAsignaciones(nuevoTipoId, 0);
        setAsignaciones(dataFiltrada);
        
        setCargando(false);
    };

    // Manejar cambio en filtro "Campaña"
    const handleCampanyaChange = async (e) => {
        setCargando(true);
        const nuevaCampId = Number(e.target.value);
        setCampanyaId(nuevaCampId);

        // Filtramos la tabla de turnos manteniendo el tipo de campaña actual
        const dataFiltrada = await filtrarAsignaciones(tipoCampanyaId, nuevaCampId);
        setAsignaciones(dataFiltrada);
        
        setCargando(false);
    };

    // Click en una fila de la tabla
    const handleClickFila = async (idTiendaCampanya, numLineales, nombreTienda, domicilioTienda) => {
        // Si pincha en la misma fila seleccionada, la cerramos
        if (tiendaSeleccionada?.id === idTiendaCampanya) {
            cerrarPanel();
            return;
        }

        // Abrimos el panel
        setTiendaSeleccionada({ id: idTiendaCampanya, nombre: nombreTienda, domicilio: domicilioTienda });
        setLinealesTotales(Number(numLineales) || 1);
        setTurnoActual(1);
        setLinealActual(1);

        // Fetch información del turno 1, lineal 1
        cargarTurnoEspecifico(idTiendaCampanya, 1, 1);
    };

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

    const cerrarPanel = () => {
        setTiendaSeleccionada(null);
        setTurnoData(null);
    };

    const handleCrearEditarTurno = () => {
        if (tiendaSeleccionada) {
            navigate(`/turnos/crearTurno?id=${tiendaSeleccionada.id}&turno=${turnoActual}&lineal=${linealActual}`);
        }
    };

    // Formatear saltos de linea de los turnos en la tabla
    const formatearTurno = (texto) => {
        if (!texto) return "";
        const partes = texto.split(/(?=\bL\d+)/g); 
        return partes.map((parte, i) => <div key={i}>{parte}</div>);
    };

    const rolUsuario = localStorage.getItem('usuario_rol');
    const puedeEditar = rolUsuario === 'ADMIN' || rolUsuario === 'COORD';

    return (
        <>
            <div className="filtros-container">
                <div className="filtro-group">
                    <label htmlFor="selectTipoCampanya">Tipo de Campaña</label>
                    <select 
                        id="selectTipoCampanya" 
                        value={tipoCampanyaId} 
                        onChange={handleTipoChange}
                    >
                        <option value={0}>Sin Filtro</option>
                        {tipoCampanyas.map(t => (
                            <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="filtro-group">
                    <label htmlFor="selectCampanya">Campaña</label>
                    <select 
                        id="selectCampanya" 
                        value={campanyaId} 
                        onChange={handleCampanyaChange}
                    >
                        <option value={0}>Sin Filtro</option>
                        {campanyas.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>

            <main className="page-wrapper">
                <div className="left-column">
                    <div className="table-container card">
                        <table className="modernTable">
                            <thead>
                                <tr>
                                    <th>Tienda</th>
                                    <th>Domicilio</th>
                                    <th>Localidad</th>
                                    <th>Capitán</th>
                                    <th>Viernes M.</th>
                                    <th>Viernes T.</th>
                                    <th>Sábado M.</th>
                                    <th>Sábado T.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cargando ? (
                                    <tr>
                                        <td colSpan="8" style={{textAlign: "center", padding: "20px"}}>
                                            Cargando turnos...
                                        </td>
                                    </tr>
                                ) : asignaciones.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{textAlign: "center", padding: "20px"}}>
                                            No hay datos disponibles.
                                        </td>
                                    </tr>
                                ) : (
                                    asignaciones.map(a => (
                                        <tr 
                                            key={a.idTiendaCampanya} 
                                            className={tiendaSeleccionada?.id === a.idTiendaCampanya ? "selected" : ""}
                                            onClick={() => handleClickFila(a.idTiendaCampanya, a.lineales, a.tienda, a.domicilio)}
                                        >
                                            <td className="font-medium text-blue">{a.tienda}</td>
                                            <td>{a.domicilio}</td>
                                            <td>{a.localidad}</td>
                                            <td>{a.capitan || "Sin asignar"}</td>
                                            <td className="small-td">{formatearTurno(a.viernesManana)}</td>
                                            <td className="small-td">{formatearTurno(a.viernesTarde)}</td>
                                            <td className="small-td">{formatearTurno(a.sabadoManana)}</td>
                                            <td className="small-td">{formatearTurno(a.sabadoTarde)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={`right-column ${tiendaSeleccionada ? 'open' : ''}`}>
                    <div id="info-container" className="card side-panel">
                        {tiendaSeleccionada && (
                            <div id="volunteer-container">
                                <div id="volunteer-localization">
                                    <div><p id="lbl-tienda">{tiendaSeleccionada.nombre}</p></div>
                                    <div><p id="lbl-domicilio">{tiendaSeleccionada.domicilio}</p></div>
                                </div>
                                
                                <div id="volunteer-schedule">
                                    <label>
                                        <input type="radio" name="schedule" value={1} checked={turnoActual === 1} onChange={handleTurnoChange} /> Viernes Mañana
                                    </label>
                                    <label>
                                        <input type="radio" name="schedule" value={2} checked={turnoActual === 2} onChange={handleTurnoChange} /> Viernes Tarde
                                    </label>
                                    <label>
                                        <input type="radio" name="schedule" value={3} checked={turnoActual === 3} onChange={handleTurnoChange} /> Sabado Mañana
                                    </label>
                                    <label>
                                        <input type="radio" name="schedule" value={4} checked={turnoActual === 4} onChange={handleTurnoChange} /> Sabado Tarde
                                    </label>
                                </div>

                                {linealesTotales > 1 && (
                                    <div id="volunteer-lineal">
                                        {[...Array(linealesTotales)].map((_, i) => (
                                            <label key={i+1}>
                                                <input type="radio" name="lineal" value={i+1} checked={linealActual === i+1} onChange={handleLinealChange} /> L{i+1}
                                            </label>
                                        ))}
                                    </div>
                                )}

                                <div id="volunteer-info">
                                    {turnoData?.id ? (
                                        <>
                                            <div id="volunteer-name">
                                                <div>
                                                    <p id="lbl-capitan">{turnoData.colaborador?.nombre || "Sin asignar"}</p>
                                                </div>
                                                <div className="volunteer-date">
                                                    <div>COMIENZO</div>
                                                    <div>{turnoData.horaInicio}</div>
                                                </div>
                                                <div className="volunteer-date">
                                                    <div>FIN</div>
                                                    <div>{turnoData.horaFin}</div>
                                                </div>
                                            </div>
                                            <div id="volunteer-observations">
                                                <p>{turnoData.observaciones}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div id="volunteer-name">
                                                <div>
                                                    <p id="lbl-capitan" style={{color: 'gray', fontStyle: 'italic'}}>Sin asignar</p>
                                                </div>
                                                <div className="volunteer-date">
                                                    <div>COMIENZO</div>
                                                    <div>--:--</div>
                                                </div>
                                                <div className="volunteer-date">
                                                    <div>FIN</div>
                                                    <div>--:--</div>
                                                </div>
                                            </div>
                                            <div id="volunteer-observations">
                                                <p style={{color: 'gray', fontStyle: 'italic'}}>No hay información para este turno.</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div id="button-container">
                                    <button 
                                        id="create-button" 
                                        disabled={!puedeEditar} 
                                        onClick={handleCrearEditarTurno}
                                    >
                                        {turnoData?.id ? "Editar" : "Crear"}
                                    </button>
                                    <button id="cancel-button" onClick={cerrarPanel}>Cancelar</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}