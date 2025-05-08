import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js'

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}

export async function POST(req: NextRequest) {
  try {
    const { payload, nonce } = await req.json() as IRequestPayload
    
    // In a production app, you would retrieve the stored nonce from cookies
    // and compare it with the one in the request
    // const storedNonce = cookies().get('siwe')?.value
    // if (nonce !== storedNonce) {
    //   return NextResponse.json({
    //     status: 'error',
    //     isValid: false,
    //     message: 'Invalid nonce'
    //   }, { status: 400 })
    // }
    
    // Verify the SIWE message
    const validMessage = await verifySiweMessage(payload, nonce)
    
    if (validMessage.isValid) {
      // In a production app, you would store user session information here
      return NextResponse.json({
        status: 'success',
        isValid: true,
        address: payload.address
      })
    } else {
      return NextResponse.json({
        status: 'error',
        isValid: false,
        message: 'Invalid SIWE message'
      }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Error verifying SIWE message:', error)
    return NextResponse.json({
      status: 'error',
      isValid: false,
      message: error.message || 'Failed to verify authentication'
    }, { status: 500 })
  }
} 