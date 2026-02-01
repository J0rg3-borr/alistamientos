const { setCell, getRows } = require('../../lib/googleSheets');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body;
    const { row, ...updateData } = data;

    if (!row) return res.status(400).json({ error: 'Missing row number' });

    // Mapeo de campos a columnas
    const fieldMap = {
      glpi: 'A',
      activo: 'B',
      pantalla: 'C',
      numeroSerie: 'D',
      memoria1_capacidad: 'E',
      memoria1_activo: 'F',
      memoria2_capacidad: 'G',
      memoria2_activo: 'H',
      disco1_capacidad: 'I',
      disco1_activo: 'J',
      disco2_capacidad: 'K',
      disco2_activo: 'L',
      cliente: 'M',
      tecnico: 'N'
    };

    // Actualizar cada campo
    for (const [field, value] of Object.entries(updateData)) {
      if (fieldMap[field] && value !== undefined && value !== null) {
        await setCell(Number(row), fieldMap[field], value);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Error' });
  }
}
