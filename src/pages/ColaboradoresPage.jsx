import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getColaboradores, filtrarColaboradores, buscarColaborador, buscarContactoPrincipal, eliminarColaborador } from '../services/colaboradorService';
import { getLocalidades } from '../services/tiendaService';
import { getCoordinadores } from '../services/coordinadorService';
import PanelInfoColaborador from '../components/AsignacionTurno/PanelInfoColaborador';
import '../styles/global.css';
import '../styles/colaboradores.css';

export default function ColaboradoresPage() {
    const navigate = useNavigate();
    const [colaboradores, setColaboradores] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [coordinadores, setCoordinadores] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Filtros
    const [filtroLocalidad, setFiltroLocalidad] = useState("");
    const [filtroCoordinador, setFiltroCoordinador] = useState("");

    // Panel lateral
    const [colabSeleccionado, setColabSeleccionado] = useState(null);
    const [contactoPrincipal, setContactoPrincipal] = useState(null);

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            setCargando(true);
            const [colabs, locs, coords] = await Promise.all([
                getColaboradores(), getLocalidades(), getCoordinadores()
            ]);
            setColaboradores(colabs);
            setLocalidades(locs);
            setCoordinadores(coords);
            setCargando(false);
        };

        cargarDatosIniciales();
    }, []);

    const handleFiltrar = async () => {
        setCargando(true);
        if (!filtroLocalidad && !filtroCoordinador) {
            const data = await getColaboradores();
            setColaboradores(data);
        } else {
            const data = await filtrarColaboradores(filtroLocalidad, filtroCoordinador);
            setColaboradores(data);
        }
        setCargando(false);
        cerrarPanel();
    };

    const handleRowClick = async (id) => {
        if (colabSeleccionado?.id === id) {
            cerrarPanel();
            return;
        }
        const colab = await buscarColaborador(id);
        const contacto = await buscarContactoPrincipal(id);
        setColabSeleccionado(colab);
        setContactoPrincipal(contacto);
    };

    const cerrarPanel = () => {
        setColabSeleccionado(null);
        setContactoPrincipal(null);
    };

    const handleEliminar = async () => {
        if (window.confirm(`¿Eliminar al colaborador ${colabSeleccionado.nombre}?`)) {
            const exito = await eliminarColaborador(colabSeleccionado.id);
            if (exito) {
                setColaboradores(colaboradores.filter(c => c.id !== colabSeleccionado.id));
                cerrarPanel();
            } else {
                alert("Error al eliminar el colaborador.");
            }
        }
    };

    return (
        <main>
            <div className="page-body">
                <div className="page-header">
                    <div className="left-header">
                        <h1>Colaboradores</h1>
                        <div className="text-muted">Consulta los colaboradores y edita sus datos.</div>
                    </div>
                    <div className="right-header">
                        <Link to="/colaboradores/crear" className="btn-primary" id="anadir-colaborador">
                            + Añadir colaborador
                        </Link>
                    </div>
                </div>

                <div className="filtros-container">
                    <div className="filtro-group">
                        <label htmlFor="colaboraEn">Colabora en:</label>
                        <select value={filtroLocalidad} onChange={(e) => setFiltroLocalidad(e.target.value)} className="btn-outline" style={{ padding: '5px 15px' }}>
                            <option value="">Sin Filtro</option>
                            {localidades.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                        </select>
                    </div>
                    <div className="filtro-group">
                        <label htmlFor="coordinador">Filtrar por Coordinador</label>
                        <select value={filtroCoordinador} onChange={(e) => setFiltroCoordinador(e.target.value)} className="btn-outline" style={{ padding: '5px 15px' }}>
                            <option value="">Sin Filtro</option>
                            {coordinadores.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                    </div>
                    <div className="filtro-group" style={{ justifyContent: 'flex-end' }}>
                        <button onClick={handleFiltrar} className="btn-primary">Filtrar</button>
                    </div>
                </div>

                <div className="page-wrapper">
                    <div className="left-column">
                        <div className="table-container card">
                            <table className="modernTable">
                                <thead>
                                    <tr>
                                        <th>Colaborador</th>
                                        <th>Domicilio</th>
                                        <th>Localidad</th>
                                        <th>Colabora en</th>
                                        <th>Coordinador</th>
                                        <th>Contacto Principal</th>
                                        <th>Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cargando ? <tr><td colSpan="7" style={{textAlign:'center'}}>Cargando...</td></tr> : 
                                     colaboradores.map(c => (
                                        <tr key={c.id} className={colabSeleccionado?.id === c.id ? "selected" : ""} onClick={() => handleRowClick(c.id)}>
                                            <td className="font-medium text-blue">{c.nombre}</td>
                                            <td>{c.domicilio}</td>
                                            <td>{c.localidadSede?.nombre}</td>
                                            <td>{c.colaboraEn?.nombre}</td>
                                            <td>{c.coordinador?.nombre}</td>
                                            <td>{c.contactoPrincipal}</td>
                                            <td>{c.observaciones}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={`right-column ${colabSeleccionado ? 'open' : ''}`}>
                        {colabSeleccionado && (
                            <div className="side-panel-unified">
                                <PanelInfoColaborador colaboradorSeleccionado={colabSeleccionado} contactoPrincipal={contactoPrincipal} />
                                <div className="buttons-wrapper">
                                    <div className="buttons-section">
                                        <div className="flex-buttons">
                                            <button className="btn-primary" onClick={() => navigate(`/colaboradores/editar/${colabSeleccionado.id}`)}>Modificar</button>
                                            <button className="btn-outline eliminar-b" onClick={handleEliminar}>Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}