import { NextResponse } from 'next/server'

// Mock data for demonstration
const vatRates = [
  { id: 1, name: 'Standard Rate', rate: 20 },
  { id: 2, name: 'Reduced Rate', rate: 5 },
  { id: 3, name: 'Zero Rate', rate: 0 },
]

export async function GET() {
  return NextResponse.json(vatRates)
}

export async function POST(request: Request) {
  try {
    const newRate = await request.json()
    // In a real app, you would save this to a database
    vatRates.push({ id: vatRates.length + 1, ...newRate })
    return NextResponse.json({ message: 'VAT rate added successfully' }, { status: 201 })
  } catch (error) {
    console.error('Error processing VAT rate:', error)
    return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 })
  }
}