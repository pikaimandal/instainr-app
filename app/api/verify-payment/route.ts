import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { payment_id, transaction_id } = await req.json()
    
    if (!payment_id || !transaction_id) {
      return NextResponse.json(
        { error: 'Missing payment_id or transaction_id' },
        { status: 400 }
      )
    }
    
    const supabase = createServiceRoleClient()
    
    // 1. Update the payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        transaction_id,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment_id)
    
    if (paymentError) {
      console.error('Error updating payment:', paymentError)
      return NextResponse.json(
        { error: 'Failed to verify payment' },
        { status: 500 }
      )
    }
    
    // 2. Find and update the transaction associated with this payment
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('payment_id', payment_id)
      .single()
    
    if (txError) {
      console.error('Error fetching transaction:', txError)
      return NextResponse.json(
        { error: 'Failed to find transaction record' },
        { status: 500 }
      )
    }
    
    // 3. Update transaction status
    if (transactions) {
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          transaction_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactions.id)
      
      if (updateError) {
        console.error('Error updating transaction:', updateError)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully'
    })
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
} 