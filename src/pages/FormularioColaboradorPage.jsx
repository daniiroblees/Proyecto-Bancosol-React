import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { buscarColaborador, guardarColaborador, eliminarContacto } from '../services/colaboradorService';
import { getLocalidades } from '../services/tiendaService';
import { getCoordinadores } from '../services/coordinadorService';
import '../styles/global.css';
import '../styles/form_crear.css';

export default function FormularioColaboradorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const editando = !!id;

    const [localidades, setLocalidades] = useState([]);
    const [coordinadores, setCoordinadores] = useState([]);
    const [contactos, setContactos] = useState([]);

    const [formData, setFormData] = useState({
        nombre: '', codigo: '', temporal: false, domicilio: '', cp: '',
        idLocalidadSede: '', idLocalidadColabora: '', idCoordinador: '',
        observaciones: '', contactoPrincipal: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            const [locs, coords] = await Promise.all([getLocalidades(), getCoordinadores()]);
            setLocalidades(locs);
            setCoordinadores(coords);

            if (editando) {
                const colab = await buscarColaborador(id);
                if (colab) {
                    setFormData({
                        nombre: colab.nombre || '',
                        codigo: colab.codigo || '',
                        temporal: colab.temporal || false,
                        domicilio: colab.domicilio || '',
                        cp: colab.cp || '',
                        idLocalidadSede: colab.localidadSede?.id || '',
                        idLocalidadColabora: colab.colaboraEn?.id || '',
                        idCoordinador: colab.coordinador?.id || '',
                        observaciones: colab.observaciones || '',
                        contactoPrincipal: colab.contactoPrincipal || ''
                    });
                    setContactos(colab.contactos || []);
                }
            }
        };
        cargarDatos();
    }, [id, editando]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name=== 'temporal' ? (value === 'true') : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editando && contactos.length === 0) {
            alert("Error: El colaborador debe tener al menos un contacto asignado.");
            return;
        }
        if (editando && !formData.contactoPrincipal) {
            alert("Error: Debes marcar un contacto como principal.");
            return;
        }

        const payload = {
            id: editando ? Number(id) : null,
            ...formData,
            idLocalidadSede: Number(formData.idLocalidadSede),
            idLocalidadColabora: Number(formData.idLocalidadColabora),
            idCoordinador: Number(formData.idCoordinador)
        };

        const exito = await guardarColaborador(payload);
        if (exito) navigate('/colaboradores');
        else alert("Error al guardar el colaborador");
    };

    const handleEliminarContacto = async (idContacto) => {
        if(window.confirm("¿Eliminar este contacto?")) {
            await eliminarContacto(idContacto);
            setContactos(contactos.filter(c => c.id !== idContacto));
        }
    };

    return (
        <main className="main-page">
            <section className="campanya-form-wrapper">
                <div className="campanya-header">
                    <div>
                        <h2>Datos del {editando ? "colaborador" : "nuevo colaborador"}</h2>
                        <p>Rellena la información del colaborador.</p>
                    </div>
                </div>

                <div className="card campanya-form-card">
                    <form onSubmit={handleSubmit} className="campanya-form">
                        <section className="form-section">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Código</label>
                                    <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>¿Es temporal?</label>
                                    <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                                        <label><input type="radio" name="temporal" value="true" checked={formData.temporal === true} onChange={handleChange} style={{outline: 'none', boxShadow: 'none'}} /> Sí</label>
                                        <label><input type="radio" name="temporal" value="false" checked={formData.temporal === false} onChange={handleChange} style={{outline: 'none', boxShadow: 'none'}} /> No</label>
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Domicilio</label>
                                    <input type="text" name="domicilio" value={formData.domicilio} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Código Postal</label>
                                    <input type="text" name="cp" value={formData.cp} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Localidad de la sede:</label>
                                    <select name="idLocalidadSede" value={formData.idLocalidadSede} onChange={handleChange} required>
                                        <option value="">Seleccione...</option>
                                        {localidades.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Colabora en:</label>
                                    <select name="idLocalidadColabora" value={formData.idLocalidadColabora} onChange={handleChange} required>
                                        <option value="">Seleccione...</option>
                                        {localidades.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Coordinador:</label>
                                    <select name="idCoordinador" value={formData.idCoordinador} onChange={handleChange} required>
                                        <option value="">Seleccione...</option>
                                        {coordinadores.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                    </select>
                                </div>
                            </div>

                            {editando && (
                                <div className="form-group">
                                    <label>Contactos</label>
                                    <table className="modernTable">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th style={{textAlign: 'center'}}>Principal</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contactos.map(c => (
                                                <tr key={c.id}>
                                                    <td>{c.nombre}</td>
                                                    <td style={{textAlign: 'center'}}>
                                                        <input type="radio" name="contactoPrincipal" value={c.nombre} checked={formData.contactoPrincipal === c.nombre} onChange={handleChange} style={{cursor: 'pointer', outline: 'none', boxShadow: 'none'}}/>
                                                    </td>
                                                    <td>
                                                        <Link to={`/colaboradores/${id}/contacto/editar/${c.id}`} className="btn-outline" style={{marginRight: '5px', padding: '5px 10px', textDecoration: 'none'}}>Editar</Link>
                                                        <button type="button" onClick={() => handleEliminarContacto(c.id)} className="btn-danger-outline" style={{padding: '5px 10px'}}>Eliminar</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="3" style={{textAlign: 'center'}}>
                                                    <Link to={`/colaboradores/${id}/contacto/crear`} style={{textDecoration: 'none', color: 'var(--text-muted)'}}>+ Añadir contacto</Link>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Observaciones</label>
                                <input type="text" name="observaciones" value={formData.observaciones} onChange={handleChange} />
                            </div>
                        </section>

                        <section className="form-actions">
                            <Link to="/colaboradores" className="btn-danger-outline">Cancelar</Link>
                            <button type="submit" className="btn-primary">Guardar</button>
                        </section>
                    </form>
                </div>
            </section>
        </main>
    );
}