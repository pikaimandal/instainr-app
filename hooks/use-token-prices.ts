"use client"

import { useState, useEffect } from "react"

export function useTokenPrices() {
  const [prices, setPrices] = useState<{
    WLD: number
    "USDC.e": number
    ETH: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoading(true)

      try {
        // TODO: In a real implementation, this would fetch from CoinGecko API
        // For demo purposes, we'll use mock data

        // Mock API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock prices in INR
        const mockPrices = {
          WLD: 1250.75, // ~$15 USD
          "USDC.e": 83.38, // ~$1 USD
          ETH: 250150.5, // ~$3000 USD
        }

        setPrices(mockPrices)
      } catch (error) {
        console.error("Error fetching token prices:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrices()

    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000)

    return () => clearInterval(interval)
  }, [])

  return { prices, isLoading }
}
