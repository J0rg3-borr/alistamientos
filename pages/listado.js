import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [editForm, setEditForm] = useState(null);

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

  function handleEditClick(row, idx) {
    setSelected(row);
    setSelectedRowIndex(idx);
    setEditForm({
      glpi: row[0] || '',
      activo: row[1] || '',
      marca: row[2] || '',
      modelo: row[3] || '',
      pantalla: row[4] || '',
      numeroSerie: row[5] || '',
      memoria1: row[6] || '',
      memoria1_capacidad: row[7] || '',
      memoria2: row[8] || '',
      memoria2_capacidad: row[9] || '',
      disco1: row[10] || '',
      disco1_capacidad: row[11] || '',
      disco2: row[12] || '',
      disco2_capacidad: row[13] || '',
      cliente: row[19] || '',
      tecnico: row[20] || ''
    });
  }

  function handleEditChange(field, value) {
    setEditForm({ ...editForm, [field]: value });
  }

  // Detecta si un valor parece ser una capacidad (contiene dígitos) para evitar mostrar nombres en la columna de capacidades
  function isCapacity(val) {
    if (!val && val !== 0) return false;
    try {
      return /\d/.test(String(val));
    } catch (e) {
      return false;
    }
  }

  async function handleSaveEdit() {
    try {
      const sheetRowNumber = selectedRowIndex + 2;
      const res = await fetch('/api/actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ row: sheetRowNumber, ...editForm })
      });
      if (res.ok) {
        alert('Actualizado correctamente');
        // Refrescar listado desde el servidor
        try {
          const r2 = await fetch('/api/list');
          const j2 = await r2.json();
          if (r2.ok) setRows(j2.rows || []);
        } catch (e) { console.error(e); }
        setSelected(null);
        setEditForm(null);
      } else {
        const j = await res.json();
        alert('Error actualizando: ' + (j.error || res.statusText));
      }
    } catch (e) {
      console.error(e);
      alert('Error de red: ' + e.message);
    }
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
                <th>Marca</th>
                <th>Modelo</th>
                <th>Pantalla</th>
                <th>Serial</th>

                <th>Memoria 1</th>
                <th>Cap. Mem1</th>
                <th>Memoria 2</th>
                <th>Cap. Mem2</th>

                <th>Disco 1</th>
                <th>Cap. Disco1</th>
                <th>Disco 2</th>
                <th>Cap. Disco2</th>

                <th>Cliente</th>
                <th>Técnico</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((r, idx) => {
                const status = r[18] || '';
                const fecha = (r[21] || '').toString().split('T')[0];
                const sheetRowNumber = idx + 2; // because slice(1)
                return (
                <tr key={idx} className="row-click">
                  <td onClick={() => setSelected(r)}>{r[0]}</td>
                  <td onClick={() => setSelected(r)}>{r[1]}</td>
                  <td onClick={() => setSelected(r)}>{r[2]}</td>
                  <td onClick={() => setSelected(r)}>{r[3]}</td>
                  <td onClick={() => setSelected(r)}>{r[4]}</td>
                  <td onClick={() => setSelected(r)}>{r[5]}</td>

                  <td onClick={() => setSelected(r)}>{r[6]}</td>
                  <td onClick={() => setSelected(r)}>{r[7]}</td>
                  <td onClick={() => setSelected(r)}>{r[8]}</td>
                  <td onClick={() => setSelected(r)}>{r[9]}</td>

                  <td onClick={() => setSelected(r)}>{r[10]}</td>
                  <td onClick={() => setSelected(r)}>{r[11]}</td>
                  <td onClick={() => setSelected(r)}>{r[12]}</td>
                  <td onClick={() => setSelected(r)}>{r[13]}</td>

                  <td onClick={() => setSelected(r)}>{r[19]}</td>
                  <td onClick={() => setSelected(r)}>{r[20]}</td>
                  <td onClick={() => setSelected(r)}>{fecha}</td>
                  <td>
                    {status ? (
                      <span style={{color:'#0b7a3d'}}>{status}</span>
                    ) : (
                      <div style={{display:'flex', gap:'6px'}}>
                        <button className="small" onClick={() => handleEditClick(r, idx)}>Editar</button>
                        <button className="small" onClick={async () => {
                          try {
                            const res = await fetch('/api/marcar-listo', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ row: sheetRowNumber })
                            });
                            if (res.ok) {
                              // Remover la fila del listado (sin borrar de Google Sheets)
                              const newRows = rows.filter((_, i) => i !== idx + 1);
                              setRows(newRows);
                            } else {
                              const j = await res.json();
                              console.error(j);
                              alert('Error marcando como listo: '+(j.error||res.statusText));
                            }
                          } catch (e) {
                            console.error(e);
                            alert('Error de red');
                          }
                        }}>Listo</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        )}


        {editForm ? (
          <div className="detail">
            <h3>Editar Equipo</h3>
            <form style={{display:'grid', gap:'8px'}}>
              <label>
                GLPI
                <input type="text" value={editForm.glpi} onChange={(e) => handleEditChange('glpi', e.target.value)} />
              </label>
              <label>
                Activo
                <input type="text" value={editForm.activo} onChange={(e) => handleEditChange('activo', e.target.value)} />
              </label>
              <label>
                Marca
                <input type="text" value={editForm.marca || ''} onChange={(e) => handleEditChange('marca', e.target.value)} />
              </label>
              <label>
                Modelo
                <input type="text" value={editForm.modelo || ''} onChange={(e) => handleEditChange('modelo', e.target.value)} />
              </label>
              <label>
                Monitor
                <input type="text" value={editForm.pantalla} onChange={(e) => handleEditChange('pantalla', e.target.value)} />
              </label>
              <label>
                Serial
                <input type="text" value={editForm.numeroSerie} onChange={(e) => handleEditChange('numeroSerie', e.target.value)} />
              </label>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
                <label>
                  Memoria 1
                  <input type="text" value={editForm.memoria1} onChange={(e) => handleEditChange('memoria1', e.target.value)} />
                </label>
                <label>
                  Cap. Mem 1
                  <input type="text" value={editForm.memoria1_capacidad} onChange={(e) => handleEditChange('memoria1_capacidad', e.target.value)} />
                </label>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
                <label>
                  Memoria 2
                  <input type="text" value={editForm.memoria2} onChange={(e) => handleEditChange('memoria2', e.target.value)} />
                </label>
                <label>
                  Cap. Mem 2
                  <input type="text" value={editForm.memoria2_capacidad} onChange={(e) => handleEditChange('memoria2_capacidad', e.target.value)} />
                </label>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
                <label>
                  Disco 1
                  <input type="text" value={editForm.disco1} onChange={(e) => handleEditChange('disco1', e.target.value)} />
                </label>
                <label>
                  Cap. Disco 1
                  <input type="text" value={editForm.disco1_capacidad} onChange={(e) => handleEditChange('disco1_capacidad', e.target.value)} />
                </label>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
                <label>
                  Disco 2
                  <input type="text" value={editForm.disco2} onChange={(e) => handleEditChange('disco2', e.target.value)} />
                </label>
                <label>
                  Cap. Disco 2
                  <input type="text" value={editForm.disco2_capacidad} onChange={(e) => handleEditChange('disco2_capacidad', e.target.value)} />
                </label>
              </div>
              <label>
                Cliente
                <input type="text" value={editForm.cliente} onChange={(e) => handleEditChange('cliente', e.target.value)} />
              </label>
              <label>
                Técnico
                <input type="text" value={editForm.tecnico} onChange={(e) => handleEditChange('tecnico', e.target.value)} />
              </label>
              <div style={{marginTop:12, display:'flex', gap:'8px'}}>
                <button type="button" onClick={handleSaveEdit}>Guardar cambios</button>
                <button type="button" onClick={() => { setEditForm(null); setSelected(null); }}>Cancelar</button>
              </div>
            </form>
          </div>
        ) : selected ? (
          <div className="detail">
            <h3>Detalle</h3>
            <ul>
              <li><strong>GLPI:</strong> {selected[0]}</li>
              <li><strong>Activo:</strong> {selected[1]}</li>
              <li><strong>Marca:</strong> {selected[2]}</li>
              <li><strong>Modelo:</strong> {selected[3]}</li>
              <li><strong>Monitor:</strong> {selected[4]}</li>
              <li><strong>Serial:</strong> {selected[5]}</li>
              <li><strong>Memoria 1:</strong> {selected[6] || '-' } (Cap: {selected[7] || '-'})</li>
              <li><strong>Memoria 2:</strong> {selected[8] || '-' } (Cap: {selected[9] || '-'})</li>
              <li><strong>Disco 1:</strong> {selected[10] || '-' } (Cap: {selected[11] || '-'})</li>
              <li><strong>Disco 2:</strong> {selected[12] || '-' } (Cap: {selected[13] || '-'})</li>
              <li><strong>Cliente:</strong> {selected[19]}</li>
              <li><strong>Técnico:</strong> {selected[20]}</li>
              <li><strong>Fecha:</strong> {(selected[21]||'').toString().split('T')[0]}</li>
            </ul>
            <div style={{marginTop:12}}>
              <button onClick={() => { setSelected(null); setEditForm(null); }}>Cerrar</button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
