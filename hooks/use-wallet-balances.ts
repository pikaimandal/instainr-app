"use client"

import { useState, useEffect, useCallback } from "react"
import { MiniKit } from "@worldcoin/minikit-js"

export function useWalletBalances(address?: string) {
  const [balances, setBalances] = useState<{
    WLD: number
    "USDC.e": number
    ETH: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBalances = useCallback(async () => {
    if (!address) {
      return
    }

    // Only show loading state on initial load
    if (isInitialLoad) {
      setIsLoading(true)
    }
    
    setError(null);

    try {
      // Fetch real balances using our API
      const tokens = ['WLD', 'USDC.e', 'ETH'];
      const results = await Promise.all(
        tokens.map(token => 
          fetch(`/api/token-balance?address=${address}&token=${token}`)
            .then(res => {
              if (!res.ok) throw new Error(`Failed to fetch ${token} balance`);
              return res.json();
            })
        )
      );
      
      // Extract balances from results
      const realBalances = {
        WLD: 0,
        "USDC.e": 0,
        ETH: 0
      };
      
      // Map results to the balances object
      results.forEach(result => {
        if (result.token === 'WLD') realBalances.WLD = result.balance;
        else if (result.token === 'USDC.e') realBalances["USDC.e"] = result.balance;
        else if (result.token === 'ETH') realBalances.ETH = result.balance;
      });

      console.log("Fetched real balances:", realBalances);
      
      setBalances(realBalances);
      setIsInitialLoad(false);
    } catch (err: any) {
      console.error("Error fetching wallet balances:", err);
      setError(err.message || "Failed to fetch wallet balances");
      
      // If we fail to fetch real balances, use zeros as fallback
      if (!balances) {
        setBalances({
          WLD: 0,
          "USDC.e": 0,
          ETH: 0
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [address, isInitialLoad, balances]);

  // Initial fetch
  useEffect(() => {
    if (address) {
      fetchBalances();
    } else {
      setBalances(null);
    }
  }, [address, fetchBalances]);

  return {
    balances,
    isLoading,
    error,
    refreshBalances: fetchBalances,
  };
}
