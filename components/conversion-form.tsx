"use client"

import type React from "react"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ConversionFormProps {
  selectedToken: "WLD" | "USDC.e" | "ETH"
  setSelectedToken: (token: "WLD" | "USDC.e" | "ETH") => void
  amount: string
  setAmount: (amount: string) => void
  balances: {
    WLD: number
    "USDC.e": number
    ETH: number
  } | null
  prices: {
    WLD: number
    "USDC.e": number
    ETH: number
  } | null
  calculateINR: () => number
  calculateFee: () => number
  calculateFinal: () => number
  onSubmit: () => void
  minimumAmount: number
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
}: ConversionFormProps) {
  const [error, setError] = useState<string | null>(null)

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
      setError(null)
    }
  }

  const handleMaxClick = () => {
    if (balances) {
      setAmount(balances[selectedToken].toString())
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter an amount")
      return
    }

    if (balances && Number.parseFloat(amount) > balances[selectedToken]) {
      setError("Insufficient balance")
      return
    }

    const finalAmount = calculateFinal()
    if (finalAmount < minimumAmount) {
      setError(`Minimum conversion amount is ₹${minimumAmount}`)
      return
    }

    onSubmit()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Convert to INR</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Token</label>
          <Select value={selectedToken} onValueChange={(value) => setSelectedToken(value as "WLD" | "USDC.e" | "ETH")}>
            <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WLD">WLD</SelectItem>
              <SelectItem value="USDC.e">USDC.e</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
            {balances && (
              <button
                type="button"
                onClick={handleMaxClick}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                MAX: {balances[selectedToken].toFixed(4)}
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={`w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
                error ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="0.00"
            />
          </div>
          {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">INR Value</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">₹{calculateINR().toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">InstaINR Fee (5%)</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">₹{calculateFee().toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">You'll Receive</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">₹{calculateFinal().toFixed(2)}</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Minimum conversion amount: ₹{minimumAmount}
          </div>
        </div>

        <button
          type="submit"
          disabled={!amount || Number.parseFloat(amount) <= 0}
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Convert to INR
        </button>
      </form>
    </div>
  )
}
