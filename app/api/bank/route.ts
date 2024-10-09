import { NextResponse } from 'next/server'
import { addDocument, getDocuments } from '@/lib/firebaseCrud'

export async function GET() {
  try {
    const bankTransactions = await getDocuments('bank');
    return NextResponse.json(bankTransactions);
  } catch (error) {
    console.error('Error fetching bank transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch bank transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const transaction = await request.json();
    const docId = await addDocument('bank', transaction);
    return NextResponse.json({ id: docId, ...transaction }, { status: 201 });
  } catch (error) {
    console.error('Error adding bank transaction:', error);
    return NextResponse.json({ error: 'Failed to add bank transaction' }, { status: 500 });
  }
}