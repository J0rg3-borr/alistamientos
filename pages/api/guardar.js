const { appendRow } = require('../../lib/googleSheets');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body;
    // Orden de columnas: A-GLPI, B-Activo, C-Pantalla, D-Serial, E-Memoria1_Capacidad, F-Memoria1_Activo, G-Memoria2_Capacidad, H-Memoria2_Activo, I-Disco1_Capacidad, J-Disco1_Activo, K-Disco2_Capacidad, L-Disco2_Activo, M-Cliente, N-Técnico, O-Fecha
    const row = [
      data.glpi || '',        // A
      data.activo || '',      // B
      data.pantalla || '',    // C
      data.numeroSerie || '', // D
      data.memoria1_capacidad || '', // E
      data.memoria1_activo || '', // F
      data.memoria2_capacidad || '', // G
      data.memoria2_activo || '', // H
      data.disco1_capacidad || '', // I
      data.disco1_activo || '', // J
      data.disco2_capacidad || '', // K
      data.disco2_activo || '', // L
      data.cliente || '',     // M
      data.tecnico || '',     // N
      new Date().toISOString().split('T')[0] // S - Fecha
    ];

    await appendRow(row);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Error' });
  }
}