import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

interface Transaction {
  id: string;
  token: string;
  amount: number;
  inrAmount: number;
  status: "pending" | "completed" | "failed";
  timestamp: string;
}

// In-memory storage for transactions (in a real app, this would be a database)
const transactions: Record<string, Transaction[]> = {};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get('address')
    
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }
    
    const supabase = createServiceRoleClient()
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_address', address)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(error.message)
    }
    
    return NextResponse.json({ transactions: data || [] })
  } catch (error: any) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

// Add a new POST endpoint to save transactions
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    if (!body.wallet_address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }
    
    const supabase = createServiceRoleClient()
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(body)
      .select()
    
    if (error) {
      throw new Error(error.message)
    }
    
    return NextResponse.json({
      success: true,
      transaction: data?.[0] || null
    })
  } catch (error: any) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create transaction' },
      { status: 500 }
    )
  }
} 