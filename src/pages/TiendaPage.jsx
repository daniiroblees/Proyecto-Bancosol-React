import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTiendas, getCadenas, getZonas, getLocalidades, eliminarTienda, filtrarTiendas } from '../services/tiendaService';
import '../assets/global.css'
import './tienda.css';

export default function TiendasPage() {
    // estados de datos que vienen de base de datos
    const [tiendas, setTiendas] = useState([]);
    const [cadenas, setCadenas] = useState([]);
    const [zonas, setZonas] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [cargando, setCargando] = useState(true);

    // estados de filtros
    const [cadenaMarcada, setCadenaMarcada] = useState("");
    const [zonaMarcada, setZonaMarcada] = useState("");
    const [localidadMarcada, setLocalidadMarcada] = useState("");

    // carga inicial de datos
    useEffect(() => {
        const cargarDatos = async () => {
            const dataTiendas = await getTiendas();
            setTiendas(dataTiendas);

            setCadenas(await getCadenas());
            setZonas(await getZonas());
            setLocalidades(await getLocalidades());
            
            setCargando(false);
        };
        cargarDatos();
    }, []);

    const handleFiltrar = async (e) => {
        e.preventDefault(); 
        setCargando(true); // mientras busca
        
        const tiendasFiltradas = await filtrarTiendas(cadenaMarcada, localidadMarcada, zonaMarcada);
        
        setTiendas(tiendasFiltradas);
        setCargando(false);
    };

    const handleEliminar = async (id, nombre) => {
        const confirmado = window.confirm(`¿Estás seguro de que deseas eliminar la tienda «${nombre}»?\n\nEsta acción también borrará sus asignaciones en las campañas y no se puede deshacer.`);
        
        if (confirmado) {
            const exito = await eliminarTienda(id);
            
            if (exito) {
                setTiendas(tiendas.filter(tienda => tienda.id !== id));
            } else {
                alert("Hubo un problema al intentar eliminar la tienda del servidor.");
            }
        }
    };

    const obtenerCoordinadores = (tiendasCampanya) => {
        let coordPrimavera = "Sin asignar";
        let coordGR = "Sin asignar";

        if (tiendasCampanya && tiendasCampanya.length > 0) {
            tiendasCampanya.forEach(c => {
                // tipo de campaña (1 = GR, 2 = Primavera)
                if (c.campanya?.tipoCampanya?.id === 2 && c.coordinador) {
                    coordPrimavera = c.coordinador.nombre;
                } else if (c.campanya?.tipoCampanya?.id === 1 && c.coordinador) {
                    coordGR = c.coordinador.nombre;
                }
            });
        }
        return { coordPrimavera, coordGR };
    };

    return (
        <main>
            <div className="page-wrapper">
                <div className="left-column">
                    
                    {/* Cabecera Principal */}
                    <div className="header-principal">
                        <div>
                            <h1>Gestión de Tiendas</h1>
                            <p>Consulta, filtra y crea tiendas</p>
                        </div>

                        <div className="btn-header-principal">
                            <Link to="/tiendas/crearTienda" className="btn-primary" style={{ textDecoration: 'none' }}>
                                <span>+</span>
                                <span> Crear Tienda</span>
                            </Link>
                        </div>
                    </div>

                    {/* Formulario de Filtros */}
                    <div className="header-actions">
                        <form id="filtrado-tiendas" onSubmit={handleFiltrar}>
                            <div className="filtro-group">
                                <label htmlFor="cadena-tienda">Filtrar por Cadena</label>
                                <select 
                                    name="cadena-tienda" 
                                    id="cadena-tienda" 
                                    className="btn-outline" 
                                    style={{ padding: '5px 15px' }}
                                    value={cadenaMarcada}
                                    onChange={(e) => setCadenaMarcada(e.target.value)}
                                >
                                    <option value="">Sin Filtro</option>
                                    {cadenas.map(c => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filtro-group">
                                <label htmlFor="zona-tienda">Filtrar por Zona</label>
                                <select 
                                    name="zona-tienda" 
                                    id="zona-tienda" 
                                    className="btn-outline" 
                                    style={{ padding: '5px 15px' }}
                                    value={zonaMarcada}
                                    onChange={(e) => setZonaMarcada(e.target.value)}
                                >
                                    <option value="">Sin Filtro</option>
                                    {zonas.map(z => (
                                        <option key={z.id} value={z.id}>{z.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filtro-group">
                                <label htmlFor="localidad-tienda">Filtrar por Localidad</label>
                                <select 
                                    name="localidad-tienda" 
                                    id="localidad-tienda" 
                                    className="btn-outline" 
                                    style={{ padding: '5px 15px' }}
                                    value={localidadMarcada}
                                    onChange={(e) => setLocalidadMarcada(e.target.value)}
                                >
                                    <option value="">Sin Filtro</option>
                                    {localidades.map(l => (
                                        <option key={l.id} value={l.id}>{l.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filtro-group boton-container">
                                <span className="label-spacer"></span>
                                <button type="submit" className="btn-outline btn-filtrar">Filtrar</button>
                            </div>
                        </form>
                    </div>

                    {/* Tabla de Tiendas */}
                    <section className="tiendas-container">
                        <div className="table-container card">
                            <table className="modernTable">
                                <thead>
                                    <tr>
                                        <th rowSpan={2}>Tienda</th>
                                        <th rowSpan={2}>Cadena</th>
                                        <th rowSpan={2}>Lineales</th>
                                        <th rowSpan={2}>Domicilio</th>
                                        <th rowSpan={2}>Zona</th>
                                        <th rowSpan={2}>Localidad</th>
                                        
                                        <th colSpan={2} style={{ textAlign: "center" }}>Coordinadores</th>
                                        
                                        <th rowSpan={2}></th>
                                        <th rowSpan={2}></th>
                                        <th rowSpan={2}></th>
                                    </tr>
                                    <tr>
                                        <th>Primavera</th>
                                        <th>Gran Recogida</th>
                                    </tr>
                                </thead>

                                <tbody id="table-body-tiendas">
                                    {cargando ? (
                                        <tr>
                                            <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>Cargando tiendas...</td>
                                        </tr>
                                    ) : tiendas.length === 0 ? (
                                        <tr>
                                            <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>No hay tiendas registradas o que coincidan con los filtros.</td>
                                        </tr>
                                    ) : (
                                        tiendas.map(tienda => {
                                            // Extraemos los coordinadores usando la función auxiliar
                                            const { coordPrimavera, coordGR } = obtenerCoordinadores(tienda.tiendasCampanya);

                                            return (
                                                <tr key={tienda.id} data-id={tienda.id}>
                                                    <td className="font-medium text-blue">{tienda.nombre}</td>
                                                    <td>{tienda.cadena?.nombre}</td>
                                                    <td>{tienda.lineales}</td>
                                                    <td className="small-td">{tienda.domicilio}</td>
                                                    <td>{tienda.localidad?.municipio?.zona?.nombre}</td>
                                                    <td>{tienda.localidad?.nombre}</td>

                                                    <td>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "5px" }}>
                                                            <span className="small-td">{coordPrimavera}</span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "5px" }}>
                                                            <span className="small-td">{coordGR}</span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <Link to={`/tiendas/crearTienda?id=${tienda.id}`} className="interact-tienda-btn editar-btn">
                                                            Editar
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            onClick={() => handleEliminar(tienda.id, tienda.nombre)}
                                                            className="interact-tienda-btn eliminar-btn"
                                                            style={{ border: 'none', cursor: 'pointer' }}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <Link to={`/tiendas/verTienda?id=${tienda.id}`} className="interact-tienda-btn ver-btn">
                                                            Ver
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
                
            </div>
        </main>
    );
}