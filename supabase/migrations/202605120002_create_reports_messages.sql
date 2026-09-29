-- Reports table: flags/complaints about listings or users
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
