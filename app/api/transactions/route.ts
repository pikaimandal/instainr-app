import { NextRequest, NextResponse } from 'next/server'

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
    
    // TODO: In production, fetch transactions from a database
    // Example implementation:
    // const transactions = await db.transactions.findMany({
    //   where: { walletAddress: address },
    //   orderBy: { timestamp: 'desc' }
    // })
    
    // For development, use mock data
    const mockTransactions = [
      {
        id: "1",
        token: "WLD",
        amount: 0.5,
        inrAmount: 625.38,
        status: "completed",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
      {
        id: "2",
        token: "USDC.e",
        amount: 50,
        inrAmount: 4169.0,
        status: "completed",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: "3",
        token: "ETH",
        amount: 0.01,
        inrAmount: 2501.51,
        status: "pending",
        timestamp: new Date().toISOString(), // now
      },
    ]
    
    return NextResponse.json({ transactions: mockTransactions })
  } catch (error: any) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
} 