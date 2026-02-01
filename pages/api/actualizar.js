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
      marca: 'C',
      modelo: 'D',
      pantalla: 'E',
      numeroSerie: 'F',
      memoria1: 'G',
      memoria1_capacidad: 'H',
      memoria2: 'I',
      memoria2_capacidad: 'J',
      disco1: 'K',
      disco1_capacidad: 'L',
      disco2: 'M',
      disco2_capacidad: 'N',
      cliente: 'T',
      tecnico: 'U'
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
