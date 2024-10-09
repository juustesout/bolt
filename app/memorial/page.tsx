"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface MemorialEntry {
  id: number
  date: string
  description: string
  debitAccount: string
  creditAccount: string
  amount: number
}

export default function MemorialPage() {
  const [entries, setEntries] = useState<MemorialEntry[]>([])
  const [newEntry, setNewEntry] = useState<Partial<MemorialEntry>>({
    date: '',
    description: '',
    debitAccount: '',
    creditAccount: '',
    amount: 0,
  })

  useEffect(() => {
    fetch('/api/memorial')
      .then(response => response.json())
      .then(data => setEntries(data))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEntry(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/memorial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    })
    if (response.ok) {
      const updatedEntries = await fetch('/api/memorial').then(res => res.json())
      setEntries(updatedEntries)
      setNewEntry({ date: '', description: '', debitAccount: '', creditAccount: '', amount: 0 })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Memorial Entries</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Memorial Entry</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Memorial Entry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newEntry.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={newEntry.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="debitAccount">Debit Account</Label>
              <Input
                id="debitAccount"
                name="debitAccount"
                value={newEntry.debitAccount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="creditAccount">Credit Account</Label>
              <Input
                id="creditAccount"
                name="creditAccount"
                value={newEntry.creditAccount}
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
                value={newEntry.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit">Add Memorial Entry</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Debit Account</TableHead>
            <TableHead>Credit Account</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>{entry.debitAccount}</TableCell>
              <TableCell>{entry.creditAccount}</TableCell>
              <TableCell>${entry.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}