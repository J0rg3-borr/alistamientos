const { deleteRow } = require('../../lib/googleSheets');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { row } = req.body;
    if (!row) return res.status(400).json({ error: 'Missing row' });
    // Borrar la fila del Excel
    await deleteRow(Number(row));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Error' });
  }
}
