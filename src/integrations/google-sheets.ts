import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CREDENTIALS_PATH = path.resolve(__dirname, "credentials.json");
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));

const SPREADSHEET_ID = "1Ccs2qKQEUDFWG7f8Sx5eIdmSBbBHMKRpWhjIk_incvY";
const SHEET_NAME = "Hoja1";
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
      range: "Hoja 1!A:E",
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
