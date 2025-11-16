
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

async function getSheetData(range: string) {
  try {
    // Ensure credentials are in the correct format
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !privateKey) {
      throw new Error("Missing Google Sheets credentials in .env file");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    if (!process.env.GOOGLE_SHEET_ID) {
      throw new Error("Missing GOOGLE_SHEET_ID in .env file");
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
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
    console.error('Error fetching data from Google Sheets:', error);
    // Rethrow with a more specific message for the client
    throw new Error(error.message || 'Failed to fetch data from Google Sheets.');
  }
}

export async function GET() {
  try {
    // The range 'Sheet1!A:F' might need to be adjusted based on your actual sheet name and data columns
    const data = await getSheetData('Sheet1!A:F');
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
