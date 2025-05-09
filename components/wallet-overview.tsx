import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface TokenBalance {
  token: string;
  balance: number;
  balanceInINR: number;
  decimals: number;
}

interface WalletOverviewProps {
  balances: TokenBalance[];
  totalBalanceINR: number;
}

export default function WalletOverview({ balances, totalBalanceINR }: WalletOverviewProps) {
  const isLoading = !balances || balances.length === 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Wallet Overview</h2>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Balance (INR)</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalBalanceINR.toFixed(2)}</p>
          </div>
          
          <div className="space-y-4">
            {balances.map((token) => (
              <div key={token.token} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{token.token}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">₹{token.balanceInINR.toFixed(2)}</p>
                </div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {token.balance.toFixed(token.token === "USDC.e" ? 2 : 4)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function WalletOverviewSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <Skeleton className="h-6 w-36 mb-3" />
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Skeleton className="w-8 h-8 rounded-full mr-3" />
              <div>
                <Skeleton className="h-5 w-16 mb-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
