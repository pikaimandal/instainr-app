import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { TEST_MODE } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payment_id, transaction_id, status } = body
    
    if (!payment_id) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 })
    }
    
    // In test mode, just return success
    if (TEST_MODE) {
      console.log(`[TEST MODE] Mocking payment verification for payment_id: ${payment_id}`);
      return NextResponse.json({ 
        success: true,
        test_mode: true,
        message: 'Payment verification simulated in test mode'
      });
    }
    
    const db = getAdminFirestore()
    
    // Update payment document
    const paymentRef = db.collection('payments').doc(payment_id)
    const paymentSnap = await paymentRef.get()
    
    if (!paymentSnap.exists) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }
    
    await paymentRef.update({
      transaction_id,
      status,
      updated_at: new Date()
    })
    
    // Update transaction document
    const transactionsQuery = await db.collection('transactions')
      .where('payment_id', '==', payment_id)
      .limit(1)
      .get()
    
    if (transactionsQuery.empty) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }
    
    const transactionDoc = transactionsQuery.docs[0]
    await db.collection('transactions').doc(transactionDoc.id).update({
      transaction_id,
      status,
      updated_at: new Date()
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    
    // Return mock success in test mode
    if (TEST_MODE) {
      console.log('[TEST MODE] Error occurred during verification, returning mock success');
      return NextResponse.json({ 
        success: true,
        test_mode: true,
        message: 'Payment verification simulated in test mode despite error'
      });
    }
    
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
} 