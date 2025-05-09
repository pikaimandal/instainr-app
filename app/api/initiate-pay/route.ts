import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase-admin'

// Set to true to bypass actual payment verification for testing
const TEST_MODE = true;

export async function POST(req: NextRequest) {
  try {
    // Generate a unique ID for the payment
    const uuid = crypto.randomUUID().replace(/-/g, '')
    
    // Parse request body
    const body = await req.json()
    
    // Store the payment in Firebase
    const db = getAdminFirestore()
    
    // Create a payment record in the payments collection
    await db.collection('payments').doc(uuid).set({
      id: uuid,
      amount: body.amount,
      token: body.token,
      status: 'pending',
      created_at: new Date(),
      updated_at: null
    })
    
    // In test mode, we'll auto-approve the payment after a delay
    if (TEST_MODE) {
      // We'll use a timeout to simulate payment confirmation
      setTimeout(async () => {
        try {
          // Update payment status
          await db.collection('payments').doc(uuid).update({
            status: 'completed',
            transaction_id: `test-tx-${Date.now()}`,
            updated_at: new Date()
          })
          
          // Find the transaction associated with this payment
          const transactionsQuery = await db.collection('transactions')
            .where('payment_id', '==', uuid)
            .limit(1)
            .get()
          
          if (!transactionsQuery.empty) {
            const transactionDoc = transactionsQuery.docs[0]
            await db.collection('transactions').doc(transactionDoc.id).update({
              status: 'completed',
              transaction_id: `test-tx-${Date.now()}`,
              updated_at: new Date()
            })
          }
          
          console.log(`[TEST MODE] Auto-approved payment ${uuid}`)
        } catch (error) {
          console.error('[TEST MODE] Error auto-approving payment:', error)
        }
      }, 3000) // 3 second delay to simulate payment
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