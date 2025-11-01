-- =================================================================
-- MIGRATION UP TEMPLATE
-- =================================================================
--
-- TODO: Update the following:
-- 1. Replace [TABLE_NAME] with your actual table name (e.g., contacts, messages)
-- 2. Add/modify columns to match your requirements
-- 3. Update constraints and foreign keys
-- 4. Add appropriate comments explaining the table purpose
-- 5. Update the migration description below
--
-- Migration: [BRIEF_DESCRIPTION_OF_CHANGE]
-- Created: [DATE]
-- Author: [YOUR_NAME]
--
-- =================================================================

BEGIN;

-- =================================================================
-- EXTENSIONS (if needed)
-- =================================================================

-- Enable UUID generation (only if not already enabled)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable cryptographic functions (only if not already enabled)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =================================================================
-- TABLE CREATION
-- =================================================================

-- Create table only if it doesn't exist (idempotent)
CREATE TABLE IF NOT EXISTS [TABLE_NAME] (
  -- Primary key (UUID recommended for distributed systems)
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- Foreign key to user (if user-scoped data)
  -- TODO: Add/remove based on your needs
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- TODO: Add your table-specific columns here
  -- Example columns:
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'archived')),

  -- JSONB columns for flexible attributes
  -- metadata JSONB DEFAULT '{}',

  -- Numeric columns with constraints
  -- priority INTEGER DEFAULT 0
  --   CHECK (priority BETWEEN 0 AND 100),

  -- Date/time columns
  -- scheduled_date DATE,
  -- expires_at TIMESTAMPTZ,

  -- Standard timestamp columns (required for all tables)
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Soft delete support (optional but recommended)
  deleted_at TIMESTAMPTZ,

  -- Additional constraints
  -- UNIQUE(user_id, name), -- Example: unique name per user

  -- Email validation example
  -- CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$' OR email IS NULL),

  -- Phone validation example (E.164 format)
  -- CONSTRAINT valid_phone CHECK (phone_number ~* '^\+?[1-9]\d{1,14}$' OR phone_number IS NULL),

  -- Date range validation example
  -- CONSTRAINT valid_date_range CHECK (start_date <= end_date)
);

-- =================================================================
-- INDEXES
-- =================================================================

-- Index on foreign key (always index foreign keys for JOIN performance)
CREATE INDEX IF NOT EXISTS idx_[TABLE_NAME]_user_id
  ON [TABLE_NAME](user_id);

-- Index on status column (for filtering)
CREATE INDEX IF NOT EXISTS idx_[TABLE_NAME]_status
  ON [TABLE_NAME](status);

-- Index on created_at for sorting recent items
CREATE INDEX IF NOT EXISTS idx_[TABLE_NAME]_created_at
  ON [TABLE_NAME](created_at DESC);

-- Partial index on non-deleted records
CREATE INDEX IF NOT EXISTS idx_[TABLE_NAME]_active
  ON [TABLE_NAME](user_id, created_at DESC)
  WHERE deleted_at IS NULL;

-- TODO: Add additional indexes based on query patterns
-- Examples:
-- CREATE INDEX IF NOT EXISTS idx_[TABLE_NAME]_name
--   ON [TABLE_NAME](name);
--
-- CREATE INDEX IF NOT EXISTS idx_[TABLE_NAME]_scheduled
--   ON [TABLE_NAME](scheduled_date)
--   WHERE scheduled_date IS NOT NULL;
--
-- Full-text search index example:
-- CREATE INDEX IF NOT EXISTS idx_[TABLE_NAME]_search
--   ON [TABLE_NAME] USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
--
-- JSONB index example:
-- CREATE INDEX IF NOT EXISTS idx_[TABLE_NAME]_metadata
--   ON [TABLE_NAME] USING gin(metadata);

-- =================================================================
-- TRIGGER FOR UPDATED_AT
-- =================================================================

