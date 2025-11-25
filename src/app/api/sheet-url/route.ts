
import { NextResponse } from 'next/server';

export async function GET() {
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    return NextResponse.json({ error: 'Google Sheet ID not configured.' }, { status: 500 });
  }

  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}`;
  
  return NextResponse.json({ url: sheetUrl });
}
