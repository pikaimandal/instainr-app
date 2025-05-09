"use client"

import { useState } from 'react'
import { MOCK_DATA } from '@/lib/config'

// Use mock token data from config
const mockTokens = MOCK_DATA.tokens;

export function useMockBalance() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Return mock balances data
  const getBalances = () => {
    setLoading(true)
    
    return new Promise<typeof mockTokens>((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        setLoading(false)
        resolve(mockTokens)
      }, 800)
    })
  }
  
  // Get a specific token's mock balance
  const getTokenBalance = (symbol: string) => {
    return mockTokens[symbol as keyof typeof mockTokens] || null
  }
  
  return {
    balances: mockTokens,
    loading,
    error,
    getBalances,
    getTokenBalance
  }
} 