"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import WalletOverview from "@/components/wallet-overview"
import ConversionForm from "@/components/conversion-form"
import WithdrawalForm from "@/components/withdrawal-form"
import TransactionHistory from "@/components/transaction-history"
import SecurityModal from "@/components/security-modal"
import BottomNavigation from "@/components/bottom-navigation"
import { useWorldID } from "@/hooks/use-world-id"
import { useTokenPrices } from "@/hooks/use-token-prices"
import { useWalletBalances } from "@/hooks/use-wallet-balances"
import { useSupabase } from "@/hooks/use-supabase"
import { useTheme } from "@/providers/theme-provider"

type Page = "wallet" | "convert" | "transactions"
type ConversionStep = "form" | "withdraw" | "complete"

export default function Home() {
  const [activePage, setActivePage] = useState<Page>("wallet")
  const [conversionStep, setConversionStep] = useState<ConversionStep>("form")
  const [selectedToken, setSelectedToken] = useState<"WLD" | "USDC.e" | "ETH">("WLD")
  const [amount, setAmount] = useState<string>("")
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [showLogoutMenu, setShowLogoutMenu] = useState(false)

  const { theme, setTheme } = useTheme()
  const { isConnected, address, connect, disconnect } = useWorldID()
  const { prices } = useTokenPrices()
  const { balances, totalBalanceINR, refresh: refreshBalances } = useWalletBalances(address)
  const { 
    saveWithdrawalDetails, 
    getTransactionHistory, 
    transactions, 
    isLoading: isTransactionsLoading 
  } = useSupabase(address)

  // Calculate conversion amount in INR
  const calculateINR = () => {
    if (!amount || !prices) return 0
    const tokenPrice = prices[selectedToken]
    return Number.parseFloat(amount) * tokenPrice
  }

  // Calculate fee (5%)
  const calculateFee = () => {
    const inrAmount = calculateINR()
    return inrAmount * 0.05
  }

  // Calculate final amount
  const calculateFinal = () => {
    const inrAmount = calculateINR()
    const fee = calculateFee()
    return inrAmount - fee
  }

  // Handle conversion submission
  const handleConvert = () => {
    // Check if the conversion amount is less than 500 INR
    if (calculateFinal() < 500) {
      return
    }
    setConversionStep("withdraw")
  }

  // Handle withdrawal submission
  const handleWithdraw = async (withdrawalDetails: any) => {
    try {
      // Add token and amount information to withdrawal details
      const enhancedWithdrawalDetails = {
        ...withdrawalDetails,
        token: selectedToken,
        originalAmount: parseFloat(amount),
        inrAmount: calculateINR(),
        fee: calculateFee()
      }
      
      // Save withdrawal details to Supabase
      await saveWithdrawalDetails(enhancedWithdrawalDetails)
      
      setConversionStep("complete")

      // Refresh transaction history and balances in the background
      getTransactionHistory()
      refreshBalances()
    } catch (error) {
      console.error("Error processing withdrawal:", error)
    }
  }

  // Reset the form
  const handleReset = () => {
    setAmount("")
    setConversionStep("form")
    setActivePage("wallet")
  }

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Toggle logout menu
  const toggleLogoutMenu = () => {
    setShowLogoutMenu(!showLogoutMenu)
  }

  // Handle logout
  const handleLogout = () => {
    disconnect()
    setShowLogoutMenu(false)
  }

  // Load transaction history when connected
  useEffect(() => {
    if (isConnected && address) {
      getTransactionHistory()
    }
  }, [isConnected, address, getTransactionHistory])

  return (
    <main className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header
        isConnected={isConnected}
        address={address}
        onConnect={connect}
        onAddressClick={toggleLogoutMenu}
        onInfoClick={() => setShowSecurityModal(true)}
        onThemeToggle={toggleTheme}
        theme={theme}
        showLogoutMenu={showLogoutMenu}
        onLogout={handleLogout}
      />

      <div className="container max-w-md px-4 py-8 flex-1 flex flex-col">
        {isConnected ? (
          <div className="flex-1 flex flex-col">
            {/* Wallet Page */}
            {activePage === "wallet" && (
              <div className="flex-1 flex flex-col">
                <WalletOverview balances={balances} totalBalanceINR={totalBalanceINR} />
              </div>
            )}

            {/* Convert Page */}
            {activePage === "convert" && (
              <div className="flex-1 flex flex-col">
                {conversionStep === "form" && (
                  <ConversionForm
                    selectedToken={selectedToken}
                    setSelectedToken={setSelectedToken}
                    amount={amount}
                    setAmount={setAmount}
                    balances={balances}
                    prices={prices}
                    calculateINR={calculateINR}
                    calculateFee={calculateFee}
                    calculateFinal={calculateFinal}
                    onSubmit={handleConvert}
                    minimumAmount={500}
                    walletAddress={address || ""}
                  />
                )}

                {conversionStep === "withdraw" && (
                  <WithdrawalForm 
                    amount={calculateFinal()} 
                    token={selectedToken}
                    originalAmount={parseFloat(amount)}
                    inrAmount={calculateINR()}
                    fee={calculateFee()}
                    onSubmit={handleWithdraw} 
                  />
                )}

                {conversionStep === "complete" && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                      Conversion Submitted!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You'll receive ₹{calculateFinal().toFixed(2)} in your account within 30 minutes.
                    </p>
                    <button
                      onClick={handleReset}
                      className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Convert More
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Transactions Page */}
            {activePage === "transactions" && (
              <div className="flex-1 flex flex-col">
                {isTransactionsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <TransactionHistory transactions={transactions} />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Welcome to InstaINR</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Connect your World Wallet to convert your crypto to INR instantly.
            </p>
            <button
              onClick={connect}
              className="py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Connect World Wallet
            </button>
          </div>
        )}
      </div>

      {isConnected && (
        <BottomNavigation
          activePage={activePage}
          setActivePage={(page) => {
            setActivePage(page)
            if (page === "convert") {
              setConversionStep("form")
            }
          }}
        />
      )}

      {showSecurityModal && <SecurityModal onClose={() => setShowSecurityModal(false)} />}
    </main>
  )
}
