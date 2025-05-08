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
        // Fetch token prices from our API
        const response = await fetch('/api/token-prices')
        if (!response.ok) {
          throw new Error('Failed to fetch token prices')
        }
        
        const data = await response.json()
        setPrices(data.prices)
      } catch (error) {
        console.error("Error fetching token prices:", error)
        
        // Use fallback prices if API fails
        setPrices({
          WLD: 1250.75,
          "USDC.e": 83.38,
          ETH: 250150.5,
        })
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
