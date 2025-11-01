-- =================================================================
-- ROW LEVEL SECURITY (RLS) POLICY TEMPLATE
-- =================================================================
--
-- TODO: Update the following:
-- 1. Replace [TABLE_NAME] with your actual table name
-- 2. Customize policies based on your access control requirements
-- 3. Test policies with different user roles
-- 4. Review security implications of each policy
--
-- Table: [TABLE_NAME]
-- Created: [DATE]
-- Author: [YOUR_NAME]
--
-- Security Model: User-owned data (each user can only access their own records)
--
-- =================================================================

-- =================================================================
-- ENABLE ROW LEVEL SECURITY
-- =================================================================

-- Enable RLS on the table (required first step)
ALTER TABLE [TABLE_NAME] ENABLE ROW LEVEL SECURITY;

-- Optional: Force RLS even for table owner (recommended for security)
-- ALTER TABLE [TABLE_NAME] FORCE ROW LEVEL SECURITY;

-- =================================================================
-- SELECT POLICIES (Read Access)
-- =================================================================

-- Policy: Users can view their own records
-- This is the most common pattern for user-scoped data
DROP POLICY IF EXISTS "Users can view own [TABLE_NAME]" ON [TABLE_NAME];
CREATE POLICY "Users can view own [TABLE_NAME]"
  ON [TABLE_NAME] FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Alternative: View own records including soft-deleted ones
-- DROP POLICY IF EXISTS "Users can view all own [TABLE_NAME]" ON [TABLE_NAME];
-- CREATE POLICY "Users can view all own [TABLE_NAME]"
--   ON [TABLE_NAME] FOR SELECT
--   USING (auth.uid() = user_id);

-- Alternative: View records shared with user
-- DROP POLICY IF EXISTS "Users can view shared [TABLE_NAME]" ON [TABLE_NAME];
-- CREATE POLICY "Users can view shared [TABLE_NAME]"
--   ON [TABLE_NAME] FOR SELECT
--   USING (
--     auth.uid() = user_id OR
--     auth.uid() = ANY(shared_with_users) -- assuming JSONB or array column
--   );

-- Alternative: Public read access (everyone can read)
-- DROP POLICY IF EXISTS "Public read access to [TABLE_NAME]" ON [TABLE_NAME];
-- CREATE POLICY "Public read access to [TABLE_NAME]"
--   ON [TABLE_NAME] FOR SELECT
--   USING (true);

-- Alternative: Authenticated users can read
-- DROP POLICY IF EXISTS "Authenticated users can read [TABLE_NAME]" ON [TABLE_NAME];
-- CREATE POLICY "Authenticated users can read [TABLE_NAME]"
--   ON [TABLE_NAME] FOR SELECT
--   TO authenticated
--   USING (true);

-- =================================================================
-- INSERT POLICIES (Create Access)
-- =================================================================

-- Policy: Users can insert their own records
-- WITH CHECK ensures the inserted data belongs to the user
DROP POLICY IF EXISTS "Users can insert own [TABLE_NAME]" ON [TABLE_NAME];
CREATE POLICY "Users can insert own [TABLE_NAME]"
  ON [TABLE_NAME] FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Alternative: Authenticated users can insert (but data must be theirs)
-- DROP POLICY IF EXISTS "Authenticated users can insert [TABLE_NAME]" ON [TABLE_NAME];
-- CREATE POLICY "Authenticated users can insert [TABLE_NAME]"
--   ON [TABLE_NAME] FOR INSERT
--   TO authenticated
--   WITH CHECK (auth.uid() = user_id);

-- Alternative: Insert with additional validation
-- DROP POLICY IF EXISTS "Users can insert valid [TABLE_NAME]" ON [TABLE_NAME];
-- CREATE POLICY "Users can insert valid [TABLE_NAME]"
--   ON [TABLE_NAME] FOR INSERT
--   WITH CHECK (
--     auth.uid() = user_id AND
--     status = 'draft' -- Only allow inserting drafts
--   );

-- =================================================================
-- UPDATE POLICIES (Modify Access)
-- =================================================================

-- Policy: Users can update their own records
-- USING clause: which rows can be selected for update
-- WITH CHECK clause: what the new values can be
DROP POLICY IF EXISTS "Users can update own [TABLE_NAME]" ON [TABLE_NAME];
CREATE POLICY "Users can update own [TABLE_NAME]"
  ON [TABLE_NAME] FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Alternative: Update with status restrictions
