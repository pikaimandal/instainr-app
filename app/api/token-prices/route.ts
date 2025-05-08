import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Fetch WLD and USDC.e prices from World App's public pricing API
    const worldResponse = await fetch(
      'https://app-backend.worldcoin.dev/public/v1/miniapps/prices?cryptoCurrencies=WLD,USDCE&fiatCurrencies=USD,INR',
      { next: { revalidate: 60 } } // Cache for 60 seconds
    )
    
    if (!worldResponse.ok) {
      const errorData = await worldResponse.json();
      console.error('Error fetching token prices from World API:', errorData);
      throw new Error('Failed to fetch token prices from World API');
    }
    
    const worldData = await worldResponse.json();
    
    // Fetch ETH price from CoinGecko API (public API, no key required)
    const ethResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr',
      { next: { revalidate: 60 } }
    );
    
    if (!ethResponse.ok) {
      console.error('Error fetching ETH price from CoinGecko:', await ethResponse.text());
      throw new Error('Failed to fetch ETH price from CoinGecko');
    }
    
    const ethData = await ethResponse.json();
    const ethPriceInINR = ethData.ethereum.inr;
    
    // Convert the pricing format to our app's format
    const prices = {
      WLD: parseFloat(worldData.result.prices.WLD.INR.amount) * Math.pow(10, -worldData.result.prices.WLD.INR.decimals),
      "USDC.e": parseFloat(worldData.result.prices.USDCE.INR.amount) * Math.pow(10, -worldData.result.prices.USDCE.INR.decimals),
      ETH: ethPriceInINR
    }
    
    // Log prices for debugging
    console.log('Token prices in INR:', prices);
    
    return NextResponse.json({ prices })
  } catch (error: any) {
    console.error('Error fetching token prices:', error)
    
    // Fallback to approximated values if APIs fail
    const fallbackPrices = {
      WLD: 1250.75, // ~$15 USD
      "USDC.e": 83.38, // ~$1 USD
      ETH: 250150.5, // ~$3000 USD
    }
    
    return NextResponse.json({ 
      prices: fallbackPrices,
      fallback: true,
      error: error.message 
    })
  }
} 