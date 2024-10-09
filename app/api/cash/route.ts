import { NextResponse } from 'next/server'
import { addDocument, getDocuments } from '@/lib/firebaseCrud'

export async function GET() {
  try {
    const cashTransactions = await getDocuments('cash');
    return NextResponse.json(cashTransactions);
  } catch (error) {
    console.error('Error fetching cash transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch cash transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const transaction = await request.json();
    const docId = await addDocument('cash', transaction);
    return NextResponse.json({ id: docId, ...transaction }, { status: 201 });
  } catch (error) {
    console.error('Error adding cash transaction:', error);
    return NextResponse.json({ error: 'Failed to add cash transaction' }, { status: 500 });
  }
}