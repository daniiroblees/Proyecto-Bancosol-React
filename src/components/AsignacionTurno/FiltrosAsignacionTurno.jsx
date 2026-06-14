export default function FiltrosAsignacionTurno({ tipoCampanyas, campanyas, tipoCampanyaId, campanyaId, handleTipoChange, handleCampanyaChange }) {
    return (
        <div className="filtros-container">
            <div className="filtro-group">
                <label htmlFor="selectTipoCampanya">Tipo de Campaña</label>
                <select id="selectTipoCampanya" value={tipoCampanyaId} onChange={handleTipoChange}>
                    <option value={0}>Sin Filtro</option>
                    {tipoCampanyas.map(t => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                </select>
            </div>

            <div className="filtro-group">
                <label htmlFor="selectCampanya">Campaña</label>
                <select id="selectCampanya" value={campanyaId} onChange={handleCampanyaChange}>
                    <option value={0}>Sin Filtro</option>
                    {campanyas.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}