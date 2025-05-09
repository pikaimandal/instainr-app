-- Create required tables for InstaINR app

-- Users table - stores user information
CREATE TABLE users (
  id UUID PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Create index on wallet_address for faster lookups
CREATE INDEX idx_users_wallet_address ON users(wallet_address);

-- Payments table - stores payment information
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  amount NUMERIC NOT NULL,
  token TEXT NOT NULL,
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Transactions table - stores transaction information
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  wallet_address TEXT NOT NULL REFERENCES users(wallet_address),
  token TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  inr_amount NUMERIC NOT NULL,
  fee NUMERIC NOT NULL,
  final_amount NUMERIC NOT NULL,
  transaction_reference TEXT NOT NULL,
  transaction_id TEXT,
  payment_id TEXT REFERENCES payments(id),
  withdrawal_method TEXT NOT NULL, -- 'upi', 'phonepe', 'gpay', 'paytm', 'bank'
  withdrawal_details JSONB NOT NULL, -- Contains UPI ID, phone number, or bank account details
  verification_type TEXT NOT NULL, -- 'aadhaar' or 'pan'
  verification_number TEXT NOT NULL, -- Aadhaar or PAN number
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Create index on wallet_address for transaction history lookups
CREATE INDEX idx_transactions_wallet_address ON transactions(wallet_address);
CREATE INDEX idx_transactions_payment_id ON transactions(payment_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

-- Payments table policies
CREATE POLICY "Payments are viewable by service_role"
  ON payments
  FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Payments are insertable by service_role"
  ON payments
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Payments are updatable by service_role"
  ON payments
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Transactions table policies
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  USING (wallet_address = auth.jwt() ->> 'wallet_address' OR auth.role() = 'service_role');

CREATE POLICY "Transactions are insertable by service_role"
  ON transactions
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Transactions are updatable by service_role"
  ON transactions
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Grant permissions to the existing anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON users TO anon, authenticated;
GRANT SELECT ON transactions TO anon, authenticated;

-- Set up service_role access (already exists in Supabase)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role; 