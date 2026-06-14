import { useCrearTurno } from '../hooks/useCrearTurno';
import TurnoForm from '../components/AsignacionTurno/FormularioTurno';
import ColaboradorInfoPanel from '../components/AsignacionTurno/PanelInfoColaborador';

import '../styles/global.css';
import '../styles/formularioTurno.css';
import '../styles/colaboradores.css';

export default function CrearTurnoPage() {
    const {
        cargando,
        formData,
        colaboradores,
        colaboradorSeleccionado,
        contactoPrincipal,
        infoTienda,
        tipoTurnoNombre,
        lineal,
        handleChange,
        handleSubmit,
        handleCancelar
    } = useCrearTurno();

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
            
            <TurnoForm 
                formData={formData}
                colaboradores={colaboradores}
                infoTienda={infoTienda}
                tipoTurnoNombre={tipoTurnoNombre}
                lineal={lineal}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleCancelar={handleCancelar}
            />

            <ColaboradorInfoPanel 
                colaboradorSeleccionado={colaboradorSeleccionado}
                contactoPrincipal={contactoPrincipal}
            />

        </div>
    );
}