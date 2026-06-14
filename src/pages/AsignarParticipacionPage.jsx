import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
    buscarTienda, 
    getParticipacionesTienda, 
    guardarParticipacion,
    getTiposCampanyaParaTienda, 
    getCampanyasParaTienda 
} from '../services/tiendaService';
import '../styles/global.css';
import '../styles/campanyas.css';
import '../styles/asignacion_participacion.css';

export default function AsignarParticipacion() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const idTienda = searchParams.get('id');

    const [tienda, setTienda] = useState(null);
    const [tipos, setTipos] = useState([]);
    const [campanyas, setCampanyas] = useState([]);
    
    const [selecciones, setSelecciones] = useState({});

    useEffect(() => {
        if (!idTienda) return;

        const cargarDatos = async () => {
            const [dataTienda, dataParticipaciones, dataTipos, dataCampanyas] = await Promise.all([
                buscarTienda(idTienda),
                getParticipacionesTienda(idTienda),
                getTiposCampanyaParaTienda(idTienda),
                getCampanyasParaTienda(idTienda)
            ]);

            setTienda(dataTienda);
            setTipos(dataTipos);
            setCampanyas(dataCampanyas);

            const estadoInicial = {};
            dataTipos.forEach(tipo => {
                // si la tienda ya participa en alguna campaña de este tipo
                const participacionActual = dataParticipaciones.find(
                    tc => tc.campanya?.tipoCampanya?.id === tipo.id
                );
                
                estadoInicial[tipo.id] = participacionActual ? participacionActual.campanya.id : 0;
            });

            setSelecciones(estadoInicial);
        };

        cargarDatos();
    }, [idTienda]);

    const handleRadioChange = (tipoId, campanyaId) => {
        setSelecciones(prev => ({
            ...prev,
            [tipoId]: Number(campanyaId)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const exito = await guardarParticipacion(idTienda, selecciones);
        if (exito) {
            navigate('/tiendas');
        } else {
            alert("Hubo un error al guardar las participaciones");
        }
    };

    if (!tienda) return <p style={{padding: '20px'}}>Cargando datos de la tienda...</p>;

    return (
        <main className="main-page">
            <section className="campanya-form-wrapper participacion-wrapper">
                <div className="card campanya-form-card">
                    
                    {/* Cabecera */}
                    <div className="info-box tienda-info-box">
                        <div className="tienda-info-header">
                            <div className="tienda-info-icon">
                                <i className="ri-store-2-fill"></i>
                            </div>
                            <div>
                                <h3 className="tienda-info-title">{tienda.nombre}</h3>
                            </div>
                        </div>

                        <div className="tienda-info-details">
                            <div className="tienda-info-item">
                                <i className="ri-map-pin-2-line tienda-info-item-icon"></i>
                                <span>{tienda.domicilio || "Domicilio no especificado"}</span>
                            </div>
                            <div className="tienda-info-item">
                                <i className="ri-map-2-line tienda-info-item-icon"></i>
                                <span>C.P. {tienda.cp || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Formulario de asignación */}
                    <form onSubmit={handleSubmit}>
                        <table className="modernTable participacion-table">
                            <thead>
                                <tr>
                                    {tipos.map(tipo => (
                                        <th key={tipo.id}>{tipo.nombre}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {tipos.map(tipo => (
                                        <td key={tipo.id}>
                                            <div className="radio-list">
                                                {/* Opción "No Participa" */}
                                                <label className={`option-card ${selecciones[tipo.id] === 0 ? "selected" : ""}`}>
                                                    <input 
                                                        type="radio" 
                                                        name={`tipo_campanya_${tipo.id}`} 
                                                        value="0"
                                                        checked={selecciones[tipo.id] === 0}
                                                        onChange={(e) => handleRadioChange(tipo.id, e.target.value)}
                                                    />
                                                    <span className="default-option-text">No participa</span>
                                                </label>

                                                {campanyas
                                                    .filter(c => c.tipoCampanya?.id === tipo.id)
                                                    .map(c => {
                                                        const isChecked = selecciones[tipo.id] === c.id;
                                                        return (
                                                            <label key={c.id} className={`option-card ${isChecked ? "selected" : ""}`}>
                                                                <input 
                                                                    type="radio" 
                                                                    name={`tipo_campanya_${tipo.id}`} 
                                                                    value={c.id}
                                                                    checked={isChecked}
                                                                    onChange={(e) => handleRadioChange(tipo.id, e.target.value)}
                                                                />
                                                                <span>{c.nombre}</span>
                                                            </label>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>

                        <section className="form-actions form-actions-no-border">
                            <button type="button" className="btn-outline" onClick={() => navigate('/tiendas')}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn-primary btn-save-participacion">
                                Guardar Asignaciones
                            </button>
                        </section>
                    </form>

                </div>
            </section>
        </main>
    );
}