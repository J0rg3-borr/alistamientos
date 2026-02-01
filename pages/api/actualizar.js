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
      Activo_memoria1: 'E',
      Activo_memoria2: 'F',
      memoria1_capacidad: 'G',
      memoria2_capacidad: 'H',
      Activo_disco1: 'I',
      Capacidad_disco1: 'J',
      Activo_disco2: 'K',
      disco2_capacidad: 'L',
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
