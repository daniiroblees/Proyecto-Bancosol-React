import { useTurnoEspecifico } from '../../hooks/useTurnoEspecifico';

export default function PanelTurno({ tiendaSeleccionada, linealesTotales, cerrarPanel }) {
    const {
        turnoActual, linealActual, turnoData,
        handleTurnoChange, handleLinealChange, handleCrearEditarTurno
    } = useTurnoEspecifico(tiendaSeleccionada);

    const rolUsuario = localStorage.getItem('usuario_rol');
    const puedeEditar = rolUsuario === 'ADMIN' || rolUsuario === 'COORD';

    return (
        <div className={`right-column ${tiendaSeleccionada ? 'open' : ''}`}>
            <div id="info-container" className="card side-panel">
                {tiendaSeleccionada && (
                    <div id="volunteer-container">
                        <div id="volunteer-localization">
                            <div><p id="lbl-tienda">{tiendaSeleccionada.nombre}</p></div>
                            <div><p id="lbl-domicilio">{tiendaSeleccionada.domicilio}</p></div>
                        </div>

                        <div id="volunteer-schedule">
                            <label>
                                <input type="radio" name="schedule" value={1} checked={turnoActual === 1} onChange={handleTurnoChange} /> Viernes Mañana
                            </label>
                            <label>
                                <input type="radio" name="schedule" value={2} checked={turnoActual === 2} onChange={handleTurnoChange} /> Viernes Tarde
                            </label>
                            <label>
                                <input type="radio" name="schedule" value={3} checked={turnoActual === 3} onChange={handleTurnoChange} /> Sábado Mañana
                            </label>
                            <label>
                                <input type="radio" name="schedule" value={4} checked={turnoActual === 4} onChange={handleTurnoChange} /> Sábado Tarde
                            </label>
                        </div>

                        {linealesTotales > 1 && (
                            <div id="volunteer-lineal">
                                {[...Array(linealesTotales)].map((_, i) => (
                                    <label key={i + 1}>
                                        <input type="radio" name="lineal" value={i + 1} checked={linealActual === i + 1} onChange={handleLinealChange} /> L{i + 1}
                                    </label>
                                ))}
                            </div>
                        )}

                        <div id="volunteer-info">
                            {turnoData?.id ? (
                                <>
                                    <div id="volunteer-name">
                                        <div>
                                            <p id="lbl-capitan">{turnoData.colaborador?.nombre || "Sin asignar"}</p>
                                        </div>
                                        <div className="volunteer-date">
                                            <div>COMIENZO</div>
                                            <div>{turnoData.horaInicio}</div>
                                        </div>
                                        <div className="volunteer-date">
                                            <div>FIN</div>
                                            <div>{turnoData.horaFin}</div>
                                        </div>
                                    </div>
                                    <div id="volunteer-observations">
                                        <p>{turnoData.observaciones}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div id="volunteer-name">
                                        <div>
                                            <p id="lbl-capitan" style={{ color: 'gray', fontStyle: 'italic' }}>Sin asignar</p>
                                        </div>
                                        <div className="volunteer-date">
                                            <div>COMIENZO</div>
                                            <div>--:--</div>
                                        </div>
                                        <div className="volunteer-date">
                                            <div>FIN</div>
                                            <div>--:--</div>
                                        </div>
                                    </div>
                                    <div id="volunteer-observations">
                                        <p style={{ color: 'gray', fontStyle: 'italic' }}>No hay información para este turno.</p>
                                    </div>
                                </>
                            )}
                        </div>

                        <div id="button-container">
                            <button id="create-button" disabled={!puedeEditar} onClick={handleCrearEditarTurno}>
                                {turnoData?.id ? "Editar" : "Crear"}
                            </button>
                            <button id="cancel-button" onClick={cerrarPanel}>Cancelar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}