export default function ColaboradorInfoPanel({ colaboradorSeleccionado, contactoPrincipal }) {
    if (!colaboradorSeleccionado) return null;

    return (
        <div className="card side-panel">
            <div id="colaborador-localization">
                <p id="lbl-colaborador">{colaboradorSeleccionado.nombre}</p>
                <p id="lbl-domicilio">{colaboradorSeleccionado.domicilio}</p>
                <p className="text-muted">
                    {colaboradorSeleccionado.codigo}, {colaboradorSeleccionado.localidadSede?.nombre}
                </p>
                <p className="text-muted">
                    Colabora en: {colaboradorSeleccionado.colaboraEn?.nombre}
                </p>
            </div>

            <div id="colaborador-schedule">
                <div id="contactosCard">
                    <div className="info-card">
                        <div className="info-header">
                            <div className="info-main">
                                <p className="lbl-capitan">
                                    {contactoPrincipal?.nombre || '--'}
                                </p>
                            </div>
                            <div className="info-side">
                                <div>TELÉFONO</div>
                                <div>{contactoPrincipal?.telefono || '--'}</div>
                            </div>
                        </div>
                        <div className="info-body">
                            <p><strong>Email: </strong>{contactoPrincipal?.email || '--'}</p>
                        </div>
                    </div>
                </div>

                <div id="colaborador-observaciones">
                    <p className="section-title">Observaciones</p>
                    <div className="info-card">
                        <div className="info-body">
                            <p>{colaboradorSeleccionado.observaciones || "Sin observaciones"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}