import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    buscarCoordinador,
    guardarCoordinador,
    getEntidades,
    getZonas
} from '../services/coordinadorService';
import '../styles/global.css';
import '../styles/form_crear.css';

export default function FormularioCoordinador() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const idCoordinador = searchParams.get('id');
    const esEdicion = idCoordinador !== null;

    const [entidades, setEntidades] = useState([]);
    const [zonas, setZonas] = useState([]);


    const [formData, setFormData] = useState({
        nombre: '',
        usuario: '',
        contrasenya: '',
        telefono: '',
        email: '',
        idEntidad: '',
        idZona: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            const entidadesData = await getEntidades();
            setEntidades(Array.isArray(entidadesData) ? entidadesData : []);

            const zonasData = await getZonas();
            setZonas(Array.isArray(zonasData) ? zonasData : []);

            if (esEdicion) {
                const coordinador = await buscarCoordinador(idCoordinador);

                if (coordinador) {
                    setFormData({
                        nombre: coordinador.nombre || '',
                        usuario: coordinador.usuario || '',
                        contrasenya: '', //no la muestro
                        telefono: coordinador.telefono || '',
                        email: coordinador.email || '',
                        idEntidad: coordinador.idEntidad || coordinador.entidad?.id || '',
                        idZona: coordinador.idZonaAsignada || coordinador.idZona || coordinador.zonaAsignada?.id || coordinador.zona?.id || ''
                    });
                }
            }
        };

        cargarDatos();
    }, [idCoordinador, esEdicion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const datosCoordinador = {
            id: esEdicion ? Number(idCoordinador) : null,
            ...formData,
            contrasenya: formData.contrasenya || null,
            idEntidad: formData.idEntidad ? Number(formData.idEntidad) : null,
            idZona: formData.idZona ? Number(formData.idZona) : null
        };

        const exito = await guardarCoordinador(datosCoordinador);

        if (exito) {
            navigate('/coordinadores');
        } else {
            alert("Error al guardar el coordinador");
        }
    };

    return (
        <main className="main-page">
            <section className="campanya-form-wrapper">
                <div className="campanya-header">
                    <div>
                        <h2>Datos del {esEdicion ? "" : "nuevo"} coordinador</h2>
                        <p>Completa los datos básicos del coordinador.</p>
                    </div>
                </div>

                <div id="formularioCoordinador" className="card campanya-form-card">
                    <form className="campanya-form" onSubmit={handleSubmit}>
                        <section className="form-section">
                            <h3 className="form-section-title">Información principal</h3>

                            <div className="form-group">
                                <label htmlFor="nombre">Coordinador</label>
                                <input
                                    id="nombre"
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nombre del coordinador"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="usuario">Usuario</label>
                                    <input
                                        id="usuario"
                                        type="text"
                                        name="usuario"
                                        value={formData.usuario}
                                        onChange={handleChange}
                                        required
                                        placeholder="usuario"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contrasenya">Contraseña</label>
                                    <input
                                        id="contrasenya"
                                        type="password"
                                        name="contrasenya"
                                        value={formData.contrasenya}
                                        onChange={handleChange}
                                        required={!esEdicion}
                                        placeholder={esEdicion ? "Dejar vacío para no cambiarla" : "Contraseña"}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="form-section">
                            <h3 className="form-section-title">Datos de contacto</h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="telefono">Teléfono</label>
                                    <input
                                        id="telefono"
                                        type="text"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        placeholder="Teléfono"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Correo electrónico</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="form-section">
                            <h3 className="form-section-title">Asignación</h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="idEntidad">Entidad</label>
                                    <select
                                        id="idEntidad"
                                        name="idEntidad"
                                        className="campanya-select"
                                        value={formData.idEntidad}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona una entidad</option>
                                        {entidades.map(entidad => (
                                            <option key={entidad.id} value={entidad.id}>
                                                {entidad.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="idZona">Área asignada</label>
                                    <select
                                        id="idZona"
                                        name="idZona"
                                        className="campanya-select"
                                        value={formData.idZona}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona un área</option>
                                        {zonas.map(zona => (
                                            <option key={zona.id} value={zona.id}>
                                                {zona.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="form-actions">
                            <button type="button" className="btn-outline" onClick={() => navigate('/coordinadores')}>
                                {esEdicion ? "Salir sin guardar" : "Cancelar"}
                            </button>

                            <button type="submit" className="btn-primary" style={{ fontSize: '15.5px' }}>
                                Guardar
                            </button>
                        </section>
                    </form>
                </div>
            </section>
        </main>
    );
}
