import { NextResponse } from 'next/server'

let startingBalances = [
  { id: 1, account: 'Cash', balance: 10000 },
  { id: 2, account: 'Accounts Receivable', balance: 5000 },
  { id: 3, account: 'Inventory', balance: 15000 },
  { id: 4, account: 'Accounts Payable', balance: -3000 },
]

export async function GET() {
  return NextResponse.json(startingBalances)
}

export async function POST(request: Request) {
  const balance = await request.json()
  startingBalances.push({ id: startingBalances.length + 1, ...balance })
  return NextResponse.json({ message: 'Starting balance added successfully' }, { status: 201 })
}