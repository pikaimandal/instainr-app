"use client"

import type React from "react"

import { useState } from "react"

export default function BuyWithINRForm() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic email validation
    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    // In a real app, this would send the email to your backend
    console.log("Email submitted:", email)

    // Show success message
    setIsSubmitted(true)
    setError(null)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Buy with INR</h2>

      {isSubmitted ? (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
          <p className="text-green-800 dark:text-green-300 text-center">
            Thank you! We'll notify you when InstaINR launches the Buy with INR feature.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The Buy with INR feature is coming soon! Sign up to be notified when it launches.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                className={`w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
                  error ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="your@email.com"
              />
              {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Sign Up
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
