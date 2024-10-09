"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

// ... (keep the existing interface definitions)

export default function VATPage() {
  // ... (keep the existing state definitions)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/vat')
        if (!response.ok) {
          throw new Error('Failed to fetch VAT rates')
        }
        const data = await response.json()
        setVatRates(data)
      } catch (error) {
        console.error('Error fetching VAT rates:', error)
        toast({
          title: "Error",
          description: "Failed to load VAT rates. Please try again later.",
          variant: "destructive",
        })
      }
    }

    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/vat/transactions')
        if (!response.ok) {
          throw new Error('Failed to fetch VAT transactions')
        }
        const data = await response.json()
        setVatTransactions(data)
      } catch (error) {
        console.error('Error fetching VAT transactions:', error)
        toast({
          title: "Error",
          description: "Failed to load VAT transactions. Please try again later.",
          variant: "destructive",
        })
      }
    }

    fetchData()
    fetchTransactions()
  }, [])

  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/vat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRate),
      })
      if (!response.ok) {
        throw new Error('Failed to add VAT rate')
      }
      const updatedRates = await fetch('/api/vat').then(res => res.json())
      setVatRates(updatedRates)
      setNewRate({ name: '', rate: 0 })
      toast({
        title: "Success",
        description: "VAT rate added successfully.",
      })
    } catch (error) {
      console.error('Error adding VAT rate:', error)
      toast({
        title: "Error",
        description: "Failed to add VAT rate. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/vat/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      })
      if (!response.ok) {
        throw new Error('Failed to add VAT transaction')
      }
      const updatedTransactions = await fetch('/api/vat/transactions').then(res => res.json())
      setVatTransactions(updatedTransactions)
      setNewTransaction({ date: '', description: '', amount: 0, vatAmount: 0, type: 'input' })
      toast({
        title: "Success",
        description: "VAT transaction added successfully.",
      })
    } catch (error) {
      console.error('Error adding VAT transaction:', error)
      toast({
        title: "Error",
        description: "Failed to add VAT transaction. Please try again.",
        variant: "destructive",
      })
    }
  }

  // ... (keep the rest of the component code)

  return (
    // ... (keep the existing JSX)
  )
}