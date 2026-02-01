const { appendRow } = require('../../lib/googleSheets');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body;
    // Orden de columnas (A:V):
    // A: GLPI
    // B: Activo
    // C: Marca
    // D: Modelo
    // E: Pantalla
    // F: Número de Serie
    // G: Memoria1
    // H: Memoria1_Capacidad
    // I: Memoria1_Activo
    // J: Memoria2
    // K: Memoria2_Capacidad
    // L: Memoria2_Activo
    // M: Disco1
    // N: Disco1_Capacidad
    // O: Disco1_Activo
    // P: Disco2
    // Q: Disco2_Capacidad
    // R: Disco2_Activo
    // S: Estado (reservado para 'Listo para entrega')
    // T: Cliente
    // U: Técnico
    // V: Fecha
    const row = [
      data.glpi || '',                 // A
      data.activo || '',               // B
      data.marca || '',                // C
      data.modelo || '',               // D
      data.pantalla || '',             // E
      data.numeroSerie || '',          // F
      data.memoria1 || '',             // G
      data.memoria1_capacidad || '',   // H
      (data.memoria1_activo ? 'SI' : 'NO'), // I
      data.memoria2 || '',             // J
      data.memoria2_capacidad || '',   // K
      (data.memoria2_activo ? 'SI' : 'NO'), // L
      data.disco1 || '',               // M
      data.disco1_capacidad || '',     // N
      (data.disco1_activo ? 'SI' : 'NO'), // O
      data.disco2 || '',               // P
      data.disco2_capacidad || '',     // Q
      (data.disco2_activo ? 'SI' : 'NO'), // R
      '',                              // S - reserved
      data.cliente || '',              // T
      data.tecnico || '',              // U
      new Date().toISOString().split('T')[0] // V - Fecha
    ];

    await appendRow(row);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Error' });
  }
}