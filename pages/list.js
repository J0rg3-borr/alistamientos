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
                const fecha = (r[10] || '').toString().split('T')[0];
                const status = r[11] || '';
                const sheetRowNumber = idx + 2; // because slice(1)
                return (
                <tr key={idx} className="row-click">
                  <td onClick={() => setSelected(r)}>{r[0]}</td>
                  <td onClick={() => setSelected(r)}>{r[1]}</td>
                  <td onClick={() => setSelected(r)}>{r[3]}</td>
                  <td onClick={() => setSelected(r)}>{r[6]}</td>
                  <td onClick={() => setSelected(r)}>{r[7]}</td>
                  <td onClick={() => setSelected(r)}>{r[4]}</td>
                  <td onClick={() => setSelected(r)}>{r[5]}</td>
                  <td onClick={() => setSelected(r)}>{r[8]}</td>
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
              <li><strong>Memoria:</strong> {[selected[4], selected[5]].filter(Boolean).join(', ')}</li>
              <li><strong>Disco:</strong> {[selected[6], selected[7]].filter(Boolean).join(', ')}</li>
              <li><strong>Cliente:</strong> {selected[8]}</li>
              <li><strong>Técnico:</strong> {selected[9]}</li>
              <li><strong>Fecha:</strong> {(selected[10]||'').toString().split('T')[0]}</li>
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
