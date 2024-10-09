"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface CashflowData {
  month: string
  income: number
  expenses: number
}

interface CashflowScenario {
  id: number
  name: string
  data: CashflowData[]
}

export default function CashflowPage() {
  const [cashflowData, setCashflowData] = useState<CashflowData[]>([])
  const [newData, setNewData] = useState<Partial<CashflowData>>({ month: '', income: 0, expenses: 0 })
  const [scenarios, setScenarios] = useState<CashflowScenario[]>([])
  const [currentScenario, setCurrentScenario] = useState<CashflowScenario | null>(null)
  const [newScenarioName, setNewScenarioName] = useState('')
  const [forecastMethod, setForecastMethod] = useState<'linear' | 'average'>('linear')

  useEffect(() => {
    fetch('/api/cashflow')
      .then(response => response.json())
      .then(data => setCashflowData(data))
    
    fetch('/api/cashflow/scenarios')
      .then(response => response.json())
      .then(data => setScenarios(data))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewData(prev => ({ ...prev, [name]: name === 'month' ? value : parseFloat(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/cashflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    })
    if (response.ok) {
      const updatedData = await fetch('/api/cashflow').then(res => res.json())
      setCashflowData(updatedData)
      setNewData({ month: '', income: 0, expenses: 0 })
    }
  }

  const calculateNetCashflow = (income: number, expenses: number) => income - expenses

  const createNewScenario = async () => {
    if (newScenarioName) {
      const response = await fetch('/api/cashflow/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newScenarioName, data: cashflowData }),
      })
      if (response.ok) {
        const updatedScenarios = await fetch('/api/cashflow/scenarios').then(res => res.json())
        setScenarios(updatedScenarios)
        setNewScenarioName('')
      }
    }
  }

  const loadScenario = (scenarioId: number) => {
    const scenario = scenarios.find(s => s.id === scenarioId)
    if (scenario) {
      setCurrentScenario(scenario)
      setCashflowData(scenario.data)
    }
  }

  const generateForecast = () => {
    const lastTwelveMonths = cashflowData.slice(-12)
    const forecast: CashflowData[] = []

    for (let i = 1; i <= 12; i++) {
      const forecastMonth = new Date(lastTwelveMonths[lastTwelveMonths.length - 1].month)
      forecastMonth.setMonth(forecastMonth.getMonth() + i)
      
      let forecastedIncome: number
      let forecastedExpenses: number

      if (forecastMethod === 'linear') {
        // Simple linear regression
        const xValues = lastTwelveMonths.map((_, index) => index)
        const yIncomeValues = lastTwelveMonths.map(d => d.income)
        const yExpensesValues = lastTwelveMonths.map(d => d.expenses)

        const incomeSlope = calculateSlope(xValues, yIncomeValues)
        const expensesSlope = calculateSlope(xValues, yExpensesValues)

        forecastedIncome = yIncomeValues[yIncomeValues.length - 1] + incomeSlope * i
        forecastedExpenses = yExpensesValues[yExpensesValues.length - 1] + expensesSlope * i
      } else {
        // Moving average
        forecastedIncome = lastTwelveMonths.reduce((sum, d) => sum + d.income, 0) / 12
        forecastedExpenses = lastTwelveMonths.reduce((sum, d) => sum + d.expenses, 0) / 12
      }

      forecast.push({
        month: forecastMonth.toISOString().slice(0, 7),
        income: Math.max(0, forecastedIncome),
        expenses: Math.max(0, forecastedExpenses),
      })
    }

    setCashflowData([...cashflowData, ...forecast])
  }

  const calculateSlope = (x: number[], y: number[]) => {
    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Cashflow Statement and Prognosis</h1>
      
      {/* Cashflow Data Input Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Add Cashflow Data</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Cashflow Data</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Cashflow Data</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  name="month"
                  type="month"
                  value={newData.month}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="income">Income</Label>
                <Input
                  id="income"
                  name="income"
                  type="number"
                  value={newData.income}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="expenses">Expenses</Label>
                <Input
                  id="expenses"
                  name="expenses"
                  type="number"
                  value={newData.expenses}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit">Add Data</Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      {/* Cashflow Chart Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Cashflow Chart</h2>
        <Card>
          <CardHeader>
            <CardTitle>Cashflow Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={cashflowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#8884d8" name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
                <Line type="monotone" dataKey={(data) => calculateNetCashflow(data.income, data.expenses)} stroke="#ffc658" name="Net Cashflow" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Cashflow Table Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Cashflow Table</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Income</TableHead>
              <TableHead>Expenses</TableHead>
              <TableHead>Net Cashflow</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cashflowData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.month}</TableCell>
                <TableCell>${data.income.toFixed(2)}</TableCell>
                <TableCell>${data.expenses.toFixed(2)}</TableCell>
                <TableCell>${calculateNetCashflow(data.income, data.expenses).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* Cashflow Scenarios Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Cashflow Scenarios</h2>
        <Card>
          <CardHeader>
            <CardTitle>Manage Scenarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="New Scenario Name"
                value={newScenarioName}
                onChange={(e) => setNewScenarioName(e.target.value)}
              />
              <Button onClick={createNewScenario}>Create Scenario</Button>
            </div>
            <Select onValueChange={(value) => loadScenario(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a scenario" />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id.toString()}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentScenario && (
              <p>Current Scenario: {currentScenario.name}</p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Cashflow Forecast Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Cashflow Forecast</h2>
        <Card>
          <CardHeader>
            <CardTitle>Generate Forecast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={(value) => setForecastMethod(value as 'linear' | 'average')}>
              <SelectTrigger>
                <SelectValue placeholder="Select forecast method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear Regression</SelectItem>
                <SelectItem value="average">Moving Average</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateForecast}>Generate 12-Month Forecast</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}