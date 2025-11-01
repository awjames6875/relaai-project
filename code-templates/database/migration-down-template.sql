-- =================================================================
-- MIGRATION DOWN (ROLLBACK) TEMPLATE
-- =================================================================
--
-- TODO: Update the following:
-- 1. Replace [TABLE_NAME] with your actual table name
-- 2. Add any additional cleanup needed (functions, triggers, types, etc.)
-- 3. Ensure the rollback order is correct (reverse of up migration)
--
-- Migration: [BRIEF_DESCRIPTION_OF_CHANGE]
-- Rollback for: [CORRESPONDING_UP_MIGRATION_FILE]
-- Created: [DATE]
-- Author: [YOUR_NAME]
--
-- WARNING: This migration will DROP data. Use with caution!
--
-- =================================================================

BEGIN;

-- =================================================================
-- PRE-ROLLBACK VALIDATION (Optional)
-- =================================================================

-- Optionally check if table exists before attempting to drop
-- This prevents errors if the table was never created
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = '[TABLE_NAME]'
  ) THEN
    RAISE NOTICE 'Table [TABLE_NAME] does not exist, skipping rollback';
  END IF;
END $$;

-- =================================================================
-- DISABLE REALTIME (if enabled in up migration)
-- =================================================================

-- Remove table from Supabase Realtime publication
-- ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS [TABLE_NAME];

-- =================================================================
-- DROP POLICIES (Clean up RLS policies first)
-- =================================================================

-- Drop all RLS policies for the table
DROP POLICY IF EXISTS "Users can view own [TABLE_NAME]" ON [TABLE_NAME];
DROP POLICY IF EXISTS "Users can insert own [TABLE_NAME]" ON [TABLE_NAME];
DROP POLICY IF EXISTS "Users can update own [TABLE_NAME]" ON [TABLE_NAME];
DROP POLICY IF EXISTS "Users can delete own [TABLE_NAME]" ON [TABLE_NAME];

-- TODO: Drop any additional custom policies you created
-- DROP POLICY IF EXISTS "Your custom policy name" ON [TABLE_NAME];

-- =================================================================
-- DROP TRIGGERS (Must drop before dropping functions)
-- =================================================================

-- Drop the updated_at trigger
DROP TRIGGER IF EXISTS update_[TABLE_NAME]_updated_at ON [TABLE_NAME];

-- TODO: Drop any additional triggers you created
-- DROP TRIGGER IF EXISTS [YOUR_CUSTOM_TRIGGER] ON [TABLE_NAME];

-- =================================================================
-- DROP INDEXES (Dropped automatically with table, but explicit is safer)
-- =================================================================

