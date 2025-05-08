import { NextRequest, NextResponse } from 'next/server'

interface Transaction {
  id: string;
  token: string;
  amount: number;
  inrAmount: number;
  status: "pending" | "completed" | "failed";
  timestamp: string;
}

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
    
    // In production, this would fetch transactions from a database
    // For now, return an empty array until database is implemented
    const transactions: Transaction[] = [];
    
    // Add log for debugging
    console.log(`Fetching transactions for wallet: ${address}`);
    
    return NextResponse.json({ transactions })
  } catch (error: any) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
} 