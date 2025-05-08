"use client"

import { useState, useEffect, useCallback } from "react"
import { MiniKit } from "@worldcoin/minikit-js"

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
      // If MiniKit is installed, in the future we could use it to get balances
      if (MiniKit.isInstalled()) {
        // TODO: In a real implementation, use chain data API or wallet SDK to fetch real balances
        // For development, we'll still use mock data
        console.log("Fetching balances for address:", address)
      }

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
