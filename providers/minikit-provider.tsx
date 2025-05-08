"use client"

import { ReactNode, useEffect, useState } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

interface MiniKitProviderProps {
  children: ReactNode
}

// Extend Window interface to include MiniKit
declare global {
  interface Window {
    MiniKit?: {
      isInstalled: () => boolean;
      [key: string]: any;
    }
  }
}

export default function MiniKitProvider({ children }: MiniKitProviderProps) {
  const [isInstalledMinikit, setIsInstalledMinikit] = useState<boolean | null>(null)

  useEffect(() => {
    // Initialize MiniKit with app ID if available
    const appId = process.env.NEXT_PUBLIC_APP_ID;
    
    if (appId) {
      console.log('Initializing MiniKit with app ID:', appId);
      MiniKit.install(appId);
    } else {
      console.warn('No app ID found in environment variables');
      MiniKit.install();
    }
    
    // Check if MiniKit is installed
    const isInstalled = MiniKit.isInstalled();
    setIsInstalledMinikit(isInstalled);

    // Log initialization status
    if (isInstalled) {
      console.log('InstaINR: MiniKit initialized successfully');
      if (typeof window !== 'undefined' && window.MiniKit) {
        console.log('Wallet address:', window.MiniKit.walletAddress || 'Not available');
      }
    } else {
      console.error('InstaINR: MiniKit not found - app must be used within World App');
    }
  }, []);

  return (
    <>
      {isInstalledMinikit === false && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90 p-4">
          <div className="max-w-md rounded-lg bg-white p-6 text-center dark:bg-gray-800">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">World App Required</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              InstaINR must be accessed from within the World App. Please open this mini-app using the World App.
            </p>
            <a
              href="https://world.org/download"
              className="mt-6 inline-block rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download World App
            </a>
          </div>
        </div>
      )}
      {children}
    </>
  )
} 