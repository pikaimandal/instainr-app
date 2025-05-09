import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    // Generate a unique ID for the payment
    const uuid = crypto.randomUUID().replace(/-/g, '')
    
    // Parse request body
    const body = await req.json()
    
    // Store the payment ID in Supabase
    const supabase = createServiceRoleClient()
    
    // Create a payment record in the payments table
    const { error } = await supabase
      .from('payments')
      .insert({
        id: uuid,
        amount: body.amount,
        token: body.token,
        status: 'pending',
        created_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Error storing payment:', error)
      return NextResponse.json(
        { error: 'Failed to initiate payment' },
        { status: 500 }
      )
    }
    
    // Return the payment ID to be used with MiniKit payment flow
    return NextResponse.json({ id: uuid })
  } catch (error: any) {
    console.error('Error initiating payment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment' },
      { status: 500 }
    )
  }
} 