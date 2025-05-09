"use client"

import { useState } from 'react'

// Mock token data for testing
const mockTokens = {
  WLD: {
    symbol: 'WLD',
    name: 'Worldcoin',
    balance: 10.5,
    price: 75.25 // INR price per token
  },
  USDC: {
    symbol: 'USDC.e',
    name: 'USD Coin',
    balance: 25.0,
    price: 82.86 // INR price per token
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 0.15,
    price: 223450.75 // INR price per token
  }
}

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