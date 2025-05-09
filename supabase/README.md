# Supabase Setup Instructions

This directory contains SQL files for setting up the InstaINR database in Supabase.

## Setup Process

Because of the complexity of SQL policies and potential conflicts with existing Supabase roles, we've split the setup into two files:

1. `schema-simple.sql` - Creates the basic tables and indexes
2. `policies.sql` - Sets up Row Level Security (RLS) policies

## Setup Instructions

### Step 1: Create Tables
1. Log in to your [Supabase dashboard](https://app.supabase.io/)
2. Select your project
3. Go to the "SQL Editor" tab
4. Create a new query
5. Copy and paste the contents of `schema-simple.sql`
6. Click "Run" to execute the SQL and create the tables

### Step 2: Set Up Security Policies (Optional)
After successfully creating the tables, you can set up security policies:

1. Create a new query in the SQL Editor
2. Copy and paste the contents of `policies.sql`
3. Click "Run" to execute the SQL

**Note:** If you encounter any errors related to roles (like "role 'anon' already exists"), you can ignore those specific lines. These roles are already created by Supabase.

## Table Structure

### users
- `id` - UUID primary key
- `wallet_address` - User's Ethereum wallet address
- `created_at` - When the user was created
- `updated_at` - When the user was last updated

### payments
- `id` - Payment ID (text)
- `amount` - Payment amount
- `token` - Token used (WLD, USDC.e, ETH)
- `transaction_id` - Transaction ID from blockchain
- `status` - Payment status (pending, completed, failed)
- `created_at` - When the payment was created
- `updated_at` - When the payment was last updated

### transactions
- `id` - UUID primary key
- `wallet_address` - User's wallet address
- `token` - Token used
- `amount` - Token amount
- `inr_amount` - INR value
- `fee` - Fee amount
- `final_amount` - Final INR amount after fees
- `transaction_reference` - Reference ID
- `transaction_id` - Transaction ID from blockchain
- `payment_id` - Link to payment record
- `withdrawal_method` - Payment method (upi, phonepe, gpay, paytm, bank)
- `withdrawal_details` - JSON with payment details
- `verification_type` - ID verification type (aadhaar or pan)
- `verification_number` - ID number
- `status` - Transaction status
- `created_at` - When created
- `updated_at` - When updated 