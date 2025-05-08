"use client"

import { useState } from "react"

interface Transaction {
  id: string
  token: string
  amount: number
  inrAmount: number
  status: "pending" | "completed" | "failed"
  timestamp: string
}

export function useSupabase(address?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const saveWithdrawalDetails = async (details: any) => {
    if (!address) {
      console.error("No wallet address provided for withdrawal")
      return false
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, ...details }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save withdrawal details')
      }
      
      const data = await response.json()
      return data.success
    } catch (error) {
      console.error("Error saving withdrawal details:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getTransactionHistory = async () => {
    if (!address) return
    
    setIsLoading(true)

    try {
      // Fetch transactions from our API
      const response = await fetch(`/api/transactions?address=${address}`)
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }
      
      const data = await response.json()
      setTransactions(data.transactions)
    } catch (error) {
      console.error("Error fetching transaction history:", error)
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    saveWithdrawalDetails,
    getTransactionHistory,
    transactions,
    isLoading,
  }
}
