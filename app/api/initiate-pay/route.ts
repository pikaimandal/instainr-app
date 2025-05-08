import { NextRequest, NextResponse } from 'next/server'

interface InitiatePayRequest {
  token: string
  amount: string
}

export async function POST(req: NextRequest) {
  try {
    const { token, amount } = await req.json() as InitiatePayRequest
    
    if (!token || !amount) {
      return NextResponse.json(
        { error: 'Missing token or amount' },
        { status: 400 }
      )
    }
    
    // Generate a unique payment ID
    const paymentId = crypto.randomUUID().replace(/-/g, '')
    
    // TODO: In production, store this payment request in a database
    // await db.payments.create({
    //   id: paymentId,
    //   token,
    //   amount,
    //   status: 'pending',
    //   created_at: new Date()
    // })
    
    return NextResponse.json({ id: paymentId, token, amount })
  } catch (error: any) {
    console.error('Error initiating payment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment' },
      { status: 500 }
    )
  }
} 