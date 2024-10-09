import { NextResponse } from 'next/server'
import { addDocument, getDocuments } from '@/lib/firebaseCrud'

export async function GET() {
  try {
    const relations = await getDocuments('relations');
    return NextResponse.json(relations);
  } catch (error) {
    console.error('Error fetching relations:', error);
    return NextResponse.json({ error: 'Failed to fetch relations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const relation = await request.json();
    const docId = await addDocument('relations', relation);
    return NextResponse.json({ id: docId, ...relation }, { status: 201 });
  } catch (error) {
    console.error('Error adding relation:', error);
    return NextResponse.json({ error: 'Failed to add relation' }, { status: 500 });
  }
}