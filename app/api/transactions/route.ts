import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore, convertTimestamps } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet')
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }
    
    const db = getAdminFirestore()
    const transactionsRef = db.collection('transactions')
    const q = transactionsRef
      .where('wallet_address', '==', walletAddress)
      .orderBy('created_at', 'desc')
    
    const querySnapshot = await q.get()
    const transactions: any[] = []
    
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })
    })
    
    return NextResponse.json({ transactions })
  } catch (error: any) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
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
    
    const db = getAdminFirestore()
    const transactionId = body.id || crypto.randomUUID()
    
    // Create the transaction document
    await db.collection('transactions').doc(transactionId).set({
      ...body,
      id: transactionId,
      created_at: new Date(),
      updated_at: null
    })
    
    return NextResponse.json({
      success: true,
      transaction: {
        id: transactionId,
        ...body
      }
    })
  } catch (error: any) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create transaction' },
      { status: 500 }
    )
  }
} 