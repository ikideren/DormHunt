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
