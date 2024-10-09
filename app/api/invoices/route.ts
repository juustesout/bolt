import { NextResponse } from 'next/server'
import { addDocument, getDocuments } from '@/lib/firebaseCrud'

export async function GET() {
  try {
    const invoices = await getDocuments('invoices');
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const invoice = await request.json();
    const docId = await addDocument('invoices', invoice);
    return NextResponse.json({ id: docId, ...invoice }, { status: 201 });
  } catch (error) {
    console.error('Error adding invoice:', error);
    return NextResponse.json({ error: 'Failed to add invoice' }, { status: 500 });
  }
}