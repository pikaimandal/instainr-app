"use client"

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

type Transaction = {
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
  created_at: string
}

export function useSupabase(walletAddress?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Register a user when they connect their wallet for the first time
  const registerUser = useCallback(async () => {
    if (!walletAddress) return

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single()

      if (!existingUser) {
        // Create new user
        await supabase.from('users').insert({
          id: uuidv4(),
          wallet_address: walletAddress,
          created_at: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error registering user:', error)
    }
  }, [walletAddress])

  // Get transaction history for a wallet
  const getTransactionHistory = useCallback(async () => {
    if (!walletAddress) return

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setTransactions(data || [])
    } catch (err: any) {
      console.error('Error fetching transactions:', err)
      setError(err.message || 'Failed to fetch transaction history')
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress])

  // Save transaction and withdrawal details
  const saveWithdrawalDetails = useCallback(async (withdrawalDetails: any) => {
    if (!walletAddress) throw new Error('Wallet address is required')

    try {
      // Generate transaction reference
      const transactionRef = `TXN-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`

      // Make API call to initiate payment
      const paymentResponse = await fetch('/api/initiate-pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: withdrawalDetails.amount,
          token: withdrawalDetails.token
        })
      })

      const paymentData = await paymentResponse.json()
      
      // Create transaction record
      const { error: insertError } = await supabase.from('transactions').insert({
        id: uuidv4(),
        wallet_address: walletAddress,
        token: withdrawalDetails.token,
        amount: withdrawalDetails.originalAmount,
        inr_amount: withdrawalDetails.inrAmount,
        fee: withdrawalDetails.fee,
        final_amount: withdrawalDetails.amount,
        transaction_reference: transactionRef,
        withdrawal_method: withdrawalDetails.method,
        withdrawal_details: withdrawalDetails.details,
        verification_type: withdrawalDetails.verification?.type || 'none',
        verification_number: withdrawalDetails.verification?.number || '',
        payment_id: paymentData.id, // Store the payment ID from World App
        status: 'pending',
        created_at: new Date().toISOString()
      })

      if (insertError) throw insertError

      // Refresh transactions
      getTransactionHistory()

      return transactionRef
    } catch (err: any) {
      console.error('Error saving withdrawal details:', err)
      throw new Error(err.message || 'Failed to save withdrawal details')
    }
  }, [walletAddress, getTransactionHistory])

  // Update transaction status
  const updateTransactionStatus = useCallback(async (transactionId: string, status: 'pending' | 'completed' | 'failed') => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status })
        .eq('id', transactionId)

      if (error) throw error

      // Refresh transactions
      getTransactionHistory()
    } catch (err: any) {
      console.error('Error updating transaction status:', err)
      throw new Error(err.message || 'Failed to update transaction status')
    }
  }, [getTransactionHistory])

  // Register user when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      registerUser()
    }
  }, [walletAddress, registerUser])

  return {
    transactions,
    isLoading,
    error,
    getTransactionHistory,
    saveWithdrawalDetails,
    updateTransactionStatus
  }
}
