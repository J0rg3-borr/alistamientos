export default function handler(req, res) {
  // Devuelve sólo presencia de variables, NO sus valores
  res.status(200).json({
    hasGoogleKey: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
    hasSheetId: !!process.env.SHEET_ID
  });
}
