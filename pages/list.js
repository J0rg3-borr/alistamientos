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
                <th>Disco</th>
                <th>Memoria</th>
                <th>Cliente</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const disco = [r[6], r[7]].filter(Boolean).join(', ');
                const memoria = [r[4], r[5]].filter(Boolean).join(', ');
                const fecha = (r[10] || '').toString().split('T')[0];
                return (
                <tr key={i} onClick={() => setSelected(r)} className="row-click">
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[3]}</td>
                  <td>{disco}</td>
                  <td>{memoria}</td>
                  <td>{r[8]}</td>
                  <td>{fecha}</td>
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
