import React from "react"
import { format } from "date-fns"
import { Timestamp } from "firebase/firestore"

interface Transaction {
  id: string
  wallet_address: string
  token: string
  amount: number
  inr_amount: number
  fee: number
  final_amount: number
  transaction_reference: string
  withdrawal_method: string
  withdrawal_details: any
  verification_type: string
  verification_number: string
  status: 'pending' | 'completed' | 'failed'
  created_at: Timestamp | string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Transaction History</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
        </div>
      </div>
    )
  }

  // Format verification number for display (mask partially)
  const formatVerificationNumber = (type: string, number: string) => {
    if (!number) return 'Not provided';
    
    if (type === 'aadhaar') {
      // Show only last 4 digits of Aadhaar
      return number.length >= 4 
        ? `XXXX XXXX ${number.substring(number.length - 4)}`
        : number;
    } else if (type === 'pan') {
      // Show first and last character, mask the rest
      return number.length >= 2
        ? `${number.substring(0, 1)}XXXXX${number.substring(number.length - 4)}`
        : number;
    }
    
    return number;
  }

  // Get formatted withdrawal method details
  const getWithdrawalDetails = (method: string, details: any) => {
    if (!details) return 'Not provided';
    
    switch (method) {
      case 'upi':
        return `UPI ID: ${details.upiId || 'Not provided'}`;
      case 'phonepe':
      case 'gpay':
      case 'paytm':
        return `Phone: ${details.phoneNumber ? `xxxxx${details.phoneNumber.substring(5)}` : 'Not provided'}`;
      case 'bank':
        return `Bank: ${details.bankName || 'Not provided'} / Acc: xxxx${details.accountNumber?.substring(details.accountNumber.length - 4) || 'xxxx'}`;
      default:
        return 'Not provided';
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Transaction History</h2>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(transaction.created_at as string), "MMM d, yyyy · h:mm a")}
                </span>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  {transaction.token} to INR
                </h3>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                transaction.status === "completed" 
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : transaction.status === "failed"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }`}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
              <div className="text-gray-600 dark:text-gray-400">Amount</div>
              <div className="text-gray-800 dark:text-gray-200 text-right">
                {transaction.amount.toFixed(6)} {transaction.token}
              </div>
              
              <div className="text-gray-600 dark:text-gray-400">INR Value</div>
              <div className="text-gray-800 dark:text-gray-200 text-right">
                ₹{transaction.inr_amount.toFixed(2)}
              </div>
              
              <div className="text-gray-600 dark:text-gray-400">Fee (5%)</div>
              <div className="text-gray-800 dark:text-gray-200 text-right">
                ₹{transaction.fee.toFixed(2)}
              </div>
              
              <div className="text-gray-600 dark:text-gray-400">You Receive</div>
              <div className="text-gray-800 dark:text-gray-200 text-right font-medium">
                ₹{transaction.final_amount.toFixed(2)}
              </div>
              
              <div className="text-gray-600 dark:text-gray-400">Reference</div>
              <div className="text-gray-800 dark:text-gray-200 text-right">
                {transaction.transaction_reference}
              </div>
              
              <div className="text-gray-600 dark:text-gray-400">Payment Method</div>
              <div className="text-gray-800 dark:text-gray-200 text-right">
                {transaction.withdrawal_method}
              </div>
              
              <div className="text-gray-600 dark:text-gray-400">Payment Details</div>
              <div className="text-gray-800 dark:text-gray-200 text-right">
                {getWithdrawalDetails(transaction.withdrawal_method, transaction.withdrawal_details)}
              </div>
              
              <div className="text-gray-600 dark:text-gray-400">ID Verification</div>
              <div className="text-gray-800 dark:text-gray-200 text-right">
                {transaction.verification_type}: {formatVerificationNumber(transaction.verification_type, transaction.verification_number)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
