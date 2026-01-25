const { appendRow } = require('../../lib/hojasGoogle');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body;
    // Orden de columnas: GLPI, Activo, Pantalla, Número de Serie, Memoria1, Memoria1_Capacidad, Memoria1_Activo, Memoria2, Memoria2_Capacidad, Memoria2_Activo, Disco1, Disco1_Capacidad, Disco1_Activo, Disco2, Disco2_Capacidad, Disco2_Activo, Cliente, Técnico, Fecha, Status
    const row = [
      data.glpi || '',
      data.activo || '',
      data.pantalla || '',
      data.numeroSerie || '',
      data.memoria1 || '',
      data.memoria1_capacidad || '',
      data.memoria1_activo || '',
      data.memoria2 || '',
      data.memoria2_capacidad || '',
      data.memoria2_activo || '',
      data.disco1 || '',
      data.disco1_capacidad || '',
      data.disco1_activo || '',
      data.disco2 || '',
      data.disco2_capacidad || '',
      data.disco2_activo || '',
      data.cliente || '',
      data.tecnico || '',
      // Guardar solo la fecha en formato YYYY-MM-DD
      new Date().toISOString().split('T')[0],
      '' // Status vacío inicialmente
    ];

    await appendRow(row);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Error' });
  }
}