-- DROP POLICY IF EXISTS "Users can update draft [TABLE_NAME]" ON [TABLE_NAME];
-- CREATE POLICY "Users can update draft [TABLE_NAME]"
--   ON [TABLE_NAME] FOR UPDATE
--   USING (
--     auth.uid() = user_id AND
--     status IN ('draft', 'pending') -- Only update certain statuses
--   )
--   WITH CHECK (
--     auth.uid() = user_id AND
--     status IN ('draft', 'pending', 'published') -- Can change to these statuses
--   );

-- Alternative: Prevent changing ownership
-- DROP POLICY IF EXISTS "Users can update own [TABLE_NAME] no transfer" ON [TABLE_NAME];
-- CREATE POLICY "Users can update own [TABLE_NAME] no transfer"
--   ON [TABLE_NAME] FOR UPDATE
--   USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id AND user_id = (SELECT user_id FROM [TABLE_NAME] WHERE id = [TABLE_NAME].id));

-- Alternative: Time-based update restrictions
-- DROP POLICY IF EXISTS "Users can update recent [TABLE_NAME]" ON [TABLE_NAME];
-- CREATE POLICY "Users can update recent [TABLE_NAME]"
--   ON [TABLE_NAME] FOR UPDATE
--   USING (
--     auth.uid() = user_id AND
--     created_at > NOW() - INTERVAL '24 hours' -- Only update items created in last 24h
--   );

-- =================================================================
-- DELETE POLICIES (Remove Access)
-- =================================================================

-- Policy: Users can delete their own records
DROP POLICY IF EXISTS "Users can delete own [TABLE_NAME]" ON [TABLE_NAME];
CREATE POLICY "Users can delete own [TABLE_NAME]"
  ON [TABLE_NAME] FOR DELETE
  USING (auth.uid() = user_id);

-- Alternative: Soft delete only (prevent hard deletes)
-- Instead of DELETE policy, use UPDATE policy to set deleted_at:
-- DROP POLICY IF EXISTS "Users can soft delete [TABLE_NAME]" ON [TABLE_NAME];
-- CREATE POLICY "Users can soft delete [TABLE_NAME]"
--   ON [TABLE_NAME] FOR UPDATE
--   USING (auth.uid() = user_id AND deleted_at IS NULL)
--   WITH CHECK (auth.uid() = user_id AND deleted_at IS NOT NULL);

-- Alternative: Prevent deletion of certain records
-- DROP POLICY IF EXISTS "Users can delete non-system [TABLE_NAME]" ON [TABLE_NAME];
-- CREATE POLICY "Users can delete non-system [TABLE_NAME]"
--   ON [TABLE_NAME] FOR DELETE
--   USING (
--     auth.uid() = user_id AND
--     is_system_record = false -- Prevent deleting system records
--   );

-- =================================================================
-- ALL OPERATIONS POLICY (Combined)
-- =================================================================

-- Alternative: Single policy for all operations (use sparingly)
-- DROP POLICY IF EXISTS "Users full access to own [TABLE_NAME]" ON [TABLE_NAME];
-- CREATE POLICY "Users full access to own [TABLE_NAME]"
--   ON [TABLE_NAME] FOR ALL
--   USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id);

-- =================================================================
-- ADMIN POLICIES (Elevated Access)
-- =================================================================

-- Policy: Admins can view all records
-- Requires custom claim in JWT (auth.jwt()->>'role' = 'admin')
-- DROP POLICY IF EXISTS "Admins can view all [TABLE_NAME]" ON [TABLE_NAME];
-- CREATE POLICY "Admins can view all [TABLE_NAME]"
--   ON [TABLE_NAME] FOR SELECT
--   USING (
--     (auth.jwt()->>'role')::text = 'admin' OR
--     (auth.jwt()->'user_metadata'->>'is_admin')::boolean = true
--   );

-- Policy: Admins can manage all records
-- DROP POLICY IF EXISTS "Admins can manage all [TABLE_NAME]" ON [TABLE_NAME];
-- CREATE POLICY "Admins can manage all [TABLE_NAME]"
--   ON [TABLE_NAME] FOR ALL
--   USING (
--     (auth.jwt()->>'role')::text = 'admin'
--   );

