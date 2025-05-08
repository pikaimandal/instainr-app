import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Fetch prices from World App's public pricing API
    const response = await fetch(
      'https://app-backend.worldcoin.dev/public/v1/miniapps/prices?cryptoCurrencies=WLD,USDCE&fiatCurrencies=USD,INR',
      { next: { revalidate: 60 } } // Cache for 60 seconds
    )
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching token prices from API:', errorData);
      throw new Error('Failed to fetch token prices from API');
    }
    
    const data = await response.json();
    
    // Convert the pricing format to our app's format
    const prices = {
      WLD: parseFloat(data.result.prices.WLD.INR.amount) * Math.pow(10, -data.result.prices.WLD.INR.decimals),
      "USDC.e": parseFloat(data.result.prices.USDCE.INR.amount) * Math.pow(10, -data.result.prices.USDCE.INR.decimals),
      // For ETH, you would add a real source or calculation here
      ETH: 250150.5 // Fallback value
    }
    
    return NextResponse.json({ prices })
  } catch (error: any) {
    console.error('Error fetching token prices:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch token prices' },
      { status: 500 }
    )
  }
} 