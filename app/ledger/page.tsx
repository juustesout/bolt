"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface LedgerEntry {
  id: number
  date: string
  description: string
  debit: number
  credit: number
  account: string
}

export default function LedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([])
  const [newEntry, setNewEntry] = useState<Partial<LedgerEntry>>({
    date: '',
    description: '',
    debit: 0,
    credit: 0,
    account: '',
  })

  useEffect(() => {
    fetch('/api/ledger')
      .then(response => response.json())
      .then(data => setEntries(data))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEntry(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/ledger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    })
    if (response.ok) {
      const updatedEntries = await fetch('/api/ledger').then(res => res.json())
      setEntries(updatedEntries)
      setNewEntry({ date: '', description: '', debit: 0, credit: 0, account: '' })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Ledger</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Entry</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Ledger Entry</DialogTitle>
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
              <Label htmlFor="debit">Debit</Label>
              <Input
                id="debit"
                name="debit"
                type="number"
                value={newEntry.debit}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="credit">Credit</Label>
              <Input
                id="credit"
                name="credit"
                type="number"
                value={newEntry.credit}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="account">Account</Label>
              <Input
                id="account"
                name="account"
                value={newEntry.account}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit">Add Entry</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Debit</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead>Account</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>{entry.debit}</TableCell>
              <TableCell>{entry.credit}</TableCell>
              <TableCell>{entry.account}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}