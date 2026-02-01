const { appendRow } = require('../../lib/googleSheets');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body;
    // Orden de columnas (A:V) sin flags *_activo:
    // A: GLPI
    // B: Activo
    // C: Marca
    // D: Modelo
    // E: Pantalla
    // F: Número de Serie
    // G: Memoria1
    // H: Memoria1_Capacidad
    // I: Memoria2
    // J: Memoria2_Capacidad
    // K: Disco1
    // L: Disco1_Capacidad
    // M: Disco2
    // N: Disco2_Capacidad
    // O: (reserved)
    // P: (reserved)
    // Q: (reserved)
    // R: (reserved)
    // S: Estado (reservado para 'Listo para entrega')
    // T: Cliente
    // U: Técnico
    // V: Fecha
    const row = [
      data.glpi || '',               // A
      data.activo || '',             // B
      data.marca || '',              // C
      data.modelo || '',             // D
      data.pantalla || '',           // E
      data.numeroSerie || '',        // F
      data.memoria1 || '',           // G
      data.memoria1_capacidad || '', // H
      data.memoria2 || '',           // I
      data.memoria2_capacidad || '', // J
      data.disco1 || '',             // K
      data.disco1_capacidad || '',   // L
      data.disco2 || '',             // M
      data.disco2_capacidad || '',   // N
      '', '', '', '',                 // O, P, Q, R placeholders
      '',                            // S - reserved
      data.cliente || '',            // T
      data.tecnico || '',            // U
      new Date().toISOString().split('T')[0] // V - Fecha
    ];

    await appendRow(row);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Error' });
  }
}