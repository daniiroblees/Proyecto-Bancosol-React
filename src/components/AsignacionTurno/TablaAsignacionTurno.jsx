export default function TablaAsignacionTurno({ asignaciones, cargando, tiendaSeleccionada, handleClickFila }) {
    const formatearTurno = (texto) => {
        if (!texto) return "";
        const partes = texto.split(/(?=\bL\d+)/g);
        return partes.map((parte, i) => <div key={i}>{parte}</div>);
    };

    return (
	<div className="left-column">
        <div className="table-container card">
            <table className="modernTable">
                <thead>
                    <tr>
                        <th>Tienda</th>
                        <th>Domicilio</th>
                        <th>Localidad</th>
                        <th>Capitán</th>
                        <th>Viernes M.</th>
                        <th>Viernes T.</th>
                        <th>Sábado M.</th>
                        <th>Sábado T.</th>
                    </tr>
                </thead>
                <tbody>
                    {cargando ? (
                        <tr><td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>Cargando turnos...</td></tr>
                    ) : asignaciones.length === 0 ? (
                        <tr><td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>No hay datos disponibles.</td></tr>
                    ) : (
                        asignaciones.map(a => (
                            <tr
                                key={a.idTiendaCampanya}
                                className={tiendaSeleccionada?.id === a.idTiendaCampanya ? "selected" : ""}
                                onClick={() => handleClickFila(a.idTiendaCampanya, a.lineales, a.tienda, a.domicilio)}
                            >
                                <td className="font-medium text-blue">{a.tienda}</td>
                                <td>{a.domicilio}</td>
                                <td>{a.localidad}</td>
                                <td>{a.capitan || "Sin asignar"}</td>
                                <td className="small-td">{formatearTurno(a.viernesManana)}</td>
                                <td className="small-td">{formatearTurno(a.viernesTarde)}</td>
                                <td className="small-td">{formatearTurno(a.sabadoManana)}</td>
                                <td className="small-td">{formatearTurno(a.sabadoTarde)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
	</div>
    );
}