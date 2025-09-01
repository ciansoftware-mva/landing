import { google } from "googleapis";
// Credenciales y parámetros desde variables de entorno
const credentials = {
  client_email: import.meta.env.GOOGLE_CLIENT_EMAIL,
  private_key: import.meta.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};
const SPREADSHEET_ID = import.meta.env.GOOGLE_SPREADSHEET_ID;
const SHEET_NAME = import.meta.env.GOOGLE_SHEET_NAME;
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export async function agregarFila({
  nombre,
  correo,
  empresa,
  mensaje,
}: {
  nombre: string;
  correo: string;
  empresa: string;
  mensaje: string;
}) {
  const sheets = google.sheets({
    version: "v4",
    auth: new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: SCOPES,
    }),
  });

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:E`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [nombre, correo, empresa, mensaje, new Date().toLocaleString()],
        ],
      },
    });
  } catch (error) {
    console.error("Error al agregar la fila:", error);
    throw error;
  }
}
