const { getRows } = require('../../lib/googleSheets');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const rows = await getRows();
    // First row might be headers; return as-is
    return res.status(200).json({ rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Error' });
  }
}
