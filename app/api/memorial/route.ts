import { NextResponse } from 'next/server'

let memorialEntries = [
  { id: 1, date: '2023-05-01', description: 'Depreciation Expense', debitAccount: 'Depreciation Expense', creditAccount: 'Accumulated Depreciation', amount: 1000 },
  { id: 2, date: '2023-05-02', description: 'Accrued Interest', debitAccount: 'Interest Expense', creditAccount: 'Interest Payable', amount: 500 },
]

export async function GET() {
  return NextResponse.json(memorialEntries)
}

export async function POST(request: Request) {
  const entry = await request.json()
  memorialEntries.push({ id: memorialEntries.length + 1, ...entry })
  return NextResponse.json({ message: 'Memorial entry added successfully' }, { status: 201 })
}