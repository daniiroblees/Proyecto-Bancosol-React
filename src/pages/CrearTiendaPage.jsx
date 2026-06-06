import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { buscarTienda, guardarTienda, getCadenas, getZonas, getLocalidades, getCoordinadores, getCapitanes, getMunicipios, getDistritos } from '../services/tiendaService';
import '../assets/global.css';
import '../assets/form_crear.css';

export default function CrearTienda() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    
    // Detectamos si estamos editando o viendo
    const idTienda = searchParams.get('id');
    const esEdicion = idTienda !== null;
    const esViendo = location.pathname.includes('verTienda'); // router

    //Estados para los desplegables 
    const [listas, setListas] = useState({
        cadenas: [], zonas: [], municipios: [], localidades: [],
        distritos: [], coordinadores: [], capitanes: []
    });

    //Estado para el formulario
    const [formData, setFormData] = useState({
        nombre: '', lineales: '', domicilio: '', codigoPostal: '',
        cadenaId: '', zonaId: '', municipioId: '', localidadId: '', distritoId: '',
        coordinadorPrimaveraId: '', capitanPrimaveraId: '',
        coordinadorGRId: '', capitanGRId: ''
    });

    //Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            const [cads, zons, muns, locs, dists, coords, caps] = await Promise.all([
                getCadenas(), getZonas(), getMunicipios(), getLocalidades(),
                getDistritos(), getCoordinadores(), getCapitanes()
            ]);

            setListas({
                cadenas: cads, zonas: zons, municipios: muns, localidades: locs,
                distritos: dists, coordinadores: coords, capitanes: caps
            });

            // Si hay ID, cargar la tienda para editar/ver
            if (esEdicion) {
                const tienda = await buscarTienda(idTienda);
                if (tienda) {
                    // Extraer campañas
                    let coordPrim = '', capPrim = '', coordGR = '', capGR = '';
                    if (tienda.tiendasCampanya) {
                        tienda.tiendasCampanya.forEach(tc => {
                            if (tc.campanya?.tipoCampanya?.id === 2) {
                                if (tc.coordinador) coordPrim = tc.coordinador.id;
                                if (tc.capitan) capPrim = tc.capitan.id;
                            } else if (tc.campanya?.tipoCampanya?.id === 1) {
                                if (tc.coordinador) coordGR = tc.coordinador.id;
                                if (tc.capitan) capGR = tc.capitan.id;
                            }
                        });
                    }

                    setFormData({
                        nombre: tienda.nombre || '',
                        lineales: tienda.lineales || '',
                        domicilio: tienda.domicilio || '',
                        codigoPostal: tienda.cp || '',
                        cadenaId: tienda.cadena?.id || '',
                        zonaId: tienda.localidad?.municipio?.zona?.id || '',
                        municipioId: tienda.localidad?.municipio?.id || '',
                        localidadId: tienda.localidad?.id || '',
                        distritoId: tienda.distrito?.id || '',
                        coordinadorPrimaveraId: coordPrim,
                        capitanPrimaveraId: capPrim,
                        coordinadorGRId: coordGR,
                        capitanGRId: capGR
                    });
                }
            }
        };
        cargarDatos();
    }, [idTienda, esEdicion]);

    //Lógica de cascada y visibilidad
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Si cambia la zona, reseteamos municipio y localidad
        if (name === 'zonaId') {
            setFormData(prev => ({ ...prev, [name]: value, municipioId: '', localidadId: '' }));
        } 
        // Si cambia el municipio, reseteamos la localidad
        else if (name === 'municipioId') {
            setFormData(prev => ({ ...prev, [name]: value, localidadId: '' }));
        } 
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Arrays filtrados 
    const municipiosFiltrados = listas.municipios.filter(m => m.zona?.id === Number(formData.zonaId));
    const localidadesFiltradas = listas.localidades.filter(l => l.municipio?.id === Number(formData.municipioId));
    
    // Comprobar si la zona elegida es Málaga Capital para mostrar el Distrito
    const zonaSeleccionada = listas.zonas.find(z => z.id === Number(formData.zonaId));
    const mostrarDistritos = zonaSeleccionada && zonaSeleccionada.nombre.toLowerCase() === 'málaga capital';

    //Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Limpiamos los campos vacíos a null 
        const payload = {
            id: esEdicion ? idTienda : null,
            ...formData,
            // Convertimos strings vacíos a null para campos opcionales numéricos
            lineales: formData.lineales ? Number(formData.lineales) : 0,
            distritoId: formData.distritoId ? Number(formData.distritoId) : null,
            coordinadorPrimaveraId: formData.coordinadorPrimaveraId ? Number(formData.coordinadorPrimaveraId) : null,
            capitanPrimaveraId: formData.capitanPrimaveraId ? Number(formData.capitanPrimaveraId) : null,
            coordinadorGRId: formData.coordinadorGRId ? Number(formData.coordinadorGRId) : null,
            capitanGRId: formData.capitanGRId ? Number(formData.capitanGRId) : null,
        };

        const exito = await guardarTienda(payload);
        if (exito) {
            navigate('/tiendas');
        } else {
            alert("Error al guardar la tienda");
        }
    };

    return (
        <main className="main-page">
            <section className="campanya-form-wrapper">
                <div className="campanya-header">
                    <div>
                        <h2>Datos de la {esViendo ? "tienda (Modo Lectura)" : (esEdicion ? "tienda" : "nueva tienda")}</h2>
                        <p>Información básica de la tienda.</p>
                    </div>
                </div>

                <div className="card campanya-form-card">
                    <form className="campanya-form" onSubmit={handleSubmit}>
                        
                        <section className="form-section">
                            <h3 className="form-section-title">Información Principal</h3>
                            
                            <div className="form-row">
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label htmlFor="nombre">Nombre de la Tienda</label>
                                    <input id="nombre" type="text" name="nombre" value={formData.nombre} onChange={handleChange} required disabled={esViendo} placeholder="Ej. Mercadona Centro" />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label htmlFor="lineales">Lineales</label>
                                    <input id="lineales" type="number" name="lineales" value={formData.lineales} onChange={handleChange} disabled={esViendo} placeholder="Ej. 5" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label htmlFor="domicilio">Domicilio / Dirección</label>
                                    <input id="domicilio" type="text" name="domicilio" value={formData.domicilio} onChange={handleChange} required disabled={esViendo} placeholder="Calle, número..." />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label htmlFor="codigoPostal">Código Postal</label>
                                    <input id="codigoPostal" type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} required disabled={esViendo} placeholder="Ej. 29010" />
                                </div>
                                
                                {mostrarDistritos && (
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label htmlFor="distritoId">Distrito</label>
                                        <select id="distritoId" name="distritoId" className="campanya-select" value={formData.distritoId} onChange={handleChange} disabled={esViendo}>
                                            <option value="">Selecciona un distrito</option>
                                            {listas.distritos.map(d => (
                                                <option key={d.id} value={d.id}>{d.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="form-section">
                            <h3 className="form-section-title">Clasificación y Ubicación</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="cadenaId">Cadena</label>
                                    <select id="cadenaId" name="cadenaId" className="campanya-select" value={formData.cadenaId} onChange={handleChange} required disabled={esViendo}>
                                        <option value="">Selecciona una cadena</option>
                                        {listas.cadenas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="zonaId">Zona</label>
                                    <select id="zonaId" name="zonaId" className="campanya-select" value={formData.zonaId} onChange={handleChange} required disabled={esViendo}>
                                        <option value="">Selecciona una zona</option>
                                        {listas.zonas.map(z => <option key={z.id} value={z.id}>{z.nombre}</option>)}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="municipioId">Municipio</label>
                                    <select id="municipioId" name="municipioId" className="campanya-select" value={formData.municipioId} onChange={handleChange} required disabled={esViendo || !formData.zonaId}>
                                        <option value="">{formData.zonaId ? "Selecciona un municipio" : "Primero selecciona zona"}</option>
                                        {municipiosFiltrados.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="localidadId">Localidad</label>
                                    <select id="localidadId" name="localidadId" className="campanya-select" value={formData.localidadId} onChange={handleChange} required disabled={esViendo || !formData.municipioId}>
                                        <option value="">{formData.municipioId ? "Selecciona una localidad" : "Primero selecciona municipio"}</option>
                                        {localidadesFiltradas.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="form-section">
                            <h3 className="form-section-title">Coordinadores y Capitanes</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="coordinadorPrimaveraId">Coordinador Primavera</label>
                                    <select id="coordinadorPrimaveraId" name="coordinadorPrimaveraId" className="campanya-select" value={formData.coordinadorPrimaveraId} onChange={handleChange} disabled={esViendo}>
                                        <option value="">Sin asignar</option>
                                        {listas.coordinadores.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="coordinadorGRId">Coordinador Gran Recogida</label>
                                    <select id="coordinadorGRId" name="coordinadorGRId" className="campanya-select" value={formData.coordinadorGRId} onChange={handleChange} disabled={esViendo}>
                                        <option value="">Sin asignar</option>
                                        {listas.coordinadores.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="capitanPrimaveraId">Capitán Primavera</label>
                                    <select id="capitanPrimaveraId" name="capitanPrimaveraId" className="campanya-select" value={formData.capitanPrimaveraId} onChange={handleChange} disabled={esViendo}>
                                        <option value="">Sin asignar</option>
                                        {listas.capitanes.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="capitanGRId">Capitán Gran Recogida</label>
                                    <select id="capitanGRId" name="capitanGRId" className="campanya-select" value={formData.capitanGRId} onChange={handleChange} disabled={esViendo}>
                                        <option value="">Sin asignar</option>
                                        {listas.capitanes.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="form-actions">
                            <button type="button" className="btn-outline" onClick={() => navigate('/tiendas')}>
                                {esViendo ? "Volver al listado" : (esEdicion ? "Salir sin guardar" : "Cancelar")}
                            </button>

                            {!esViendo && (
                                <button type="submit" className="btn-primary" style={{ fontSize: '15.5px' }}>
                                    Guardar Tienda
                                </button>
                            )}
                        </section>
                    </form>
                </div>
            </section>
        </main>
    );
}