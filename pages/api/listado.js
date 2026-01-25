const { getRows } = require('../../lib/googleSheets');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const rows = await getRows();
    // Filtrar filas marcadas como "Listo para entrega" en columna L (índice 11)
    const filteredRows = rows.filter((row, index) => {
      if (index === 0) return true; // Mantener headers
      return (row[11] || '') !== 'Listo para entrega';
    });
    return res.status(200).json({ rows: filteredRows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Error' });
  }
}
