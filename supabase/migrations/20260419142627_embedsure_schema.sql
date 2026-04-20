/*
  # EMBEDSURE Platform Schema

  1. New Tables
    - `user_profiles` - stores trust score and user behavior metrics
    - `transactions` - all user actions (buy product, book cab, start travel)
    - `insurances` - auto-generated insurance policies per transaction
    - `claims` - submitted/auto-detected claims with AI decisions
    - `fraud_alerts` - flagged suspicious activity
    - `ai_decision_logs` - explainable AI audit trail

  2. Security
    - RLS enabled on all tables
    - Authenticated users can only access their own data
    - Admin-level access via service role
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  trust_score integer DEFAULT 85 CHECK (trust_score BETWEEN 0 AND 100),
  total_claims integer DEFAULT 0,
  approved_claims integer DEFAULT 0,
  flagged_claims integer DEFAULT 0,
  total_transactions integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('product', 'cab', 'travel')),
  amount numeric(10,2) NOT NULL DEFAULT 0,
  location text DEFAULT 'New York, US',
  risk_level text DEFAULT 'Low' CHECK (risk_level IN ('Low', 'Medium', 'High')),
  risk_score integer DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS insurances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  premium numeric(8,2) NOT NULL DEFAULT 0,
  coverage numeric(10,2) NOT NULL DEFAULT 0,
  type text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'claimed')),
  ai_confidence numeric(4,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + INTERVAL '30 days')
);

CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insurance_id uuid REFERENCES insurances(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'under_review', 'flagged', 'rejected')),
  incident_type text NOT NULL,
  ai_decision text,
  ai_reason text,
  fraud_score integer DEFAULT 0 CHECK (fraud_score BETWEEN 0 AND 100),
  settled_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fraud_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  claim_id uuid REFERENCES claims(id) ON DELETE CASCADE,
  alert_type text NOT NULL,
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description text,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_decision_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('insurance', 'claim', 'fraud')),
  entity_id uuid NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  decision text NOT NULL,
  reasoning text NOT NULL,
  confidence numeric(4,2) DEFAULT 0,
  factors jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurances ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_decision_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own transactions"
  ON transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own insurances"
  ON insurances FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insurances"
  ON insurances FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own claims"
  ON claims FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own claims"
  ON claims FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own claims"
  ON claims FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own fraud alerts"
  ON fraud_alerts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fraud alerts"
  ON fraud_alerts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own ai logs"
  ON ai_decision_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai logs"
  ON ai_decision_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_insurances_user_id ON insurances(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_user_id ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_user_id ON fraud_alerts(user_id);
