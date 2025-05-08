"use client"

import { useEffect, useState } from "react"

interface TokenBalance {
  token: string;
  balance: number;
  balanceInINR: number;
  decimals: number;
}

interface TokenPrices {
  WLD: number;
  "USDC.e": number;
  ETH: number;
}

export function useWalletBalance(address?: string) {
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [totalBalanceINR, setTotalBalanceINR] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalances = async () => {
    if (!address) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch token prices from Worldcoin API
      const priceResponse = await fetch('/api/token-prices')
      if (!priceResponse.ok) {
        throw new Error('Failed to fetch token prices')
      }
      
      const { prices } = await priceResponse.json() as { prices: TokenPrices }
      
      // Fetch WLD balance
      const wldBalanceResponse = await fetch(`/api/token-balance?address=${address}&token=WLD`)
      if (!wldBalanceResponse.ok) {
        throw new Error('Failed to fetch WLD balance')
      }
      
      const wldData = await wldBalanceResponse.json()
      
      // Fetch USDC.e balance
      const usdcBalanceResponse = await fetch(`/api/token-balance?address=${address}&token=USDC.e`)
      if (!usdcBalanceResponse.ok) {
        throw new Error('Failed to fetch USDC.e balance')
      }
      
      const usdcData = await usdcBalanceResponse.json()
      
      // Fetch ETH balance
      const ethBalanceResponse = await fetch(`/api/token-balance?address=${address}&token=ETH`)
      if (!ethBalanceResponse.ok) {
        throw new Error('Failed to fetch ETH balance')
      }
      
      const ethData = await ethBalanceResponse.json()
      
      // Format balances with INR value
      const tokenBalances: TokenBalance[] = [
        {
          token: "WLD",
          balance: wldData.balance,
          balanceInINR: wldData.balance * prices.WLD,
          decimals: 18
        },
        {
          token: "USDC.e",
          balance: usdcData.balance,
          balanceInINR: usdcData.balance * prices["USDC.e"],
          decimals: 6
        },
        {
          token: "ETH",
          balance: ethData.balance,
          balanceInINR: ethData.balance * prices.ETH,
          decimals: 18
        }
      ]
      
      // Calculate total balance in INR
      const total = tokenBalances.reduce((sum, token) => sum + token.balanceInINR, 0)
      
      setBalances(tokenBalances)
      setTotalBalanceINR(total)
    } catch (err: any) {
      console.error("Error fetching wallet balances:", err)
      setError(err.message || "Failed to fetch wallet balances")
      setBalances([])
      setTotalBalanceINR(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (address) {
      fetchBalances()
    }
  }, [address])

  return {
    balances,
    totalBalanceINR,
    isLoading,
    error,
    refresh: fetchBalances
  }
} 