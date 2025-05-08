import { NextRequest, NextResponse } from 'next/server'

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
    // Get wallet address from query params
    const { searchParams } = new URL(req.url)
    const address = searchParams.get('address')
    
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }
    
    // Return transactions for this address, or empty array if none
    return NextResponse.json({ 
      transactions: transactions[address.toLowerCase()] || [] 
    })
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
    const { address, transaction } = await req.json()
    
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }
    
    if (!transaction || !transaction.id || !transaction.token) {
      return NextResponse.json(
        { error: 'Transaction details are required' },
        { status: 400 }
      )
    }
    
    // Ensure the transaction has required fields
    const newTransaction: Transaction = {
      id: transaction.id,
      token: transaction.token,
      amount: transaction.amount || 0,
      inrAmount: transaction.inrAmount || 0,
      status: transaction.status || 'completed',
      timestamp: transaction.timestamp || new Date().toISOString()
    };
    
    // Store the transaction
    const normalizedAddress = address.toLowerCase();
    if (!transactions[normalizedAddress]) {
      transactions[normalizedAddress] = [];
    }
    
    // Add to beginning of array (newest first)
    transactions[normalizedAddress].unshift(newTransaction);
    
    // Return success
    return NextResponse.json({ 
      success: true, 
      transaction: newTransaction 
    })
  } catch (error: any) {
    console.error('Error saving transaction:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save transaction' },
      { status: 500 }
    )
  }
} 