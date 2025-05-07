"use client"

import { useState, useEffect, useCallback } from "react"

export function useWalletBalances(address?: string) {
  const [balances, setBalances] = useState<{
    WLD: number
    "USDC.e": number
    ETH: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const fetchBalances = useCallback(async () => {
    if (!address) {
      return
    }

    // Only show loading state on initial load
    if (isInitialLoad) {
      setIsLoading(true)
    }

    try {
      // TODO: In a real implementation, this would fetch from blockchain or indexer
      // For demo purposes, we'll use mock data

      // Mock API call delay - shorter for background refreshes
      await new Promise((resolve) => setTimeout(resolve, isInitialLoad ? 1500 : 500))

      // Mock balances
      const mockBalances = {
        WLD: 2.5,
        "USDC.e": 100,
        ETH: 0.05,
      }

      setBalances(mockBalances)
      setIsInitialLoad(false)
    } catch (error) {
      console.error("Error fetching wallet balances:", error)
    } finally {
      setIsLoading(false)
    }
  }, [address, isInitialLoad])

  // Initial fetch
  useEffect(() => {
    if (address) {
      fetchBalances()
    }
  }, [address, fetchBalances])

  return {
    balances,
    isLoading,
    refreshBalances: fetchBalances,
  }
}
