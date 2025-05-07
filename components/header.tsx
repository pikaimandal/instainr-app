"use client"

import { Info, Moon, Sun, LogOut } from "lucide-react"
import { truncateAddress } from "@/lib/utils"
import type { Theme } from "@/providers/theme-provider"

interface HeaderProps {
  isConnected: boolean
  address?: string
  onConnect: () => void
  onAddressClick: () => void
  onInfoClick: () => void
  onThemeToggle: () => void
  theme: Theme
  showLogoutMenu: boolean
  onLogout: () => void
}

export default function Header({
  isConnected,
  address,
  onConnect,
  onAddressClick,
  onInfoClick,
  onThemeToggle,
  theme,
  showLogoutMenu,
  onLogout,
}: HeaderProps) {
  return (
    <header className="w-full bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
      <div className="container max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onThemeToggle}
            className="p-1.5 mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            InstaINR
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && address ? (
            <div className="relative">
              <button
                onClick={onAddressClick}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 py-1 px-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {truncateAddress(address)}
              </button>

              {showLogoutMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-100 dark:border-gray-700 z-20">
                  <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Connect
            </button>
          )}

          <button
            onClick={onInfoClick}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
