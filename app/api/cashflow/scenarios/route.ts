import { NextResponse } from 'next/server'

let scenarios = [
  { id: 1, name: 'Base Scenario', data: [] },
  { id: 2, name: 'Optimistic Scenario', data: [] },
]

export async function GET() {
  return NextResponse.json(scenarios)
}

export async function POST(request: Request) {
  const newScenario = await request.json()
  scenarios.push({ id: scenarios.length + 1, ...newScenario })
  return NextResponse.json({ message: 'Scenario added successfully' }, { status: 201 })
}