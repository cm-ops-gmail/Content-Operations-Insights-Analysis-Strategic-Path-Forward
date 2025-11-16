import { google } from 'googleapis';
import { NextResponse } from 'next/server';

async function getSheetData(range: string) {
  try {
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!serviceAccountEmail || !privateKey || !sheetId) {
      throw new Error("Missing Google Sheets credentials in .env file");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = response.data.values;
    if (rows && rows.length > 1) {
      const header = rows[0];
      const data = rows.slice(1).map((row) => {
        const rowData: { [key: string]: any } = {};
        header.forEach((key, index) => {
          rowData[key] = row[index];
        });
        return rowData;
      });
      return data;
    }

    return [];
  } catch (error: any) {
    console.error('Error fetching data from Google Sheets:', error.message);
    if (error.code === 403) {
        throw new Error("Permission denied. Please ensure the service account has 'Editor' access to the Google Sheet and the Google Sheets API is enabled.");
    }
    throw new Error('Failed to fetch data from Google Sheets. Please check your credentials and Sheet ID.');
  }
}

export async function GET() {
  try {
    const data = await getSheetData('Sheet1!A:F');
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
