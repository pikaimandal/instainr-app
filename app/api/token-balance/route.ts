import { NextRequest, NextResponse } from 'next/server'

const WLD_CONTRACT = '0xD1B5651E55D4CeeD36251c61c50C889B36F6abB5'; // WLD on Worldchain
const USDC_CONTRACT = '0x744ba001bfebd5fbfa5eb38394d0988d9d8b2448'; // USDC.e on Worldchain

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');
    const token = searchParams.get('token');
    
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }
    
    // Call appropriate API based on token
    if (token === 'ETH') {
      return await getEthBalance(address);
    } else if (token === 'WLD') {
      return await getTokenBalance(address, WLD_CONTRACT, 18);
    } else if (token === 'USDC.e') {
      return await getTokenBalance(address, USDC_CONTRACT, 6);
    }
    
    return NextResponse.json(
      { error: 'Unsupported token' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error fetching token balance:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch token balance' },
      { status: 500 }
    );
  }
}

async function getEthBalance(address: string) {
  const alchemyApiKey = process.env.ALCHEMY_API_KEY;
  
  // We'll use Alchemy API for ETH balance on Optimism
  const url = `https://opt-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBalance',
      params: [address, 'latest']
    })
  });
  
  const data = await response.json();
  
  if (data.error) {
    throw new Error(`Alchemy API error: ${data.error.message}`);
  }
  
  // Convert hex balance to decimal and from wei to ETH
  const balanceInWei = parseInt(data.result, 16);
  const balanceInEth = balanceInWei / 1e18;
  
  return NextResponse.json({
    address,
    token: 'ETH',
    balance: balanceInEth,
    rawBalance: balanceInWei.toString()
  });
}

async function getTokenBalance(address: string, contractAddress: string, decimals: number) {
  const appId = process.env.NEXT_PUBLIC_APP_ID;
  const apiKey = process.env.DEV_PORTAL_API_KEY;
  
  if (!apiKey) {
    throw new Error('DEV_PORTAL_API_KEY is not set');
  }
  
  // Call World Developer Portal API for token balances on Worldchain
  const url = `https://developer.worldcoin.org/api/v2/minikit/balances?address=${address}&app_id=${appId}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`World API error: ${JSON.stringify(errorData)}`);
  }
  
  const data = await response.json();
  
  // Find the token in the response
  const tokenInfo = data.balances?.find((b: any) => 
    b.token_address.toLowerCase() === contractAddress.toLowerCase()
  );
  
  if (!tokenInfo) {
    // If token not found, return zero balance
    return NextResponse.json({
      address,
      token: contractAddress === WLD_CONTRACT ? 'WLD' : 'USDC.e',
      balance: 0,
      rawBalance: '0'
    });
  }
  
  // Convert raw balance to decimal
  const rawBalance = tokenInfo.balance;
  const balance = parseInt(rawBalance) / Math.pow(10, decimals);
  
  return NextResponse.json({
    address,
    token: contractAddress === WLD_CONTRACT ? 'WLD' : 'USDC.e',
    balance,
    rawBalance
  });
} 