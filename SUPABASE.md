# Supabase Setup for InstaINR

This document explains how to set up the Supabase database for the InstaINR app.

## Database Structure

The InstaINR app uses three main tables:

1. **users** - Stores user information
   - `id` (UUID): Primary key
   - `wallet_address` (TEXT): User's Ethereum wallet address
   - `created_at` (TIMESTAMP): When the user was created
   - `updated_at` (TIMESTAMP): When the user was last updated

2. **payments** - Stores payment information
   - `id` (TEXT): Primary key (payment ID)
   - `amount` (NUMERIC): Amount to be paid
   - `token` (TEXT): Token being used (WLD, USDC.e, ETH)
   - `transaction_id` (TEXT): Transaction ID from World app payment
   - `status` (TEXT): Payment status (pending, completed, failed)
   - `created_at` (TIMESTAMP): When the payment was created
   - `updated_at` (TIMESTAMP): When the payment was last updated

3. **transactions** - Stores transaction information
   - `id` (UUID): Primary key
   - `wallet_address` (TEXT): User's wallet address (foreign key to users)
   - `token` (TEXT): Token used for the transaction
   - `amount` (NUMERIC): Amount of tokens
   - `inr_amount` (NUMERIC): INR value before fees
   - `fee` (NUMERIC): Fee amount (5% of INR value)
   - `final_amount` (NUMERIC): Final INR amount after fees
   - `transaction_reference` (TEXT): Reference ID for the transaction
   - `transaction_id` (TEXT): Transaction ID from blockchain
   - `payment_id` (TEXT): Foreign key to payments table
   - `withdrawal_method` (TEXT): Method of withdrawal (upi, phonepe, gpay, paytm, bank)
   - `withdrawal_details` (JSONB): JSON object with withdrawal details
   - `verification_type` (TEXT): Type of ID verification (aadhaar or pan)
   - `verification_number` (TEXT): ID number for verification
   - `status` (TEXT): Transaction status (pending, completed, failed)
   - `created_at` (TIMESTAMP): When the transaction was created
   - `updated_at` (TIMESTAMP): When the transaction was last updated

## Withdrawal Methods

The app supports multiple withdrawal methods:

1. **UPI** - Direct UPI transfer
   - Stores UPI ID in withdrawal_details

2. **PhonePe** - Mobile payment via PhonePe
   - Stores phone number in withdrawal_details

3. **Google Pay** - Mobile payment via Google Pay
   - Stores phone number in withdrawal_details

4. **Paytm** - Mobile payment via Paytm
   - Stores phone number in withdrawal_details

5. **Bank Transfer** - Direct bank account transfer
   - Stores account number, IFSC code, account name, and bank name in withdrawal_details

## ID Verification

Each transaction requires identity verification:

1. **Aadhaar** - Indian national ID
   - 12-digit number
   - Formatted with spaces for display (1234 5678 9012)

2. **PAN** - Permanent Account Number for tax purposes
   - 10-character alphanumeric code
   - Format: ABCDE1234F (5 letters, 4 digits, 1 letter)

## Setting Up Supabase

1. Log in to your [Supabase dashboard](https://app.supabase.io/)
2. Select your project (or create a new one)
3. Navigate to the SQL Editor
4. Copy the contents of the `supabase/schema.sql` file
5. Paste into the SQL Editor and run the query

## Environment Variables

Make sure to add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

You can find these values in your Supabase project settings under API.

## Data Flow

1. When a user connects their wallet, they are automatically registered in the `users` table
2. When they initiate a conversion/payment:
   - A payment record is created in the `payments` table
   - The app uses the payment ID to initiate a World App payment
   - After the payment is verified, a transaction record is created in the `transactions` table with withdrawal and verification details
3. The transaction history page fetches records from the `transactions` table 