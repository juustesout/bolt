import { NextResponse } from 'next/server'

let vatTransactions = [
  { id: 1, date: '2023-05-01', description: 'Office Supplies', amount: 1000, vatAmount: 200, type: 'input' },
  { id: 2, date: '2023-05-02', description: 'Consulting Services', amount: 5000, vatAmount: 1000, type: 'output' },
]

export async function GET() {
  return NextResponse.json(vatTransactions)
}

export async function POST(request: Request) {
  const transaction = await request.json()
  vatTransactions.push({ id: vatTransactions.length + 1, ...transaction })
  return NextResponse.json({ message: 'VAT transaction added successfully' }, { status: 201 })
}