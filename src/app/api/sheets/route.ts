
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

async function getSheetData(range: string) {
  try {
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GOOGLE_SHEETS_API_KEY in .env file");
    }

    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) {
      throw new Error("Missing GOOGLE_SHEET_ID in .env file");
    }

    const sheets = google.sheets({ version: 'v4', auth: apiKey });

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
    // Provide a more user-friendly error message
    if (error.code === 403) {
        throw new Error("Permission denied. Please ensure the Google Sheet is public ('Anyone with the link can view') and the Google Sheets API is enabled.");
    }
    throw new Error('Failed to fetch data from Google Sheets. Please check your API Key and Sheet ID.');
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
