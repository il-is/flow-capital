import { NextRequest, NextResponse } from 'next/server';
import { submitLeadToGoogleSheet } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, comment } = data;
    await submitLeadToGoogleSheet({ name, email, phone, comment });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 