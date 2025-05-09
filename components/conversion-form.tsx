"use client"

import React, { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MiniKit, ResponseEvent, Tokens, tokenToDecimals } from "@worldcoin/minikit-js"

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

interface ConversionFormProps {
  selectedToken: string;
  setSelectedToken: (token: "WLD" | "USDC.e" | "ETH") => void;
  amount: string;
  setAmount: (amount: string) => void;
  balances: TokenBalance[];
  prices: TokenPrices | null;
  calculateINR: () => number;
  calculateFee: () => number;
  calculateFinal: () => number;
  onSubmit: () => void;
  minimumAmount: number;
  walletAddress: string;
}

export default function ConversionForm({
  selectedToken,
  setSelectedToken,
  amount,
  setAmount,
  balances,
  prices,
  calculateINR,
  calculateFee,
  calculateFinal,
  onSubmit,
  minimumAmount,
  walletAddress
}: ConversionFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [maxAmount, setMaxAmount] = useState<number>(0)

  // Update max amount when token or balances change
  useEffect(() => {
    if (balances && balances.length > 0) {
      const tokenBalance = balances.find(b => b.token === selectedToken)
      setMaxAmount(tokenBalance?.balance || 0)
    }
  }, [selectedToken, balances])

  // Find current token balance
  const currentTokenBalance = balances?.find(b => b.token === selectedToken)

  // Handle amount change
  const handleAmountChange = (value: string) => {
    // Allow numbers and decimal point only
    if (/^$|^\d*\.?\d*$/.test(value)) {
      setAmount(value)
      setError(null)
    }
  }

  // Set max available
  const handleSetMax = () => {
    if (maxAmount > 0) {
      // Format to 6 decimal places for display
      setAmount(maxAmount.toFixed(6))
    }
  }

  // Validate before submit
  const handleSubmit = () => {
    // Validate amount is a number
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount")
      return
    }
    
    // Validate amount is not more than available balance
    if (parsedAmount > maxAmount) {
      setError(`You don't have enough ${selectedToken}`)
      return
    }
    
    // Validate minimum amount
    const finalAmount = calculateFinal()
    if (finalAmount < minimumAmount) {
      setError(`Minimum conversion amount is ₹${minimumAmount}`)
      return
    }
    
    // All good, proceed with conversion
    onSubmit()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Convert to INR</CardTitle>
        <CardDescription>Select token and amount to convert</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="token" className="text-sm font-medium">
              Token
            </label>
            <Select
              value={selectedToken}
              onValueChange={(value) => setSelectedToken(value as "WLD" | "USDC.e" | "ETH")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WLD">WLD</SelectItem>
                <SelectItem value="USDC.e">USDC.e</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Balance: {currentTokenBalance ? currentTokenBalance.balance.toFixed(6) : '0'} {selectedToken}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount
              </label>
              <button
                type="button"
                onClick={handleSetMax}
                className="text-xs text-blue-600 dark:text-blue-400"
              >
                Max
              </button>
            </div>
            <div className="relative">
              <Input
                id="amount"
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.0"
                className="pr-16"
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {selectedToken}
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">1 {selectedToken}</span>
              <span className="font-medium">
                ₹{prices ? prices[selectedToken as keyof TokenPrices].toFixed(2) : '0.00'}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">You get (before fee)</span>
              <span className="font-medium">₹{calculateINR().toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Fee (5%)</span>
              <span className="font-medium">₹{calculateFee().toFixed(2)}</span>
            </div>
            
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
            
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">You receive</span>
              <span className="font-semibold text-lg">₹{calculateFinal().toFixed(2)}</span>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your funds will be sent to your account within 30 minutes after conversion.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Continue to Payment
        </Button>
      </CardFooter>
    </Card>
  )
}
