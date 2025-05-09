-- Row Level Security (RLS) Policies for InstaINR app

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