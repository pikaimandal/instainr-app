"use client"

import { useState, useEffect, useCallback } from "react"
import { MiniKit, ResponseEvent, MiniAppWalletAuthSuccessPayload } from "@worldcoin/minikit-js"

export function useWorldID() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [nonce, setNonce] = useState<string | null>(null)

  // Check for existing connection on mount
  useEffect(() => {
    const connected = localStorage.getItem("worldcoin_connected") === "true"
    const savedAddress = localStorage.getItem("worldcoin_address")

    if (connected && savedAddress) {
      setIsConnected(true)
      setAddress(savedAddress)
    }
  }, [])

  // Set up wallet auth listener
  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      return
    }

    // Subscribe to wallet auth events
    MiniKit.subscribe(ResponseEvent.MiniAppWalletAuth, async (payload: any) => {
      if (payload.status === 'error') {
        console.error("Wallet auth error:", payload.error)
        setIsLoading(false)
        return
      }
      
      // Success payload
      const successPayload = payload as MiniAppWalletAuthSuccessPayload
      
      try {
        // Verify the authentication on the backend
        const response = await fetch('/api/complete-siwe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload: successPayload, nonce }),
        })
        
        const data = await response.json()
        
        if (data.isValid) {
          // Set the wallet address
          setAddress(successPayload.address)
          setIsConnected(true)
          
          // Store in localStorage for persistence
          localStorage.setItem("worldcoin_connected", "true")
          localStorage.setItem("worldcoin_address", successPayload.address)
        } else {
          console.error("Failed to verify wallet authentication:", data.message)
        }
      } catch (error) {
        console.error("Error verifying wallet authentication:", error)
      } finally {
        setIsLoading(false)
      }
    })

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppWalletAuth)
    }
  }, [nonce])

  const connect = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      console.error("MiniKit not installed, cannot connect wallet")
      return
    }

    setIsLoading(true)

    try {
      // Get nonce from backend
      const res = await fetch(`/api/nonce`)
      const { nonce: newNonce } = await res.json()
      setNonce(newNonce)
      
      // Initiate wallet auth
      MiniKit.commands.walletAuth({
        nonce: newNonce,
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement: 'Sign in to InstaINR to convert your tokens to INR',
      })
      
      // Response will be handled by the subscription
    } catch (error) {
      console.error("Error connecting to World ID:", error)
      setIsLoading(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAddress(undefined)

    // Remove from localStorage
    localStorage.removeItem("worldcoin_connected")
    localStorage.removeItem("worldcoin_address")
  }, [])

  return {
    isConnected,
    address,
    connect,
    disconnect,
    isLoading,
  }
}
