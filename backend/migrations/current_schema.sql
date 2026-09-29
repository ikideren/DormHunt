-- Combined current schema for Supabase import
-- Includes required extension and schema objects from 001 and 002 migrations

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================
-- From: 001_create_dorms_table.sql
-- =====================
-- Create profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    role TEXT CHECK (role IN ('user', 'seller', 'admin')) DEFAULT 'user',
    university TEXT,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    avatar_url TEXT,
    preferences JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dorms table
CREATE TABLE IF NOT EXISTS dorms (
    id UUID PRIMARY KEY,
    seller_id UUID NOT NULL REFERENCES profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    facilities TEXT[],
    images TEXT[],
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dorms ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified example)
CREATE POLICY "Public dorms are viewable by everyone" ON dorms
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Sellers can create dorms" ON dorms
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- =====================
-- From: 002_create_reports_messages.sql
-- =====================
-- Reports table: flags/complaints about listings or users
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES profiles(id),
    reported_item_id UUID NOT NULL,
    reported_item_type TEXT CHECK (reported_item_type IN ('dorm','user','comment')) NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT CHECK (status IN ('open','in_progress','resolved','dismissed')) DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table: owner <> student inquiries / conversations
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES profiles(id),
    receiver_id UUID NOT NULL REFERENCES profiles(id),
    dorm_id UUID REFERENCES dorms(id),
    content TEXT NOT NULL,
    metadata JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Basic RLS (optional, keep policies minimal for now)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- End of combined schema
