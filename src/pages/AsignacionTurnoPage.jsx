import { useAsignacionTurno } from '../hooks/useAsignacionTurno';
import FiltrosAsignacionTurno from '../components/AsignacionTurno/FiltrosAsignacionTurno';
import TablaAsignacionTurno from '../components/AsignacionTurno/TablaAsignacionTurno';
import PanelTurnoData from '../components/AsignacionTurno/PanelTurno';

import '../styles/global.css';
import '../styles/asignacion_turno.css';

export default function AsignacionTurnoPage() {
    const {
        asignaciones, tipoCampanyas, campanyas, cargando,
        tipoCampanyaId, campanyaId, tiendaSeleccionada, linealesTotales,
        handleTipoChange, handleCampanyaChange, handleClickFila, cerrarPanel
    } = useAsignacionTurno();

    return (
        <>
            <FiltrosAsignacionTurno 
                tipoCampanyas={tipoCampanyas}
                campanyas={campanyas}
                tipoCampanyaId={tipoCampanyaId}
                campanyaId={campanyaId}
                handleTipoChange={handleTipoChange}
                handleCampanyaChange={handleCampanyaChange}
            />

            <main className="page-wrapper">
                <div className="left-column">
                    <TablaAsignacionTurno 
                        asignaciones={asignaciones}
                        cargando={cargando}
                        tiendaSeleccionada={tiendaSeleccionada}
                        handleClickFila={handleClickFila}
                    />
                </div>

                <PanelTurnoData 
                    tiendaSeleccionada={tiendaSeleccionada}
                    linealesTotales={linealesTotales}
                    cerrarPanel={cerrarPanel}
                />
            </main>
        </>
    );
}