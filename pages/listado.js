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
      pantalla: row[2] || '',
      numeroSerie: row[3] || '',
      memoria1: row[4] || '',
      memoria1_capacidad: row[5] || '',
      memoria1_activo: row[6] || '',
      memoria2: row[7] || '',
      memoria2_capacidad: row[8] || '',
      memoria2_activo: row[9] || '',
      disco1: row[10] || '',
      disco1_capacidad: row[11] || '',
      disco1_activo: row[12] || '',
      disco2: row[13] || '',
      disco2_capacidad: row[14] || '',
      disco2_activo: row[15] || '',
      cliente: row[16] || '',
      tecnico: row[17] || ''
    });
  }

  function handleEditChange(field, value) {
    setEditForm({ ...editForm, [field]: value });
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
        // Actualizar la fila local
        const newRows = [...rows];
        newRows[selectedRowIndex + 1] = [
          editForm.glpi,
          editForm.activo,
          editForm.pantalla,
          editForm.numeroSerie,
          editForm.memoria1,
          editForm.memoria1_capacidad,
          editForm.memoria1_activo,
          editForm.memoria2,
          editForm.memoria2_capacidad,
          editForm.memoria2_activo,
          editForm.disco1,
          editForm.disco1_capacidad,
          editForm.disco1_activo,
          editForm.disco2,
          editForm.disco2_capacidad,
          editForm.disco2_activo,
          editForm.cliente,
          editForm.tecnico,
          newRows[selectedRowIndex + 1][18]
        ];
        setRows(newRows);
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
                        }}>Listo</button>
                      </div>
                    )}
                  </td>
                </tr>
              )})}
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
              <button onClick={() => { setSelected(null); setEditForm(null); }}>Cerrar</button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
