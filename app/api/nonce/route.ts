import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Generate a random nonce
    const nonce = Math.random().toString(36).substring(2, 15)
    
    // Store the nonce in a cookie for verification later
    const cookieStore = cookies()
    cookieStore.set('siwe', nonce, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    })
    
    return NextResponse.json({ nonce })
  } catch (error) {
    console.error('Error generating nonce:', error)
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    )
  }
} 