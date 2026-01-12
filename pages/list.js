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
                <th>Cliente</th>
                <th>Técnico</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} onClick={() => setSelected(r)} className="row-click">
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[3]}</td>
                  <td>{r[8]}</td>
                  <td>{r[9]}</td>
                  <td>{r[10]}</td>
                </tr>
              ))}
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
              <li><strong>Memoria1:</strong> {selected[4]}</li>
              <li><strong>Memoria2:</strong> {selected[5]}</li>
              <li><strong>Disco1:</strong> {selected[6]}</li>
              <li><strong>Disco2:</strong> {selected[7]}</li>
              <li><strong>Cliente:</strong> {selected[8]}</li>
              <li><strong>Técnico:</strong> {selected[9]}</li>
              <li><strong>Fecha:</strong> {selected[10]}</li>
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
