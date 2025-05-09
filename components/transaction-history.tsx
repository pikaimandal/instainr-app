import { formatDistanceToNow } from "date-fns"

interface Transaction {
  id: string
  token: string
  amount: number
  inrAmount: number
  status: "pending" | "completed" | "failed"
  timestamp: string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Transaction History</h2>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {transactions.map((tx) => (
          <div key={tx.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {tx.amount.toFixed(4)} {tx.token}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800 dark:text-gray-200">₹{tx.inrAmount.toFixed(2)}</p>
                <StatusBadge status={tx.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: "pending" | "completed" | "failed" }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  const labels = {
    pending: "Pending",
    completed: "Completed",
    failed: "Failed",
  }

  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${colors[status]}`}>{labels[status]}</span>
  )
}
