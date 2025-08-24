-- seed.sql
-- Full database schema and seed data for subscription cancellation flow

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================
-- Tables
-- ========================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  monthly_price INTEGER NOT NULL, -- stored in cents
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_cancellation', 'cancelled')),
  has_cancelled BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cancellations table
CREATE TABLE IF NOT EXISTS cancellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  downsell_variant TEXT NOT NULL CHECK (downsell_variant IN ('A', 'B')),
  reason TEXT,
  accepted_downsell BOOLEAN DEFAULT FALSE,
  has_job BOOLEAN,
  found_job_with_migratemate TEXT,
  roles_applied_count TEXT,
  companies_emailed_count TEXT,
  companies_interviewed_count TEXT,
  explanation TEXT,
  has_immigration_lawyer BOOLEAN,
  visa_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================
-- Row Level Security
-- ========================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cancellations" ON cancellations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own cancellations" ON cancellations
  FOR SELECT USING (auth.uid() = user_id);

-- ========================
-- Seed Data
-- ========================

-- Users
INSERT INTO users (id, email) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'user1@example.com'),
  ('550e8400-e29b-41d4-a716-446655440002', 'user2@example.com'),
  ('550e8400-e29b-41d4-a716-446655440003', 'user3@example.com')
ON CONFLICT (email) DO NOTHING;

-- Subscriptions
INSERT INTO subscriptions (user_id, monthly_price, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 2500, 'active'), -- $25.00
  ('550e8400-e29b-41d4-a716-446655440002', 2900, 'active'), -- $29.00
  ('550e8400-e29b-41d4-a716-446655440003', 2500, 'active')  -- $25.00
ON CONFLICT DO NOTHING;
