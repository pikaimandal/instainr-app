-- Create required tables for InstaINR app (simplified version)

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