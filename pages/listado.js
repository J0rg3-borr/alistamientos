import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/list');
        const json = await res.json();
        if (res.ok) setRows(json.rows || []);
        else console.error(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="container">
      <h1>Alistamientos</h1>
      <div className="tabs">
        <Link href="/"><a className="tab">Formulario</a></Link>
        <a className="tab active">Listado</a>
      </div>

      <div className="card">
        {loading ? (
          <div>Cargando...</div>
        ) : rows.length === 0 ? (
          <div>No hay registros.</div>
        ) : (
          <table className="alist-table">
            <thead>
              <tr>
                <th>GLPI</th>
                <th>Activo</th>
                <th>Serial</th>
                <th>Disco 1</th>
                <th>Disco 2</th>
                <th>Memoria 1</th>
                <th>Memoria 2</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((r, idx) => {
                const fecha = (r[18] || '').toString().split('T')[0];
                const status = r[18] || '';
                const sheetRowNumber = idx + 2; // because slice(1)
                return (
                <tr key={idx} className="row-click">
                  <td onClick={() => setSelected(r)}>{r[0]}</td>
                  <td onClick={() => setSelected(r)}>{r[1]}</td>
                  <td onClick={() => setSelected(r)}>{r[3]}</td>
                  <td onClick={() => setSelected(r)}>{r[10]} (Cap: {r[11]}, Act: {r[12]})</td>
                  <td onClick={() => setSelected(r)}>{r[13]} (Cap: {r[14]}, Act: {r[15]})</td>
                  <td onClick={() => setSelected(r)}>{r[4]} (Cap: {r[5]}, Act: {r[6]})</td>
                  <td onClick={() => setSelected(r)}>{r[7]} (Cap: {r[8]}, Act: {r[9]})</td>
                  <td onClick={() => setSelected(r)}>{r[16]}</td>
                  <td onClick={() => setSelected(r)}>{fecha}</td>
                  <td>
                    {status ? (
                      <span style={{color:'#0b7a3d'}}>{status}</span>
                    ) : (
                      <button className="small" onClick={async () => {
                        try {
                          const res = await fetch('/api/mark-ready', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ row: sheetRowNumber })
                          });
                          if (res.ok) {
                            // Remover la fila del estado local
                            const copy = [...rows];
                            copy.splice(idx+1, 1);
                            setRows(copy);
                          } else {
                            const j = await res.json();
                            console.error(j);
                            alert('Error marcando como listo: '+(j.error||res.statusText));
                          }
                        } catch (e) {
                          console.error(e);
                          alert('Error de red');
                        }
                      }}>Marcar listo</button>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        )}

        {selected && (
          <div className="detail">
            <h3>Detalle</h3>
            <ul>
              <li><strong>GLPI:</strong> {selected[0]}</li>
              <li><strong>Activo:</strong> {selected[1]}</li>
              <li><strong>Monitor:</strong> {selected[2]}</li>
              <li><strong>Serial:</strong> {selected[3]}</li>
              <li><strong>Memoria 1:</strong> {selected[4]} (Cap: {selected[5]}, Act: {selected[6]})</li>
              <li><strong>Memoria 2:</strong> {selected[7]} (Cap: {selected[8]}, Act: {selected[9]})</li>
              <li><strong>Disco 1:</strong> {selected[10]} (Cap: {selected[11]}, Act: {selected[12]})</li>
              <li><strong>Disco 2:</strong> {selected[13]} (Cap: {selected[14]}, Act: {selected[15]})</li>
              <li><strong>Cliente:</strong> {selected[16]}</li>
              <li><strong>Técnico:</strong> {selected[17]}</li>
              <li><strong>Fecha:</strong> {(selected[18]||'').toString().split('T')[0]}</li>
            </ul>
            <div style={{marginTop:12}}>
              <button onClick={() => setSelected(null)}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