-- =================================================================
-- SERVICE ROLE POLICIES
-- =================================================================

-- Note: Service role AUTOMATICALLY BYPASSES RLS
-- You don't need policies for service role
--
-- To check if current role is service:
-- SELECT auth.role() = 'service_role';
--
-- Use service role for:
-- - Background jobs (message scheduling, cleanup)
-- - System operations
-- - Admin operations via backend API

-- =================================================================
-- TESTING POLICIES
-- =================================================================

-- Test queries to verify policies work correctly:

-- 1. Test as authenticated user:
/*
SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub TO 'test-user-uuid-here';

-- Should return only that user's records:
SELECT * FROM [TABLE_NAME];

-- Should succeed:
INSERT INTO [TABLE_NAME] (user_id, name)
VALUES ('test-user-uuid-here', 'Test Record');

-- Should fail (different user_id):
INSERT INTO [TABLE_NAME] (user_id, name)
VALUES ('different-user-uuid', 'Test Record');

RESET role;
*/

-- 2. Test as anonymous user:
/*
SET LOCAL role anon;

-- Should return nothing (or only public records):
SELECT * FROM [TABLE_NAME];

-- Should fail:
INSERT INTO [TABLE_NAME] (user_id, name)
VALUES ('test-user-uuid', 'Test Record');

RESET role;
*/

-- 3. Test as service role:
/*
SET LOCAL role service_role;

-- Should return ALL records (bypasses RLS):
SELECT * FROM [TABLE_NAME];

-- Can insert for any user:
INSERT INTO [TABLE_NAME] (user_id, name)
VALUES ('any-user-uuid', 'System Record');

RESET role;
*/

-- =================================================================
-- POLICY DEBUGGING
-- =================================================================

-- Check if RLS is enabled on table:
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE tablename = '[TABLE_NAME]';

-- List all policies on table:
-- SELECT policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = '[TABLE_NAME]';

-- View policy SQL:
-- SELECT pg_get_expr(qual, '[TABLE_NAME]'::regclass) AS using_clause,
--        pg_get_expr(with_check, '[TABLE_NAME]'::regclass) AS check_clause
-- FROM pg_policy
-- WHERE polname = 'policy_name_here';

-- =================================================================
-- SECURITY BEST PRACTICES
-- =================================================================

-- 1. ✓ Always enable RLS on user-facing tables
-- 2. ✓ Use auth.uid() to ensure users only access their own data
-- 3. ✓ Test policies thoroughly before deploying to production
-- 4. ✓ Use DROP POLICY IF EXISTS to make policies idempotent
-- 5. ✓ Document the security model for each table
-- 6. ✓ Use WITH CHECK on INSERT/UPDATE to validate new data
-- 7. ✓ Consider soft deletes instead of hard deletes
-- 8. ✓ Regularly audit policies and access patterns
-- 9. ✓ Use service role only in trusted backend code
-- 10. ✓ Never expose service role key to client-side code

-- =================================================================
-- COMMON POLICY PATTERNS
-- =================================================================

-- Pattern 1: User-owned data (most common)
-- USING (auth.uid() = user_id)

-- Pattern 2: Shared data
-- USING (auth.uid() = user_id OR auth.uid() = ANY(shared_users))

-- Pattern 3: Public read, private write
-- SELECT: USING (true)
-- INSERT/UPDATE/DELETE: USING (auth.uid() = user_id)

-- Pattern 4: Time-based access
-- USING (auth.uid() = user_id AND expires_at > NOW())

-- Pattern 5: Status-based access
-- USING (auth.uid() = user_id AND status = 'published')

-- Pattern 6: Role-based access
-- USING ((auth.jwt()->>'role')::text = 'admin')

-- Pattern 7: Tenant isolation
-- USING (
--   (SELECT tenant_id FROM profiles WHERE id = auth.uid()) = tenant_id
-- )

-- =================================================================
-- NOTES
-- =================================================================

-- 1. Policies are applied on top of regular SQL permissions
-- 2. Multiple policies are OR'd together (any policy allows access)
-- 3. USING clause filters which rows are visible/modifiable
-- 4. WITH CHECK clause validates new/updated row values
-- 5. Policies apply to all operations unless TO role specified
-- 6. Service role bypasses ALL RLS policies
-- 7. Anonymous role has no auth.uid() (returns NULL)
-- 8. Test policies in development before production deployment
