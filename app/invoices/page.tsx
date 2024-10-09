"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Invoice {
  id: number
  date: string
  type: 'in' | 'out'
  customerName?: string
  supplierName?: string
  amount: number
  vatAmount: number
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    date: '',
    type: 'out',
    customerName: '',
    supplierName: '',
    amount: 0,
    vatAmount: 0,
  })

  useEffect(() => {
    fetch('/api/invoices')
      .then(response => response.json())
      .then(data => setInvoices(data))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewInvoice(prev => ({ ...prev, [name]: ['amount', 'vatAmount'].includes(name) ? parseFloat(value) : value }))
  }

  const handleSelectChange = (value: string) => {
    setNewInvoice(prev => ({ ...prev, type: value as 'in' | 'out' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInvoice),
    })
    if (response.ok) {
      const updatedInvoices = await fetch('/api/invoices').then(res => res.json())
      setInvoices(updatedInvoices)
      setNewInvoice({ date: '', type: 'out', customerName: '', supplierName: '', amount: 0, vatAmount: 0 })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Invoices</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Invoice</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Invoice</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newInvoice.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={handleSelectChange} defaultValue={newInvoice.type}>
                <SelectTrigger>
                  <SelectValue placeholder="Select invoice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Invoice In</SelectItem>
                  <SelectItem value="out">Invoice Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newInvoice.type === 'out' ? (
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={newInvoice.customerName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="supplierName">Supplier Name</Label>
                <Input
                  id="supplierName"
                  name="supplierName"
                  value={newInvoice.supplierName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={newInvoice.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="vatAmount">VAT Amount</Label>
              <Input
                id="vatAmount"
                name="vatAmount"
                type="number"
                step="0.01"
                value={newInvoice.vatAmount}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit">Add Invoice</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Customer/Supplier</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>VAT Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>{invoice.type === 'in' ? 'Invoice In' : 'Invoice Out'}</TableCell>
              <TableCell>{invoice.type === 'in' ? invoice.supplierName : invoice.customerName}</TableCell>
              <TableCell>${invoice.amount.toFixed(2)}</TableCell>
              <TableCell>${invoice.vatAmount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}