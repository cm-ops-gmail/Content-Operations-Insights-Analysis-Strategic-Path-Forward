
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const sheetNames = [
  'SMD Analysis [Monthwise]',
  'QAC Analysis [Monthwise]',
  'CM Analysis [Monthwise]',
  'Class_OPS Analysis [Monthwise]',
  'Details',
];

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const ranges = sheetNames.map(name => `'${name}'!A:I`); 

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      ranges,
    });
    
    const valueRanges = response.data.valueRanges;

    if (valueRanges && valueRanges.length > 0) {
      const result = valueRanges.reduce((acc, valueRange, index) => {
        const sheetName = sheetNames[index];
        // Extract sheet name from range string like "'Sheet Name'!A:I"
        const nameMatch = valueRange.range?.match(/'?([^!]+)'?!/);
        if (nameMatch) {
            const cleanName = nameMatch[1];
            acc[cleanName] = valueRange.values || [];
        }
        return acc;
      }, {} as Record<string, any[][]>);
      return NextResponse.json(result);
    }

    return NextResponse.json({});

  } catch (error: any) {
    console.error('Error fetching from Google Sheets API:', error);
    let errorMessage = 'Failed to fetch data from Google Sheets.';
    if (error.response && error.response.data && error.response.data.error) {
      const googleError = error.response.data.error;
      errorMessage = googleError.message || errorMessage;
      if (googleError.status === 'PERMISSION_DENIED') {
        errorMessage = `Permission Denied. Please ensure the service account '${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}' has 'Editor' permissions on your Google Sheet and that the Google Sheets API is enabled in your Google Cloud project.`;
      }
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
