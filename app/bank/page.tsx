"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface BankTransaction {
  id: number
  date: string
  description: string
  amount: number
  accountNumber: string
}

export default function BankPage() {
  const [transactions, setTransactions] = useState<BankTransaction[]>([])
  const [newTransaction, setNewTransaction] = useState<Partial<BankTransaction>>({
    date: '',
    description: '',
    amount: 0,
    accountNumber: '',
  })

  useEffect(() => {
    fetch('/api/bank')
      .then(response => response.json())
      .then(data => setTransactions(data))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewTransaction(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/bank', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTransaction),
    })
    if (response.ok) {
      const updatedTransactions = await fetch('/api/bank').then(res => res.json())
      setTransactions(updatedTransactions)
      setNewTransaction({ date: '', description: '', amount: 0, accountNumber: '' })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Bank Account Management</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Transaction</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Bank Transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={newTransaction.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                value={newTransaction.accountNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit">Add Transaction</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Account Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>${transaction.amount.toFixed(2)}</TableCell>
              <TableCell>{transaction.accountNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}