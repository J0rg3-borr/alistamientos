const { appendRow } = require('../../lib/googleSheets');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body;
    // Orden de columnas: A-GLPI, B-Activo, C-Pantalla, D-Serial, E-Memoria1, F-Memoria1_Capacidad, G-Memoria1_Activo, H-Memoria2, I-Memoria2_Capacidad, J-Memoria2_Activo, K-Disco1, L-Disco1_Capacidad, M-Disco1_Activo, N-Disco2, O-Disco2_Capacidad, P-Disco2_Activo, Q-Cliente, R-Técnico, S-Fecha
    const row = [
      data.glpi || '',        // A
      data.activo || '',      // B
      data.pantalla || '',    // C
      data.numeroSerie || '', // D
      data.memoria1 || '',    // E
      data.memoria1_capacidad || '', // F
      data.memoria1_activo || '', // G
      data.memoria2 || '',    // H
      data.memoria2_capacidad || '', // I
      data.memoria2_activo || '', // J
      data.disco1 || '',      // K
      data.disco1_capacidad || '', // L
      data.disco1_activo || '', // M
      data.disco2 || '',      // N
      data.disco2_capacidad || '', // O
      data.disco2_activo || '', // P
      data.cliente || '',     // Q
      data.tecnico || '',     // R
      new Date().toISOString().split('T')[0] // S - Fecha
    ];

    await appendRow(row);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Error' });
  }
}