-- Automatically update updated_at column on row changes
-- Note: The update_updated_at_column() function should already exist from schema.sql
-- If not, create it:
/*
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
*/

CREATE TRIGGER update_[TABLE_NAME]_updated_at
  BEFORE UPDATE ON [TABLE_NAME]
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- ROW LEVEL SECURITY (RLS)
-- =================================================================

-- Enable RLS on the table
ALTER TABLE [TABLE_NAME] ENABLE ROW LEVEL SECURITY;

-- SELECT policy: Users can view their own records
DROP POLICY IF EXISTS "Users can view own [TABLE_NAME]" ON [TABLE_NAME];
CREATE POLICY "Users can view own [TABLE_NAME]"
  ON [TABLE_NAME] FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

-- INSERT policy: Users can insert their own records
DROP POLICY IF EXISTS "Users can insert own [TABLE_NAME]" ON [TABLE_NAME];
CREATE POLICY "Users can insert own [TABLE_NAME]"
  ON [TABLE_NAME] FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE policy: Users can update their own records
DROP POLICY IF EXISTS "Users can update own [TABLE_NAME]" ON [TABLE_NAME];
CREATE POLICY "Users can update own [TABLE_NAME]"
  ON [TABLE_NAME] FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE policy: Users can delete their own records
DROP POLICY IF EXISTS "Users can delete own [TABLE_NAME]" ON [TABLE_NAME];
CREATE POLICY "Users can delete own [TABLE_NAME]"
  ON [TABLE_NAME] FOR DELETE
  USING (auth.uid() = user_id);

-- TODO: For non-user-scoped tables, adjust or remove RLS policies

-- =================================================================
-- TABLE COMMENTS
-- =================================================================

COMMENT ON TABLE [TABLE_NAME] IS 'TODO: Describe the purpose of this table';
COMMENT ON COLUMN [TABLE_NAME].id IS 'Unique identifier for the record';
COMMENT ON COLUMN [TABLE_NAME].user_id IS 'Reference to the user who owns this record';
COMMENT ON COLUMN [TABLE_NAME].created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN [TABLE_NAME].updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN [TABLE_NAME].deleted_at IS 'Timestamp when the record was soft deleted (NULL if active)';

-- TODO: Add comments for your custom columns
-- COMMENT ON COLUMN [TABLE_NAME].name IS 'Name of the [entity]';

-- =================================================================
-- ENABLE REALTIME (Optional)
-- =================================================================

-- Enable Supabase Realtime subscriptions for this table
-- Uncomment if you need real-time updates on the frontend
-- ALTER PUBLICATION supabase_realtime ADD TABLE [TABLE_NAME];

-- =================================================================
-- INITIAL DATA (Optional)
-- =================================================================

-- Insert any required initial/seed data
-- Example:
-- INSERT INTO [TABLE_NAME] (user_id, name, status) VALUES
--   ('00000000-0000-0000-0000-000000000000', 'System Default', 'active')
-- ON CONFLICT (id) DO NOTHING;

COMMIT;

-- =================================================================
-- VERIFICATION QUERIES
-- =================================================================

-- Run these queries to verify the migration succeeded:
-- SELECT * FROM pg_tables WHERE tablename = '[TABLE_NAME]';
-- SELECT * FROM pg_indexes WHERE tablename = '[TABLE_NAME]';
-- \d+ [TABLE_NAME]

-- =================================================================
-- NOTES
-- =================================================================

-- 1. This migration is idempotent (safe to run multiple times)
-- 2. Uses IF NOT EXISTS to prevent errors on re-runs
-- 3. All statements are wrapped in a transaction (BEGIN/COMMIT)
-- 4. Follows RelaAI naming conventions:
--    - snake_case for table and column names
--    - UUID primary keys
--    - created_at, updated_at, deleted_at timestamps
--    - user_id foreign key for user-scoped data
-- 5. RLS is enabled to ensure data security
-- 6. Indexes are created on foreign keys and common query patterns
-- 7. Remember to create a corresponding down migration!
