"use client"

import type React from "react"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WithdrawalFormProps {
  amount: number
  token?: string
  originalAmount?: number
  inrAmount?: number
  fee?: number
  onSubmit: (withdrawalDetails: any) => void
}

export default function WithdrawalForm({ 
  amount, 
  token = "WLD",
  originalAmount = 0,
  inrAmount = 0,
  fee = 0,
  onSubmit 
}: WithdrawalFormProps) {
  const [method, setMethod] = useState<string>("upi")
  const [details, setDetails] = useState<{ [key: string]: string }>({
    upiId: "",
    phonepeNumber: "",
    gpayNumber: "",
    paytmNumber: "",
    accountNumber: "",
    ifscCode: "",
    accountName: "",
    bankName: ""
  })
  const [verificationType, setVerificationType] = useState<"aadhaar" | "pan">("aadhaar")
  const [verificationNumber, setVerificationNumber] = useState("")
  const [formattedVerificationNumber, setFormattedVerificationNumber] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Format Aadhaar number with spaces
  const formatAadhaar = (value: string) => {
    // Remove all spaces first
    const digitsOnly = value.replace(/\s/g, "")
    
    // Format with spaces after every 4 digits
    let formatted = ""
    for (let i = 0; i < digitsOnly.length && i < 12; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += " "
      }
      formatted += digitsOnly[i]
    }
    
    return formatted
  }

  // Handle verification number change
  const handleVerificationNumberChange = (value: string) => {
    if (verificationType === "aadhaar") {
      // Only allow digits and limit to 12 digits (excluding spaces)
      const digitsOnly = value.replace(/\s/g, "")
      if (/^\d*$/.test(digitsOnly) && digitsOnly.length <= 12) {
        setVerificationNumber(digitsOnly)
        setFormattedVerificationNumber(formatAadhaar(digitsOnly))
      }
    } else {
      // PAN format: 5 letters, 4 digits, 1 letter
      const upperValue = value.toUpperCase()
      if (/^[A-Z0-9]*$/.test(upperValue) && upperValue.length <= 10) {
        setVerificationNumber(upperValue)
        setFormattedVerificationNumber(upperValue)
      }
    }
  }

  const handleChange = (field: string, value: string) => {
    setDetails({
      ...details,
      [field]: value
    })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ""
      })
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    // Validate payment method
    if (method === "upi") {
      if (!details.upiId) {
        newErrors.upiId = "UPI ID is required"
      } else if (!/^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/.test(details.upiId)) {
        newErrors.upiId = "Please enter a valid UPI ID"
      }
    } else if (method === "phonepe") {
      if (!details.phonepeNumber) {
        newErrors.phonepeNumber = "PhonePe number is required"
      } else if (!/^\d{10}$/.test(details.phonepeNumber)) {
        newErrors.phonepeNumber = "Please enter a valid 10-digit number"
      }
    } else if (method === "gpay") {
      if (!details.gpayNumber) {
        newErrors.gpayNumber = "Google Pay number is required"
      } else if (!/^\d{10}$/.test(details.gpayNumber)) {
        newErrors.gpayNumber = "Please enter a valid 10-digit number"
      }
    } else if (method === "paytm") {
      if (!details.paytmNumber) {
        newErrors.paytmNumber = "Paytm number is required"
      } else if (!/^\d{10}$/.test(details.paytmNumber)) {
        newErrors.paytmNumber = "Please enter a valid 10-digit number"
      }
    } else if (method === "bank") {
      if (!details.accountNumber) {
        newErrors.accountNumber = "Account number is required"
      }
      if (!details.ifscCode) {
        newErrors.ifscCode = "IFSC code is required"
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(details.ifscCode)) {
        newErrors.ifscCode = "Please enter a valid IFSC code"
      }
      if (!details.accountName) {
        newErrors.accountName = "Account holder name is required"
      }
      if (!details.bankName) {
        newErrors.bankName = "Bank name is required"
      }
    }
    
    // Validate verification
    if (verificationType === "aadhaar") {
      if (!verificationNumber) {
        newErrors.verificationNumber = "Aadhaar number is required"
      } else if (verificationNumber.length !== 12) {
        newErrors.verificationNumber = "Aadhaar number must be 12 digits"
      }
    } else if (verificationType === "pan") {
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
    
    if (validateForm()) {
      let paymentDetails: any = {};
      
      // Add relevant payment details based on selected method
      if (method === "upi") {
        paymentDetails = { upiId: details.upiId };
      } else if (method === "phonepe") {
        paymentDetails = { phoneNumber: details.phonepeNumber };
      } else if (method === "gpay") {
        paymentDetails = { phoneNumber: details.gpayNumber };
      } else if (method === "paytm") {
        paymentDetails = { phoneNumber: details.paytmNumber };
      } else if (method === "bank") {
        paymentDetails = {
          accountNumber: details.accountNumber,
          ifscCode: details.ifscCode,
          accountName: details.accountName,
          bankName: details.bankName
        };
      }
      
      const withdrawalDetails = {
        method,
        details: paymentDetails,
        amount,
        token,
        originalAmount,
        inrAmount,
        fee,
        verification: {
          type: verificationType,
          number: verificationNumber
        }
      }
      
      onSubmit(withdrawalDetails)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Withdraw Funds</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">You will receive ₹{amount.toFixed(2)} in your account</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Choose Payment Method</label>
          <Select
            value={method}
            onValueChange={(value) => setMethod(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment method" />
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
        {method === "upi" && (
          <div className="mb-4">
            <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">UPI ID</label>
            <input
              type="text"
              id="upiId"
              value={details.upiId}
              onChange={(e) => handleChange("upiId", e.target.value)}
              placeholder="example@upi"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            />
            {errors.upiId && <p className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.upiId}</p>}
          </div>
        )}
        
        {/* PhonePe Fields */}
        {method === "phonepe" && (
          <div className="mb-4">
            <label htmlFor="phonepeNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PhonePe Number</label>
            <input
              type="text"
              id="phonepeNumber"
              value={details.phonepeNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 10) {
                  handleChange("phonepeNumber", value);
                }
              }}
              placeholder="10-digit mobile number"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            />
            {errors.phonepeNumber && <p className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.phonepeNumber}</p>}
          </div>
        )}
        
        {/* Google Pay Fields */}
        {method === "gpay" && (
          <div className="mb-4">
            <label htmlFor="gpayNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Google Pay Number</label>
            <input
              type="text"
              id="gpayNumber"
              value={details.gpayNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 10) {
                  handleChange("gpayNumber", value);
                }
              }}
              placeholder="10-digit mobile number"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            />
            {errors.gpayNumber && <p className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.gpayNumber}</p>}
          </div>
        )}
        
        {/* Paytm Fields */}
        {method === "paytm" && (
          <div className="mb-4">
            <label htmlFor="paytmNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paytm Number</label>
            <input
              type="text"
              id="paytmNumber"
              value={details.paytmNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 10) {
                  handleChange("paytmNumber", value);
                }
              }}
              placeholder="10-digit mobile number"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            />
            {errors.paytmNumber && <p className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.paytmNumber}</p>}
          </div>
        )}
        
        {/* Bank Transfer Fields */}
        {method === "bank" && (
          <>
            <div className="mb-4">
              <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Holder Name</label>
              <input
                type="text"
                id="accountName"
                value={details.accountName}
                onChange={(e) => handleChange("accountName", e.target.value)}
                placeholder="Full Name as per Bank Records"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              />
              {errors.accountName && <p className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.accountName}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                value={details.accountNumber}
                onChange={(e) => handleChange("accountNumber", e.target.value)}
                placeholder="Your Bank Account Number"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              />
              {errors.accountNumber && <p className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.accountNumber}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">IFSC Code</label>
              <input
                type="text"
                id="ifscCode"
                value={details.ifscCode}
                onChange={(e) => handleChange("ifscCode", e.target.value.toUpperCase())}
                placeholder="IFSC Code (e.g., SBIN0000123)"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              />
              {errors.ifscCode && <p className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.ifscCode}</p>}
            </div>
            
            <div className="mb-6">
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bank Name</label>
              <input
                type="text"
                id="bankName"
                value={details.bankName}
                onChange={(e) => handleChange("bankName", e.target.value)}
                placeholder="Name of the Bank"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              />
              {errors.bankName && <p className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.bankName}</p>}
            </div>
          </>
        )}
        
        {/* Identity Verification Section */}
        <div className="mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Identity Verification</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Verification Type</label>
            <Select
              value={verificationType}
              onValueChange={(value) => {
                setVerificationType(value as "aadhaar" | "pan");
                setVerificationNumber("");
                setFormattedVerificationNumber("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select verification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                <SelectItem value="pan">PAN Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="verificationNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {verificationType === "aadhaar" ? "Aadhaar Number" : "PAN Number"}
            </label>
            <input
              type="text"
              id="verificationNumber"
              value={formattedVerificationNumber}
              onChange={(e) => handleVerificationNumberChange(e.target.value)}
              placeholder={verificationType === "aadhaar" ? "1234 5678 9012" : "ABCDE1234F"}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            />
            {errors.verificationNumber && <p className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.verificationNumber}</p>}
            <p className="mt-1 text-xs text-gray-500">
              {verificationType === "aadhaar" 
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
