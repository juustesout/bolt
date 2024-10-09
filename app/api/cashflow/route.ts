import { NextResponse } from 'next/server'

// Mock data for demonstration
const cashflowData = [
  { month: 'Jan', income: 10000, expenses: 8000 },
  { month: 'Feb', income: 12000, expenses: 9000 },
  { month: 'Mar', income: 15000, expenses: 10000 },
  { month: 'Apr', income: 13000, expenses: 9500 },
  { month: 'May', income: 14000, expenses: 10500 },
  { month: 'Jun', income: 16000, expenses: 11000 },
  { month: 'Jul', income: 18000, expenses: 12000 },
  { month: 'Aug', income: 17000, expenses: 11500 },
  { month: 'Sep', income: 19000, expenses: 13000 },
  { month: 'Oct', income: 20000, expenses: 14000 },
  { month: 'Nov', income: 21000, expenses: 15000 },
  { month: 'Dec', income: 22000, expenses: 16000 },
]

export async function GET() {
  return NextResponse.json(cashflowData)
}

export async function POST(request: Request) {
  const newData = await request.json()
  // In a real app, you would save this to a database
  cashflowData.push(newData)
  return NextResponse.json({ message: 'Cashflow data added successfully' }, { status: 201 })
}