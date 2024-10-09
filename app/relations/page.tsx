"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Relation {
  id: number
  name: string
  type: 'customer' | 'supplier'
  contactPerson: string
  email: string
  phone: string
}

export default function RelationsPage() {
  const [relations, setRelations] = useState<Relation[]>([])
  const [newRelation, setNewRelation] = useState<Partial<Relation>>({
    name: '',
    type: 'customer',
    contactPerson: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    fetch('/api/relations')
      .then(response => response.json())
      .then(data => setRelations(data))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewRelation(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setNewRelation(prev => ({ ...prev, type: value as 'customer' | 'supplier' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/relations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRelation),
    })
    if (response.ok) {
      const updatedRelations = await fetch('/api/relations').then(res => res.json())
      setRelations(updatedRelations)
      setNewRelation({ name: '', type: 'customer', contactPerson: '', email: '', phone: '' })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Relations (Creditors and Debtors)</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Relation</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Relation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newRelation.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={handleSelectChange} defaultValue={newRelation.type}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={newRelation.contactPerson}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newRelation.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={newRelation.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit">Add Relation</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {relations.map((relation) => (
            <TableRow key={relation.id}>
              <TableCell>{relation.name}</TableCell>
              <TableCell>{relation.type}</TableCell>
              <TableCell>{relation.contactPerson}</TableCell>
              <TableCell>{relation.email}</TableCell>
              <TableCell>{relation.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}