import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { buscarContacto, guardarContacto, buscarColaborador } from '../services/colaboradorService';
import '../styles/global.css';
import '../styles/form_crear.css';

export default function FormularioContactoPage() {
    const { idColaborador, idContacto } = useParams();
    const navigate = useNavigate();
    const editando = !!idContacto;

    const [colaboradorNombre, setColaboradorNombre] = useState("");
    const [formData, setFormData] = useState({
        nombre: '', email: '', telefono: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            const colab = await buscarColaborador(idColaborador);
            if (colab) setColaboradorNombre(colab.nombre);

            if (editando) {
                const contacto = await buscarContacto(idContacto);
                if (contacto) {
                    setFormData({
                        nombre: contacto.nombre || '',
                        email: contacto.email || '',
                        telefono: contacto.telefono || ''
                    });
                }
            }
        };
        cargarDatos();
    }, [idColaborador, idContacto, editando]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            id: editando ? Number(idContacto) : null,
            idColaborador: Number(idColaborador),
            ...formData
        };

        const exito = await guardarContacto(payload);
        if (exito) navigate(`/colaboradores/editar/${idColaborador}`);
        else alert("Error al guardar el contacto");
    };

    return (
        <main className="main-page">
            <section className="campanya-form-wrapper">
                <div className="campanya-header">
                    <div>
                        <h2>Datos del {editando ? "contacto" : "nuevo contacto"}</h2>
                        <p>Rellena la información del contacto para <strong>{colaboradorNombre}</strong>.</p>
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
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Teléfono</label>
                                    <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
                                </div>
                            </div>
                        </section>

                        <section className="form-actions">
                            <Link to={`/colaboradores/editar/${idColaborador}`} className="btn-danger-outline">Cancelar</Link>
                            <button type="submit" className="btn-primary">Guardar</button>
                        </section>
                    </form>
                </div>
            </section>
        </main>
    );
}