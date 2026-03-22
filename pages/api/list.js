const { getRows } = require('../../lib/googleSheets');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const rows = await getRows();
    // Filtrar filas marcadas como "Entregado" o "Listo para entrega" en columna S (índice 18)
    const filteredRows = rows.filter((row, index) => {
      if (index === 0) return true; // Mantener headers
      const status = (row[18] || '').toString().trim();
      return status !== 'Entregado' && status !== 'Listo para entrega';
    });
    return res.status(200).json({ rows: filteredRows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Error' });
  }
}