-- Explicitly drop indexes (they'll be dropped with the table anyway)
DROP INDEX IF EXISTS idx_[TABLE_NAME]_user_id;
DROP INDEX IF EXISTS idx_[TABLE_NAME]_status;
DROP INDEX IF EXISTS idx_[TABLE_NAME]_created_at;
DROP INDEX IF EXISTS idx_[TABLE_NAME]_active;

-- TODO: Drop any additional indexes you created
-- DROP INDEX IF EXISTS idx_[TABLE_NAME]_custom_field;
-- DROP INDEX IF EXISTS idx_[TABLE_NAME]_search;

-- =================================================================
-- DROP FUNCTIONS (if you created any table-specific functions)
-- =================================================================

-- Drop any functions specific to this table
-- Note: Don't drop shared functions like update_updated_at_column()
-- DROP FUNCTION IF EXISTS calculate_[TABLE_NAME]_score(UUID);
-- DROP FUNCTION IF EXISTS get_[TABLE_NAME]_stats(UUID);

-- =================================================================
-- DROP TABLE
-- =================================================================

-- Drop the table and all dependent objects
-- CASCADE will drop dependent objects (views, triggers, etc.)
-- Use CASCADE with caution - it's destructive!
DROP TABLE IF EXISTS [TABLE_NAME] CASCADE;

-- Alternative: Use RESTRICT to fail if dependencies exist
-- DROP TABLE IF EXISTS [TABLE_NAME] RESTRICT;

-- =================================================================
-- DROP CUSTOM TYPES (if you created any enum types)
-- =================================================================

-- Drop any custom types created for this table
-- DROP TYPE IF EXISTS [TABLE_NAME]_status_enum CASCADE;
-- DROP TYPE IF EXISTS [TABLE_NAME]_type_enum CASCADE;

-- =================================================================
-- CLEANUP ORPHANED DATA (if necessary)
-- =================================================================

-- If this table has foreign keys FROM other tables, you may need to clean up
-- Example: If other tables reference this one, you might want to:
-- DELETE FROM other_table WHERE [TABLE_NAME]_id NOT IN (SELECT id FROM [TABLE_NAME]);

-- TODO: Add any cleanup for related tables

-- =================================================================
-- REVOKE PERMISSIONS (if you granted any custom permissions)
-- =================================================================

-- Revoke any custom permissions granted
-- REVOKE ALL ON [TABLE_NAME] FROM authenticated;
-- REVOKE ALL ON [TABLE_NAME] FROM anon;

COMMIT;

-- =================================================================
-- VERIFICATION QUERIES
-- =================================================================

-- Verify the rollback succeeded:
-- SELECT * FROM pg_tables WHERE tablename = '[TABLE_NAME]';
-- Should return 0 rows

-- Check for orphaned indexes:
-- SELECT * FROM pg_indexes WHERE tablename = '[TABLE_NAME]';
-- Should return 0 rows

-- Check for orphaned policies:
-- SELECT * FROM pg_policies WHERE tablename = '[TABLE_NAME]';
-- Should return 0 rows

-- =================================================================
-- ROLLBACK ORDER CHECKLIST
-- =================================================================

-- When rolling back, always follow this order:
-- 1. ✓ Disable realtime subscriptions
-- 2. ✓ Drop RLS policies
-- 3. ✓ Drop triggers
-- 4. ✓ Drop indexes (optional - dropped with table)
-- 5. ✓ Drop table-specific functions
-- 6. ✓ Drop the table itself (CASCADE)
-- 7. ✓ Drop custom types
-- 8. ✓ Clean up orphaned data in related tables
-- 9. ✓ Revoke permissions

-- =================================================================
-- NOTES
-- =================================================================

-- 1. This rollback migration is idempotent (safe to run multiple times)
-- 2. Uses IF EXISTS to prevent errors if objects don't exist
-- 3. All statements are wrapped in a transaction (BEGIN/COMMIT)
-- 4. CASCADE is used to drop dependent objects
-- 5. Rollback should be the REVERSE of the up migration
-- 6. Always test rollback migrations in a development environment first!
-- 7. Consider data backup before running rollback in production
-- 8. Order matters: Drop dependent objects before the objects they depend on

-- =================================================================
-- DATA PRESERVATION (Production Rollback Strategy)
-- =================================================================

-- For production environments, consider preserving data before rollback:
--
-- 1. Create backup table:
--    CREATE TABLE [TABLE_NAME]_backup AS SELECT * FROM [TABLE_NAME];
--
-- 2. Export data:
--    COPY [TABLE_NAME] TO '/path/to/backup/[TABLE_NAME]_backup.csv' CSV HEADER;
--
-- 3. Then proceed with rollback
--
-- 4. To restore later:
--    Run the up migration again, then:
--    INSERT INTO [TABLE_NAME] SELECT * FROM [TABLE_NAME]_backup;
--    DROP TABLE [TABLE_NAME]_backup;

-- =================================================================
-- ALTERNATIVE: SOFT ROLLBACK (Disable instead of Delete)
-- =================================================================

-- Instead of dropping the table, you could disable it:
--
-- -- Disable RLS to prevent access
-- ALTER TABLE [TABLE_NAME] FORCE ROW LEVEL SECURITY;
--
-- -- Drop all policies to prevent any access
-- DROP POLICY IF EXISTS "Users can view own [TABLE_NAME]" ON [TABLE_NAME];
-- DROP POLICY IF EXISTS "Users can insert own [TABLE_NAME]" ON [TABLE_NAME];
-- DROP POLICY IF EXISTS "Users can update own [TABLE_NAME]" ON [TABLE_NAME];
-- DROP POLICY IF EXISTS "Users can delete own [TABLE_NAME]" ON [TABLE_NAME];
--
-- -- Add comment indicating the table is deprecated
-- COMMENT ON TABLE [TABLE_NAME] IS 'DEPRECATED - Rolled back on [DATE]';
--
-- This preserves data while preventing access. Table can be dropped later.
