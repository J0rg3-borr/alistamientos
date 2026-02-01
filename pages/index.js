import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [form, setForm] = useState({
    glpi: '', activo: '', pantalla: '', numeroSerie: '', 
    memoria1: '', memoria1_capacidad: '',
    memoria2: '', memoria2_capacidad: '',
    disco1: '', disco1_capacidad: '',
    disco2: '', disco2_capacidad: '',
    cliente: '', tecnico: ''
  });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  }

  function validate() {
    const err = {};
    if (!form.glpi) err.glpi = 'GLPI es requerido';
    if (!form.activo) err.activo = 'Activo es requerido';
    if (!form.cliente) err.cliente = 'Cliente es requerido';
    if (!form.tecnico) err.tecnico = 'Técnico es requerido';
    return err;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      setStatus(null);
      return;
    }
    setStatus('Enviando...');
    try {
      const res = await fetch('/api/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (res.ok) {
        setStatus('Guardado correctamente');
        setForm({ glpi: '', activo: '', pantalla: '', numeroSerie: '', 
          memoria1: '', memoria1_capacidad: '',
          memoria2: '', memoria2_capacidad: '',
          disco1: '', disco1_capacidad: '',
          disco2: '', disco2_capacidad: '',
          cliente: '', tecnico: '' });
        setErrors({});
      } else {
        setStatus('Error: ' + (json.error || res.statusText));
      }
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  }

  return (
    <main className="container">
      <h1 style={{color:'var(--accent)'}}>Dashboard - Listado de equipos</h1>
      <div className="tabs">
        <a className="tab active">Formulario</a>
        <Link href="/listado"><a className="tab">Listado</a></Link>
      </div>
      <div className="card">
        <form onSubmit={onSubmit} className="form">
          <label>
            GLPI
            <input name="glpi" value={form.glpi} onChange={onChange} />
            {errors.glpi && <div className="error">{errors.glpi}</div>}
          </label>

          <label>
            Activo
            <input name="activo" value={form.activo} onChange={onChange} />
            {errors.activo && <div className="error">{errors.activo}</div>}
          </label>

          <label>
            Monitor
            <input name="pantalla" value={form.pantalla} onChange={onChange} />
          </label>

          <label>
            Serial
            <input name="numeroSerie" value={form.numeroSerie} onChange={onChange} />
            {errors.serial && <div className="error">{errors.serial}</div>}
          </label>

          <div className="row">
            <div className="col">
              <label>
                Activo memoria 
                <input name="memoria1_activo" value={form.memoria1_activo} onChange={onChange} />
              </label>
              <label>
                Capacidad Memoria 1
                <input name="memoria1_capacidad" value={form.memoria1_capacidad} onChange={onChange} />
              </label>
            </div>
            <div className="col">
              <label>
                Activo memoria 
                <input name="memoria2_activo" value={form.memoria2_activo} onChange={onChange} />
              </label>
              <label>
                Capacidad Memoria 2
                <input name="memoria2_capacidad" value={form.memoria2_capacidad} onChange={onChange} />
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label>
                Activo disco
                <input name="disco1_activo" value={form.disco1_activo} onChange={onChange} />
              </label>
              <label>
                Capacidad Disco 1
                <input name="disco1_capacidad" value={form.disco1_capacidad} onChange={onChange} />
              </label>
            </div>
            <div className="col">
              <label>
                Activo disco 2
                <input name="disco2_activo" value={form.disco2_activo} onChange={onChange} />
              </label>
              <label>
                Capacidad Disco 2
                <input name="disco2_capacidad" value={form.disco2_capacidad} onChange={onChange} />
              </label>
            </div>
          </div>

          <label>
            Cliente
            <input name="cliente" value={form.cliente} onChange={onChange} />
            {errors.cliente && <div className="error">{errors.cliente}</div>}
          </label>

          <label>
            Técnico
            <input name="tecnico" value={form.tecnico} onChange={onChange} />
            {errors.tecnico && <div className="error">{errors.tecnico}</div>}
          </label>

          <div className="actions">
            <button type="submit">Guardar en listamiento</button>
          </div>
        </form>

        {status && <div className="status">{status}</div>}
      </div>
    </main>
  );
}
