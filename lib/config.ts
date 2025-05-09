/**
 * Application configuration
 */

/**
 * Test mode settings
 * When enabled:
 * - Firebase credentials will be mocked if missing
 * - Balance checks will be bypassed
 * - Payments will be auto-approved
 * - Mock transaction data will be returned
 */
export const TEST_MODE = true;

/**
 * Minimum conversion amount in INR
 */
export const MIN_CONVERSION_AMOUNT = 500;

/**
 * Fee percentage for conversions (5%)
 */
export const CONVERSION_FEE_PERCENTAGE = 0.05;

/**
 * Mock data for testing
 */
export const MOCK_DATA = {
  tokens: {
    WLD: {
      symbol: 'WLD',
      name: 'Worldcoin',
      balance: 10.5,
      price: 75.25 // INR price per token
    },
    USDC: {
      symbol: 'USDC.e',
      name: 'USD Coin',
      balance: 25.0,
      price: 82.86 // INR price per token
    },
    ETH: {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 0.15,
      price: 223450.75 // INR price per token
    }
  },
  
  transactions: [
    {
      id: 'mock-tx-1',
      wallet_address: 'mock-address',
      token: 'WLD',
      amount: 5.0,
      inr_amount: 375.25,
      fee: 18.76,
      final_amount: 356.49,
      transaction_reference: 'TXN-123456-789',
      withdrawal_method: 'upi',
      withdrawal_details: { upiId: 'mock@upi' },
      verification_type: 'pan',
      verification_number: 'ABCDE1234F',
      status: 'completed',
      created_at: new Date().toISOString(),
      transaction_id: 'test-tx-1234567890'
    },
    {
      id: 'mock-tx-2',
      wallet_address: 'mock-address',
      token: 'USDC.e',
      amount: 10.0,
      inr_amount: 828.60,
      fee: 41.43,
      final_amount: 787.17,
      transaction_reference: 'TXN-654321-987',
      withdrawal_method: 'bank',
      withdrawal_details: { 
        accountNumber: '****1234',
        bankName: 'Mock Bank',
        accountName: 'Test User',
        ifscCode: 'MOCK0000123'
      },
      verification_type: 'aadhaar',
      verification_number: '1234 5678 9012',
      status: 'pending',
      created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    }
  ]
}; 