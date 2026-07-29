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

  function getFecha(value) {
    return (value || '').toString().split('T')[0] || '-';
  }

  function getCellValue(row, index) {
    return row?.[index] || '-';
  }

  function openDetail(row) {
    setSelected(row);
  }

  function closeDetail() {
    setSelected(null);
  }

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
                <th>Pantalla</th>
                <th>Serial</th>
                <th>Cliente</th>
                <th>Técnico</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((r, idx) => {
                const fecha = getFecha(r[16]);

                return (
                  <tr key={idx} className="row-click">
                    <td>{getCellValue(r, 0)}</td>
                    <td>{getCellValue(r, 1)}</td>
                    <td>{getCellValue(r, 4)}</td>
                    <td>{getCellValue(r, 5)}</td>
                    <td>{getCellValue(r, 14)}</td>
                    <td>{getCellValue(r, 15)}</td>
                    <td>{fecha}</td>
                    <td>
                      <div style={{display:'flex', gap:'6px', flexWrap:'wrap'}}>
                        <button className="small" onClick={() => openDetail(r)}>Detalle</button>
                        <button className="small" onClick={async () => {
                          try {
                            const res = await fetch('/api/marcar-listo', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ row: idx + 2 })
                            });
                            if (res.ok) {
                              setRows((prev) => prev.filter((_, i) => i !== idx + 1));
                            } else {
                              const j = await res.json();
                              console.error(j);
                              alert('Error marcando como listo: ' + (j.error || res.statusText));
                            }
                          } catch (e) {
                            console.error(e);
                            alert('Error de red');
                          }
                        }}>Listo</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}


        {selected ? (
          <div className="detail">
            <h3>Detalle del equipo</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'12px'}}>
              {[
                ['GLPI', selected[0]],
                ['Activo', selected[1]],
                ['Marca', selected[2]],
                ['Modelo', selected[3]],
                ['Pantalla', selected[4]],
                ['Serial', selected[5]],
                ['Memoria 1', selected[6]],
                ['Capacidad Memoria 1', selected[7]],
                ['Memoria 2', selected[8]],
                ['Capacidad Memoria 2', selected[9]],
                ['Disco 1', selected[10]],
                ['Capacidad Disco 1', selected[11]],
                ['Disco 2', selected[12]],
                ['Capacidad Disco 2', selected[13]],
                ['Cliente', selected[14]],
                ['Técnico', selected[15]],
                ['Fecha', getFecha(selected[16])]
              ].map(([label, value]) => (
                <div key={label} style={{background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'10px 12px'}}>
                  <div style={{fontSize:'12px', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.04em'}}>{label}</div>
                  <div style={{fontWeight:600, color:'#111827', marginTop:'4px'}}>{value || '-'}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:12}}>
              <button onClick={closeDetail}>Cerrar</button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
