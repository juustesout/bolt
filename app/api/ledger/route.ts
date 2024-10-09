import { NextResponse } from 'next/server'
import { addDocument, getDocuments } from '@/lib/firebaseCrud'

export async function GET() {
  try {
    const ledgerEntries = await getDocuments('ledger');
    return NextResponse.json(ledgerEntries);
  } catch (error) {
    console.error('Error fetching ledger entries:', error);
    return NextResponse.json({ error: 'Failed to fetch ledger entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const entry = await request.json();
    const docId = await addDocument('ledger', entry);
    return NextResponse.json({ id: docId, ...entry }, { status: 201 });
  } catch (error) {
    console.error('Error adding ledger entry:', error);
    return NextResponse.json({ error: 'Failed to add ledger entry' }, { status: 500 });
  }
}