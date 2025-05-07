"use client"

import { Wallet, RefreshCw, Clock } from "lucide-react"

type Page = "wallet" | "convert" | "transactions"

interface BottomNavigationProps {
  activePage: Page
  setActivePage: (page: Page) => void
}

export default function BottomNavigation({ activePage, setActivePage }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-10">
      <div className="container max-w-md mx-auto flex items-center justify-around">
        <button
          onClick={() => setActivePage("wallet")}
          className={`flex flex-col items-center py-3 px-5 ${
            activePage === "wallet" ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Wallet className="h-6 w-6" />
          <span className="text-xs mt-1">Wallet</span>
        </button>

        <button
          onClick={() => setActivePage("convert")}
          className={`flex flex-col items-center py-3 px-5 ${
            activePage === "convert" ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <RefreshCw className="h-6 w-6" />
          <span className="text-xs mt-1">Convert</span>
        </button>

        <button
          onClick={() => setActivePage("transactions")}
          className={`flex flex-col items-center py-3 px-5 ${
            activePage === "transactions" ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Clock className="h-6 w-6" />
          <span className="text-xs mt-1">History</span>
        </button>
      </div>
    </div>
  )
}
