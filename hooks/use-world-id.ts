"use client"

import { useState, useEffect } from "react"

export function useWorldID() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize Worldcoin Minikit
  useEffect(() => {
    // Load Worldcoin Minikit script
    const script = document.createElement("script")
    script.src = "https://cdn.worldcoin.org/minikit/v0.1.0/minikit.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const connect = async () => {
    setIsLoading(true)

    try {
      // TODO: In a real implementation, this would use the actual Worldcoin Minikit
      // For demo purposes, we'll simulate a successful connection after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock address - in a real app, this would come from the Worldcoin Minikit
      const mockAddress =
        "0x" +
        Array(40)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("")

      setAddress(mockAddress)
      setIsConnected(true)

      // Store in localStorage for persistence
      localStorage.setItem("worldcoin_connected", "true")
      localStorage.setItem("worldcoin_address", mockAddress)
    } catch (error) {
      console.error("Error connecting to World ID:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(undefined)

    // Remove from localStorage
    localStorage.removeItem("worldcoin_connected")
    localStorage.removeItem("worldcoin_address")
  }

  // Check for existing connection on mount
  useEffect(() => {
    const connected = localStorage.getItem("worldcoin_connected") === "true"
    const savedAddress = localStorage.getItem("worldcoin_address")

    if (connected && savedAddress) {
      setIsConnected(true)
      setAddress(savedAddress)
    }
  }, [])

  return {
    isConnected,
    address,
    connect,
    disconnect,
    isLoading,
  }
}
