import { NextRequest, NextResponse } from 'next/server'

interface VerifyPaymentRequest {
  id: string;
  status: string;
  txHash?: string;
  transaction_id?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { id, status, txHash, transaction_id } = await req.json() as VerifyPaymentRequest
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing payment ID or status' },
        { status: 400 }
      )
    }

    // The transaction ID from the payment response
    const transactionId = transaction_id || txHash;
    
    if (!transactionId) {
      return NextResponse.json(
        { error: 'Missing transaction ID' },
        { status: 400 }
      )
    }
    
    try {
      // Verify the transaction using the Developer Portal API
      const appId = process.env.NEXT_PUBLIC_APP_ID;
      const apiKey = process.env.DEV_PORTAL_API_KEY;
      
      // Make request to verify the transaction
      const verifyResponse = await fetch(
        `https://developer.worldcoin.org/api/v2/minikit/transaction/${transactionId}?app_id=${appId}&type=payment`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        console.error('Transaction verification failed:', errorData);
        return NextResponse.json(
          { error: 'Failed to verify transaction with Worldcoin' },
          { status: verifyResponse.status }
        );
      }
      
      const transaction = await verifyResponse.json();
      
      // Check if this is our transaction and not failed
      if (transaction.reference === id && transaction.transaction_status !== 'failed') {
        // Store the transaction details in your database for record-keeping
        // await db.transactions.create({...})
        
        return NextResponse.json({ 
          success: true,
          id,
          status: transaction.transaction_status,
          transaction_hash: transaction.transaction_hash
        });
      } else {
        return NextResponse.json({ 
          success: false,
          error: 'Transaction verification failed or reference mismatch'
        }, { status: 400 });
      }
    } catch (error) {
      console.error('Error verifying transaction with Worldcoin:', error);
      return NextResponse.json(
        { error: 'Failed to verify transaction with Worldcoin' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
} 