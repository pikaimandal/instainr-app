import { Skeleton } from "@/components/ui/skeleton"

interface WalletOverviewProps {
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
}

export default function WalletOverview({ balances, prices }: WalletOverviewProps) {
  if (!balances || !prices) {
    return <WalletOverviewSkeleton />
  }

  const calculateINRValue = (token: "WLD" | "USDC.e" | "ETH") => {
    return balances[token] * prices[token]
  }

  const totalINR = calculateINRValue("WLD") + calculateINRValue("USDC.e") + calculateINRValue("ETH")

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Wallet</h2>
        <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">₹{totalINR.toFixed(2)}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Balance in INR</p>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        <TokenRow token="WLD" balance={balances.WLD} inrValue={calculateINRValue("WLD")} />
        <TokenRow token="USDC.e" balance={balances["USDC.e"]} inrValue={calculateINRValue("USDC.e")} />
        <TokenRow token="ETH" balance={balances.ETH} inrValue={calculateINRValue("ETH")} />
      </div>
    </div>
  )
}

function TokenRow({ token, balance, inrValue }: { token: string; balance: number; inrValue: number }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
          <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{token.substring(0, 1)}</span>
        </div>
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200">{token}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{balance.toFixed(4)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-gray-800 dark:text-gray-200">₹{inrValue.toFixed(2)}</p>
      </div>
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
