import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { TEST_MODE } from '@/lib/config'

export async function POST(req: NextRequest) {
  try {
    // Generate a unique ID for the payment
    const uuid = crypto.randomUUID().replace(/-/g, '')
    
    // Parse request body
    const body = await req.json()
    
    // Store the payment in Firebase
    try {
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
    } catch (dbError) {
      console.error('Error storing payment:', dbError);
      // In test mode, we'll continue even if there's a database error
      if (!TEST_MODE) {
        throw dbError;
      }
    }
    
    // In test mode, we'll auto-approve the payment after a delay
    if (TEST_MODE) {
      // We'll use a timeout to simulate payment confirmation
      setTimeout(async () => {
        try {
          const db = getAdminFirestore();
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
    
    // In test mode, return a mock success response even on error
    if (TEST_MODE) {
      const mockId = `test-${crypto.randomUUID().substring(0, 8)}`;
      console.log(`[TEST MODE] Error occurred, returning mock payment id: ${mockId}`);
      return NextResponse.json({ id: mockId });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment' },
      { status: 500 }
    )
  }
} 