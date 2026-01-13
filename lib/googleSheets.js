const { google } = require('googleapis');

async function getAuth() {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_KEY env var');
  let key;
  try {
    key = typeof keyJson === 'string' ? JSON.parse(keyJson) : keyJson;
  } catch (e) {
    throw new Error('Invalid JSON in GOOGLE_SERVICE_ACCOUNT_KEY');
  }

  const clientEmail = key.client_email;
  let privateKey = key.private_key;
  if (!clientEmail || !privateKey) throw new Error('Service account JSON missing client_email or private_key');
  // Fix escaped newlines if present
  privateKey = privateKey.replace(/\\n/g, '\n');

  const jwt = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  await jwt.authorize();
  return jwt;
}

async function appendRow(values) {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.SHEET_ID;
  if (!spreadsheetId) throw new Error('Missing SHEET_ID env var');

    // Normalizar y limpiar el nombre de la hoja
    let sheetNameRaw = process.env.SHEET_NAME || 'Alistamientos';
    if (sheetNameRaw && typeof sheetNameRaw === 'string') {
      if (typeof sheetNameRaw.normalize === 'function') {
        sheetNameRaw = sheetNameRaw.normalize('NFKC');
      }
      sheetNameRaw = sheetNameRaw.replace(/[\u00A0\u200B\uFEFF]/g, '').trim();
    }
    const escapedName = (sheetNameRaw || 'Alistamientos').replace(/'/g, "''");
    const safeSheetName = `'${escapedName}'`;
  const range = `${safeSheetName}!A:K`;
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [values]
    }
  });
  return res.data;
}

async function getRows(rangeCols = 'A:L') {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.SHEET_ID;
  if (!spreadsheetId) throw new Error('Missing SHEET_ID env var');

  let sheetNameRaw = process.env.SHEET_NAME || 'Alistamientos';
  if (sheetNameRaw && typeof sheetNameRaw === 'string') {
    if (typeof sheetNameRaw.normalize === 'function') {
      sheetNameRaw = sheetNameRaw.normalize('NFKC');
    }
    sheetNameRaw = sheetNameRaw.replace(/[\u00A0\u200B\uFEFF]/g, '').trim();
  }
  const escapedName = (sheetNameRaw || 'Alistamientos').replace(/'/g, "''");
  const safeSheetName = `'${escapedName}'`;
  const range = `${safeSheetName}!${rangeCols}`;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range
  });
  return res.data.values || [];
}

async function setCell(rowNumber, col = 'L', value = '') {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.SHEET_ID;
  if (!spreadsheetId) throw new Error('Missing SHEET_ID env var');

  let sheetNameRaw = process.env.SHEET_NAME || 'Alistamientos';
  if (sheetNameRaw && typeof sheetNameRaw === 'string') {
    if (typeof sheetNameRaw.normalize === 'function') {
      sheetNameRaw = sheetNameRaw.normalize('NFKC');
    }
    sheetNameRaw = sheetNameRaw.replace(/[\u00A0\u200B\uFEFF]/g, '').trim();
  }
  const escapedName = (sheetNameRaw || 'Alistamientos').replace(/'/g, "''");
  const safeSheetName = `'${escapedName}'`;
  const range = `${safeSheetName}!${col}${rowNumber}`;

  const res = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[value]] }
  });
  return res.data;
}

module.exports = { appendRow, getRows };
