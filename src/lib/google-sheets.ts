import { google } from 'googleapis';

// This is the main function you will use to fetch data from your Google Sheet.
export async function getSheetData(range: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      // Your service account credentials.
      // The `process.env` values are read from your `.env` file.
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      // The scopes determine what permissions the service account has.
      // For this use case, we only need read-only access to Google Sheets.
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Here is where you would make the call to the Google Sheets API.
    // The `spreadsheetId` is your sheet's ID, and `range` is the specific
    // sheet and cells you want to read from (e.g., 'Sheet1!A1:B2').
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range, // e.g., 'Sheet1!A:E'
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      // The first row is assumed to be the header.
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
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw new Error('Failed to fetch data from Google Sheets.');
  }
}
