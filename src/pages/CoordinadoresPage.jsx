import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCoordinadores, eliminarCoordinadores } from '../services/coordinadorService';

import '../styles/global.css';
import '../components/coordinadores.css';

export default function CoordinadoresPage() {
    const [coordinadores, setCoordinadores] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [modoEliminar, setModoEliminar] = useState(false);
    const [coordinadoresSeleccionados, setCoordinadoresSeleccionados] = useState([]);

    //Cargar los datos
    useEffect(() => {
        const cargarCoordinadores = async () => {
            setCargando(true);
        
            const data = await getCoordinadores();
            setCoordinadores(data);
            setCargando(false);
        };

        cargarCoordinadores();
    }, []);

    //Modificar los seleccionados
    const toggleSeleccionCoordinador = (id) => {
        setCoordinadoresSeleccionados((seleccionadosActuales) => {
            if (seleccionadosActuales.includes(id)) {
                return seleccionadosActuales.filter((coordinadorId) => coordinadorId !== id);
            }
        
            return [...seleccionadosActuales, id];
        });
    };

    const activarModoEliminar = () => {
        setModoEliminar(true);
        setCoordinadoresSeleccionados([]);
    };

    const cancelarModoEliminar = () => {
        setModoEliminar(false);
        setCoordinadoresSeleccionados([]);
    };

    const handleEliminarCoordinadores = async () => {
        //primero ver que no hay algunos seleccionados
        if (coordinadoresSeleccionados.length === 0) {
            alert('Selecciona al menos un coordinador para eliminar.');
            return;
        }
        
        //eliminar con el service
        const exito = await eliminarCoordinadores(coordinadoresSeleccionados);

        if (exito){
            setCoordinadores((coordinadoresActuales) =>
                coordinadoresActuales.filter(
                        (coordinador) => !coordinadoresSeleccionados.includes(coordinador.id)
                )
            );

        } else {
            alert('Algo ha fallado al eliminar');

        }
        
        setModoEliminar(false); //dejamos de borrar
        setCoordinadoresSeleccionados([]); //reiniciar seleccionados
    };

    return (
        <main className="main-page">
            <div>
                <section className="campanya-list-wrapper coordinadores-list-wrapper">
                    <div className="campanya-header">
                        <div>
                            <h1>Gestión de Coordinadores</h1>
                            <p>Consulta los coordinadores registrados y añade nuevos coordinadores.</p>
                        </div>

                        <div className="campanya-list-actions">
                            {!modoEliminar ? (
                                <>
                                    <button
                                        type="button"
                                        className="btn-outline btn-outline-danger"
                                        style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                        onClick={activarModoEliminar}
                                    >
                                        Eliminar coordinadores
                                    </button>

                                    <Link to="/coordinadores/crearCoordinador" className="btn-primary">
                                        <span className="cadena-create-icon">+</span>
                                        <span> Nuevo Coordinador</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="btn-outline btn-outline-danger"
                                        style={{ color: '#ef4444', borderColor: '#ef4444', fontSize: '17px' }}
                                        onClick={handleEliminarCoordinadores}
                                    >
                                        Confirmar selección y borrar
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-outline"
                                        onClick={cancelarModoEliminar}
                                    >
                                        Cancelar selección
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="card campanya-table-card coordinadores-table-card">
                        <table className="modernTable coordinadores-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Coordinador</th>
                                    <th>Entidad</th>
                                    <th>Área asignada</th>
                                    <th>Teléfono</th>
                                    <th>Correo electrónico</th>
                                    <th>Tiendas</th>
                                    <th>Usuario</th>
                                </tr>
                            </thead>

                            <tbody>
                                {cargando ? (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                                            Cargando coordinadores...
                                        </td>
                                    </tr>
                                ) : coordinadores.length > 0 ? (
                                    coordinadores.map((coordinador) => {
                                        const seleccionado = coordinadoresSeleccionados.includes(coordinador.id);

                                        return (
                                            <tr
                                                key={coordinador.id}
                                                className={seleccionado ? 'campanya-row-selected' : ''}
                                            >
                                                <td>
                                                    <div className="campanya-row-actions">
                                                        {modoEliminar && (
                                                            <input
                                                                className="campanya-delete-checkbox"
                                                                type="checkbox"
                                                                name="coordinadoresElim"
                                                                value={coordinador.id}
                                                                checked={seleccionado}
                                                                onChange={() => toggleSeleccionCoordinador(coordinador.id)}
                                                            />
                                                        )}

                                                        <Link
                                                            className="edit-campanya-btn"
                                                            to={`/coordinadores/editarCoordinador?id=${coordinador.id}`}
                                                        >
                                                            <span className="edit-campanya-icon">✎</span>
                                                            <span>Editar</span>
                                                        </Link>
                                                    </div>
                                                </td>

                                                <td>{coordinador.nombre ?? ''}</td>
                                                <td>{coordinador.entidad ?? 'Sin entidad'}</td>
                                                <td>{coordinador.zonaAsignada ?? 'Sin área'}</td>
                                                <td>{coordinador.telefono ?? ''}</td>
                                                <td>{coordinador.email ?? ''}</td>
                                                <td>{coordinador.tiendasCoordinadas?.length ?? 0}</td>
                                                <td>{coordinador.usuario ?? ''}</td>
                                                
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                                            No hay coordinadores registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
}
