"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WithdrawalFormProps {
  amount: number
  onSubmit: (data: {
    withdrawalMethod: string
    upiId?: string
    phonepeNumber?: string
    gpayNumber?: string
    paytmNumber?: string
    bankAccount?: {
      accountNumber: string
      ifscCode: string
      accountName: string
      bankName: string
    }
    verificationMethod: "aadhaar" | "pan"
    verificationNumber: string
  }) => void
}

export default function WithdrawalForm({ amount, onSubmit }: WithdrawalFormProps) {
  const [withdrawalMethod, setWithdrawalMethod] = useState<"upi" | "phonepe" | "gpay" | "paytm" | "bank">("upi")
  const [upiId, setUpiId] = useState("")
  const [phonepeNumber, setPhonepeNumber] = useState("")
  const [gpayNumber, setGpayNumber] = useState("")
  const [paytmNumber, setPaytmNumber] = useState("")
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    accountName: "",
    bankName: "",
  })
  const [verificationMethod, setVerificationMethod] = useState<"aadhaar" | "pan">("aadhaar")
  const [verificationNumber, setVerificationNumber] = useState("")
  const [formattedVerificationNumber, setFormattedVerificationNumber] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Format Aadhaar number with spaces
  useEffect(() => {
    if (verificationMethod === "aadhaar") {
      // Remove all spaces first
      const digitsOnly = verificationNumber.replace(/\s/g, "")

      // Format with spaces after every 4 digits
      let formatted = ""
      for (let i = 0; i < digitsOnly.length && i < 12; i++) {
        if (i > 0 && i % 4 === 0) {
          formatted += " "
        }
        formatted += digitsOnly[i]
      }

      setFormattedVerificationNumber(formatted)
    } else {
      // For PAN, just convert to uppercase
      setFormattedVerificationNumber(verificationNumber.toUpperCase())
    }
  }, [verificationNumber, verificationMethod])

  const handleVerificationNumberChange = (value: string) => {
    if (verificationMethod === "aadhaar") {
      // Only allow digits and limit to 12 digits (excluding spaces)
      const digitsOnly = value.replace(/\s/g, "")
      if (/^\d*$/.test(digitsOnly) && digitsOnly.length <= 12) {
        setVerificationNumber(digitsOnly)
      }
    } else if (verificationMethod === "pan") {
      // PAN format: 5 letters, 4 digits, 1 letter
      const upperValue = value.toUpperCase()
      if (/^[A-Z0-9]*$/.test(upperValue) && upperValue.length <= 10) {
        setVerificationNumber(upperValue)
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate based on withdrawal method
    if (withdrawalMethod === "upi") {
      if (!upiId) {
        newErrors.upiId = "UPI ID is required"
      } else if (!upiId.includes("@")) {
        newErrors.upiId = "Please enter a valid UPI ID"
      }
    } else if (withdrawalMethod === "phonepe") {
      if (!phonepeNumber) {
        newErrors.phonepeNumber = "PhonePe number is required"
      } else if (!/^\d{10}$/.test(phonepeNumber)) {
        newErrors.phonepeNumber = "Please enter a valid 10-digit number"
      }
    } else if (withdrawalMethod === "gpay") {
      if (!gpayNumber) {
        newErrors.gpayNumber = "Google Pay number is required"
      } else if (!/^\d{10}$/.test(gpayNumber)) {
        newErrors.gpayNumber = "Please enter a valid 10-digit number"
      }
    } else if (withdrawalMethod === "paytm") {
      if (!paytmNumber) {
        newErrors.paytmNumber = "Paytm number is required"
      } else if (!/^\d{10}$/.test(paytmNumber)) {
        newErrors.paytmNumber = "Please enter a valid 10-digit number"
      }
    } else if (withdrawalMethod === "bank") {
      if (!bankDetails.bankName) {
        newErrors.bankName = "Bank name is required"
      }
      if (!bankDetails.accountNumber) {
        newErrors.accountNumber = "Account number is required"
      }
      if (!bankDetails.ifscCode) {
        newErrors.ifscCode = "IFSC code is required"
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifscCode)) {
        newErrors.ifscCode = "Please enter a valid IFSC code"
      }
      if (!bankDetails.accountName) {
        newErrors.accountName = "Account holder name is required"
      }
    }

    // Validate verification method
    if (verificationMethod === "aadhaar") {
      const digitsOnly = verificationNumber.replace(/\s/g, "")
      if (!digitsOnly) {
        newErrors.verificationNumber = "Aadhaar number is required"
      } else if (digitsOnly.length !== 12) {
        newErrors.verificationNumber = "Aadhaar number must be 12 digits"
      }
    } else if (verificationMethod === "pan") {
      if (!verificationNumber) {
        newErrors.verificationNumber = "PAN number is required"
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(verificationNumber)) {
        newErrors.verificationNumber = "Please enter a valid PAN number"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const data: any = { withdrawalMethod, verificationMethod, verificationNumber }

    // Add relevant payment details based on the selected method
    if (withdrawalMethod === "upi") {
      data.upiId = upiId
    } else if (withdrawalMethod === "phonepe") {
      data.phonepeNumber = phonepeNumber
    } else if (withdrawalMethod === "gpay") {
      data.gpayNumber = gpayNumber
    } else if (withdrawalMethod === "paytm") {
      data.paytmNumber = paytmNumber
    } else if (withdrawalMethod === "bank") {
      data.bankAccount = bankDetails
    }

    onSubmit(data)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Withdrawal Details</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        You'll receive ₹{amount.toFixed(2)} in your account
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Withdrawal Method</label>
          <Select
            value={withdrawalMethod}
            onValueChange={(value) => setWithdrawalMethod(value as "upi" | "phonepe" | "gpay" | "paytm" | "bank")}
          >
            <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="phonepe">PhonePe</SelectItem>
              <SelectItem value="gpay">Google Pay</SelectItem>
              <SelectItem value="paytm">Paytm</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* UPI Fields */}
        {withdrawalMethod === "upi" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              UPI ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className={`w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
                errors.upiId ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="yourname@upi"
            />
            {errors.upiId && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.upiId}</p>}
          </div>
        )}

        {/* PhonePe Fields */}
        {withdrawalMethod === "phonepe" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              PhonePe Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={phonepeNumber}
              onChange={(e) => {
                const value = e.target.value
                if (/^\d*$/.test(value) && value.length <= 10) {
                  setPhonepeNumber(value)
                }
              }}
              className={`w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
                errors.phonepeNumber ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="10-digit mobile number"
            />
            {errors.phonepeNumber && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.phonepeNumber}</p>
            )}
          </div>
        )}

        {/* Google Pay Fields */}
        {withdrawalMethod === "gpay" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Google Pay Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={gpayNumber}
              onChange={(e) => {
                const value = e.target.value
                if (/^\d*$/.test(value) && value.length <= 10) {
                  setGpayNumber(value)
                }
              }}
              className={`w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
                errors.gpayNumber ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="10-digit mobile number"
            />
            {errors.gpayNumber && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.gpayNumber}</p>}
          </div>
        )}

        {/* Paytm Fields */}
        {withdrawalMethod === "paytm" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Paytm Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={paytmNumber}
              onChange={(e) => {
                const value = e.target.value
                if (/^\d*$/.test(value) && value.length <= 10) {
                  setPaytmNumber(value)
                }
              }}
              className={`w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
                errors.paytmNumber ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="10-digit mobile number"
            />
            {errors.paytmNumber && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.paytmNumber}</p>}
          </div>
        )}

        {/* Bank Transfer Fields */}
        {withdrawalMethod === "bank" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                className={`w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
                  errors.bankName ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter bank name"
              />
              {errors.bankName && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.bankName}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^\d*$/.test(value)) {
                    setBankDetails({ ...bankDetails, accountNumber: value })
                  }
                }}
                className={`w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
                  errors.accountNumber ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Your bank account number"
              />
              {errors.accountNumber && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.accountNumber}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                className={`w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
                  errors.ifscCode ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="IFSC code"
              />
              {errors.ifscCode && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.ifscCode}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account Holder Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bankDetails.accountName}
                onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                className={`w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
                  errors.accountName ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Your name as per bank records"
              />
              {errors.accountName && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.accountName}</p>
              )}
            </div>
          </>
        )}

        {/* Verification Section */}
        <div className="mt-6 mb-4">
          <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Identity Verification</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verification Type</label>
            <Select
              value={verificationMethod}
              onValueChange={(value) => {
                setVerificationMethod(value as "aadhaar" | "pan")
                setVerificationNumber("")
                setFormattedVerificationNumber("")
              }}
            >
              <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Select verification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                <SelectItem value="pan">PAN Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {verificationMethod === "aadhaar" ? "Aadhaar Number" : "PAN Number"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formattedVerificationNumber}
              onChange={(e) => handleVerificationNumberChange(e.target.value)}
              className={`w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
                errors.verificationNumber
                  ? "border-red-300 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder={verificationMethod === "aadhaar" ? "1234 5678 9012" : "ABCDE1234F"}
            />
            {errors.verificationNumber && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.verificationNumber}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {verificationMethod === "aadhaar"
                ? "Format: 1234 5678 9012 (12 digits)"
                : "Format: ABCDE1234F (5 letters, 4 digits, 1 letter)"}
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          Confirm Withdrawal
        </button>
      </form>
    </div>
  )
}
