const { appendRow } = require('../../lib/googleSheets');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body;
    // Orden de columnas: GLPI, Activo, Monitor, Serial, Memoria1, Memoria2, Disco1, Disco2, Cliente, Tecnico, Fecha
    const row = [
      data.glpi || '',
      data.activo || '',
      data.monitor || '',
      data.serial || '',
      data.memoria1 || '',
      data.memoria2 || '',
      data.disco1 || '',
      data.disco2 || '',
      data.cliente || '',
      data.tecnico || '',
      // Guardar solo la fecha en formato YYYY-MM-DD
      new Date().toISOString().split('T')[0]
    ];

    await appendRow(row);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Error' });
  }
}
