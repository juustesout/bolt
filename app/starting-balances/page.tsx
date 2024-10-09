"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface StartingBalance {
  id: number
  account: string
  balance: number
}

export default function StartingBalancesPage() {
  const [balances, setBalances] = useState<StartingBalance[]>([])
  const [newBalance, setNewBalance] = useState<Partial<StartingBalance>>({
    account: '',
    balance: 0,
  })

  useEffect(() => {
    fetch('/api/starting-balances')
      .then(response => response.json())
      .then(data => setBalances(data))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewBalance(prev => ({ ...prev, [name]: name === 'balance' ? parseFloat(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/starting-balances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBalance),
    })
    if (response.ok) {
      const updatedBalances = await fetch('/api/starting-balances').then(res => res.json())
      setBalances(updatedBalances)
      setNewBalance({ account: '', balance: 0 })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Starting Balances</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Starting Balance</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Starting Balance</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="account">Account</Label>
              <Input
                id="account"
                name="account"
                value={newBalance.account}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="balance">Balance</Label>
              <Input
                id="balance"
                name="balance"
                type="number"
                step="0.01"
                value={newBalance.balance}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit">Add Starting Balance</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead>Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {balances.map((balance) => (
            <TableRow key={balance.id}>
              <TableCell>{balance.account}</TableCell>
              <TableCell>${balance.balance.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}