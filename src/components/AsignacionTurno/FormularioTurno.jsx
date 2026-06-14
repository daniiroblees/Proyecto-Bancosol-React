export default function TurnoForm({
    formData,
    colaboradores,
    infoTienda,
    tipoTurnoNombre,
    lineal,
    handleChange,
    handleSubmit,
    handleCancelar
}) {
    return (
        <div className="form-turno">
            <div className="turno-info">
                <div className="turno-info-row">
                    <span>{infoTienda}</span>
                    <span>{tipoTurnoNombre}</span>
                </div>
                <div className="turno-info-row">
                    <span></span>
                    <span>Lineal {lineal}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="idColaborador">Colaborador:</label>
                    <select id="idColaborador" name="idColaborador" value={formData.idColaborador} onChange={handleChange}>
                        <option value="">Seleccione un colaborador...</option>
                        {colaboradores.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="numVoluntarios">Número de voluntarios:</label>
                    <input type="number" id="numVoluntarios" name="numVoluntarios" value={formData.numVoluntarios} onChange={handleChange} />
                </div>

                <div className="form-group-row">
                    <div className="form-group">
                        <label htmlFor="horaInicio">Hora Inicio:</label>
                        <input type="time" id="horaInicio" name="horaInicio" value={formData.horaInicio} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="horaFin">Hora Fin:</label>
                        <input type="time" id="horaFin" name="horaFin" value={formData.horaFin} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="observaciones">Observaciones:</label>
                    <textarea id="observaciones" name="observaciones" rows="4" value={formData.observaciones} onChange={handleChange}></textarea>
                </div>

                <div className="form-group-row">
                    <button type="button" className="btn-outline" onClick={handleCancelar} style={{width: '100%', marginTop: '10px'}}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-submit">Guardar Turno</button>
                </div>
            </form>
        </div>
    );
}