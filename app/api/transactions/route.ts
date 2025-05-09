import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore, convertTimestamps } from '@/lib/firebase-admin'
import { TEST_MODE, MOCK_DATA } from '@/lib/config'

const mockTransactions = MOCK_DATA.transactions;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet')
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }
    
    // Return mock data in test mode
    if (TEST_MODE) {
      console.log('[TEST MODE] Using mock transaction data');
      // Associate mock transactions with the requested wallet address
      const transactions = mockTransactions.map(tx => ({
        ...tx,
        wallet_address: walletAddress
      }));
      return NextResponse.json({ transactions });
    }
    
    const db = getAdminFirestore()
    const transactionsRef = db.collection('transactions')
    const q = transactionsRef
      .where('wallet_address', '==', walletAddress)
      .orderBy('created_at', 'desc')
    
    const querySnapshot = await q.get()
    const transactions: any[] = []
    
    querySnapshot.forEach((doc: any) => {
      transactions.push({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })
    })
    
    return NextResponse.json({ transactions })
  } catch (error: any) {
    console.error('Error fetching transactions:', error)
    // Return mock data in case of error if in test mode
    if (TEST_MODE) {
      console.log('[TEST MODE] Error occurred, using mock transaction data');
      return NextResponse.json({ 
        transactions: mockTransactions.map(tx => ({
          ...tx,
          wallet_address: 'mock-address'
        }))
      });
    }
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
    
    const transactionId = body.id || crypto.randomUUID()
    
    // In test mode, just return success without actually saving
    if (TEST_MODE) {
      console.log('[TEST MODE] Mock transaction created:', transactionId);
      return NextResponse.json({
        success: true,
        transaction: {
          id: transactionId,
          ...body,
          created_at: new Date().toISOString(),
          status: 'pending'
        }
      });
    }
    
    const db = getAdminFirestore()
    
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
    
    // Return mock success in test mode even if there's an error
    if (TEST_MODE) {
      const mockId = crypto.randomUUID();
      console.log('[TEST MODE] Error occurred, returning mock transaction:', mockId);
      return NextResponse.json({
        success: true,
        transaction: {
          id: mockId,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create transaction' },
      { status: 500 }
    )
  }
} 