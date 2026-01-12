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

  const sheetName = process.env.SHEET_NAME || 'listamiento';
  const range = `${sheetName}!A:K`;
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

module.exports = { appendRow };
