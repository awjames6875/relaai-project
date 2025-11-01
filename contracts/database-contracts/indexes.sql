-- =================================================================
-- RelaAI Row Level Security (RLS) Policies
-- =================================================================
--
-- Comprehensive RLS policies for all tables
-- Ensures users can only access their own data
--
-- =================================================================

-- =================================================================
-- PROFILES TABLE POLICIES
-- =================================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- View own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Insert own profile (during signup)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Update own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Note: DELETE not allowed on profiles (use Supabase Auth deletion)

-- =================================================================
-- CONTACTS TABLE POLICIES
-- =================================================================

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- View own active contacts
DROP POLICY IF EXISTS "Users can view own contacts" ON contacts;
CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

-- View own deleted contacts (for admins/recovery)
DROP POLICY IF EXISTS "Users can view own deleted contacts" ON contacts;
CREATE POLICY "Users can view own deleted contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NOT NULL);

-- Insert own contacts
DROP POLICY IF EXISTS "Users can insert own contacts" ON contacts;
CREATE POLICY "Users can insert own contacts"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update own contacts
DROP POLICY IF EXISTS "Users can update own contacts" ON contacts;
CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE
  USING (auth.uid() = user_id);

-- Delete own contacts (soft delete)
DROP POLICY IF EXISTS "Users can delete own contacts" ON contacts;
CREATE POLICY "Users can delete own contacts"
  ON contacts FOR DELETE
  USING (auth.uid() = user_id);

-- =================================================================
-- MESSAGES TABLE POLICIES
-- =================================================================

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- View own messages
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (auth.uid() = user_id);

-- Insert own messages
DROP POLICY IF EXISTS "Users can insert own messages" ON messages;
CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update own messages (only drafts and scheduled)
DROP POLICY IF EXISTS "Users can update own messages" ON messages;
CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  USING (
    auth.uid() = user_id AND 
    status IN ('draft', 'scheduled')
  );

-- Alternative: Allow all updates (use this if you want to allow editing sent messages)
-- DROP POLICY IF EXISTS "Users can update all own messages" ON messages;
-- CREATE POLICY "Users can update all own messages"
--   ON messages FOR UPDATE
--   USING (auth.uid() = user_id);

-- Delete own messages
DROP POLICY IF EXISTS "Users can delete own messages" ON messages;
CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  USING (auth.uid() = user_id);

-- =================================================================
-- RELATIONSHIPS TABLE POLICIES
-- =================================================================

ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;

-- View own relationships
DROP POLICY IF EXISTS "Users can view own relationships" ON relationships;
CREATE POLICY "Users can view own relationships"
  ON relationships FOR SELECT
  USING (auth.uid() = user_id);

-- Insert own relationships
DROP POLICY IF EXISTS "Users can insert own relationships" ON relationships;
CREATE POLICY "Users can insert own relationships"
  ON relationships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update own relationships
DROP POLICY IF EXISTS "Users can update own relationships" ON relationships;
CREATE POLICY "Users can update own relationships"
  ON relationships FOR UPDATE
  USING (auth.uid() = user_id);

-- Delete own relationships
DROP POLICY IF EXISTS "Users can delete own relationships" ON relationships;
CREATE POLICY "Users can delete own relationships"
  ON relationships FOR DELETE
  USING (auth.uid() = user_id);

-- =================================================================
-- PERSONAL FACTS TABLE POLICIES
-- =================================================================

ALTER TABLE personal_facts ENABLE ROW LEVEL SECURITY;

-- View own contact facts
DROP POLICY IF EXISTS "Users can view own contact facts" ON personal_facts;
CREATE POLICY "Users can view own contact facts"
  ON personal_facts FOR SELECT
  USING (auth.uid() = user_id);

-- Insert own contact facts
DROP POLICY IF EXISTS "Users can insert own contact facts" ON personal_facts;
CREATE POLICY "Users can insert own contact facts"
  ON personal_facts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update own contact facts
DROP POLICY IF EXISTS "Users can update own contact facts" ON personal_facts;
CREATE POLICY "Users can update own contact facts"
  ON personal_facts FOR UPDATE
  USING (auth.uid() = user_id);

-- Delete own contact facts
DROP POLICY IF EXISTS "Users can delete own contact facts" ON personal_facts;
CREATE POLICY "Users can delete own contact facts"
  ON personal_facts FOR DELETE
  USING (auth.uid() = user_id);

-- =================================================================
-- MESSAGE TEMPLATES TABLE POLICIES
-- =================================================================

ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

-- View own templates AND system templates
DROP POLICY IF EXISTS "Users can view own and system templates" ON message_templates;
CREATE POLICY "Users can view own and system templates"
  ON message_templates FOR SELECT
  USING (
    auth.uid() = user_id OR 
    is_system_template = true
  );

-- Insert own custom templates only
DROP POLICY IF EXISTS "Users can insert own templates" ON message_templates;
CREATE POLICY "Users can insert own templates"
  ON message_templates FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND 
    is_system_template = false
  );

-- Update own custom templates only (not system templates)
DROP POLICY IF EXISTS "Users can update own templates" ON message_templates;
CREATE POLICY "Users can update own templates"
  ON message_templates FOR UPDATE
  USING (
    auth.uid() = user_id AND 
    is_system_template = false
  );

-- Delete own custom templates only
DROP POLICY IF EXISTS "Users can delete own templates" ON message_templates;
CREATE POLICY "Users can delete own templates"
  ON message_templates FOR DELETE
  USING (
    auth.uid() = user_id AND 
    is_system_template = false
  );

-- System templates management (admin only)
-- Note: This requires a custom claims or admin role in auth.users
-- DROP POLICY IF EXISTS "Admins can manage system templates" ON message_templates;
-- CREATE POLICY "Admins can manage system templates"
--   ON message_templates FOR ALL
--   USING (
--     auth.jwt()->>'role' = 'admin' OR
--     auth.jwt()->>'is_admin' = 'true'
--   );

-- =================================================================
-- IMPORTANT DATES TABLE POLICIES
-- =================================================================

ALTER TABLE important_dates ENABLE ROW LEVEL SECURITY;

-- View own important dates
DROP POLICY IF EXISTS "Users can view own important dates" ON important_dates;
CREATE POLICY "Users can view own important dates"
  ON important_dates FOR SELECT
  USING (auth.uid() = user_id);

-- Insert own important dates
DROP POLICY IF EXISTS "Users can insert own important dates" ON important_dates;
CREATE POLICY "Users can insert own important dates"
  ON important_dates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update own important dates
DROP POLICY IF EXISTS "Users can update own important dates" ON important_dates;
CREATE POLICY "Users can update own important dates"
  ON important_dates FOR UPDATE
  USING (auth.uid() = user_id);

-- Delete own important dates
DROP POLICY IF EXISTS "Users can delete own important dates" ON important_dates;
CREATE POLICY "Users can delete own important dates"
  ON important_dates FOR DELETE
  USING (auth.uid() = user_id);

-- =================================================================
-- MESSAGE ANALYTICS TABLE POLICIES
-- =================================================================

ALTER TABLE message_analytics ENABLE ROW LEVEL SECURITY;

-- View own message analytics
DROP POLICY IF EXISTS "Users can view own analytics" ON message_analytics;
CREATE POLICY "Users can view own analytics"
  ON message_analytics FOR SELECT
  USING (auth.uid() = user_id);

-- Insert own analytics (backend service)
DROP POLICY IF EXISTS "Users can insert own analytics" ON message_analytics;
CREATE POLICY "Users can insert own analytics"
  ON message_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Note: Updates and deletes typically not needed for analytics
-- But including for completeness

-- Update own analytics
DROP POLICY IF EXISTS "Users can update own analytics" ON message_analytics;
CREATE POLICY "Users can update own analytics"
  ON message_analytics FOR UPDATE
  USING (auth.uid() = user_id);

-- Delete own analytics
DROP POLICY IF EXISTS "Users can delete own analytics" ON message_analytics;
CREATE POLICY "Users can delete own analytics"
  ON message_analytics FOR DELETE
  USING (auth.uid() = user_id);

-- =================================================================
-- USER SETTINGS TABLE POLICIES
-- =================================================================

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- View own settings
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

-- Insert own settings
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update own settings
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Delete own settings (rarely needed)
DROP POLICY IF EXISTS "Users can delete own settings" ON user_settings;
CREATE POLICY "Users can delete own settings"
  ON user_settings FOR DELETE
  USING (auth.uid() = user_id);

-- =================================================================
-- SERVICE ROLE BYPASS (For backend services)
-- =================================================================

-- Note: Service role automatically bypasses RLS
-- Use auth.uid() = user_id for normal users
-- Service role for system operations (message scheduling, etc.)

-- To check if service role:
-- SELECT auth.role() = 'service_role';

-- =================================================================
-- TESTING RLS POLICIES
-- =================================================================

-- Test as specific user:
-- SET LOCAL role authenticated;
-- SET LOCAL request.jwt.claim.sub TO 'user-uuid-here';

-- Test queries:
-- SELECT * FROM contacts WHERE user_id = 'user-uuid-here';

-- Reset:
-- RESET role;

-- =================================================================
-- RLS MONITORING
-- =================================================================

-- Check which tables have RLS enabled:
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;

-- List all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

-- =================================================================
-- SECURITY NOTES
-- =================================================================

-- 1. All tables use auth.uid() to ensure users only access their data
-- 2. System templates are read-only for regular users
-- 3. Soft deletes on contacts preserve referential integrity
-- 4. Service role bypasses RLS for backend operations
-- 5. Consider adding audit logging for sensitive operations
-- 6. Regularly review and test RLS policies
-- 7. Use service role sparingly and only for trusted backend services

-- =================================================================
-- ADDITIONAL SECURITY RECOMMENDATIONS
-- =================================================================

-- 1. Enable RLS on ALL user-facing tables (done above)
-- 2. Use service role only in backend, never expose to client
-- 3. Validate all user inputs before database operations
-- 4. Use parameterized queries to prevent SQL injection
-- 5. Regularly audit RLS policies and access patterns
-- 6. Monitor for unauthorized access attempts
-- 7. Keep Supabase and PostgreSQL versions up to date
-- 8. Use strong passwords and enable 2FA for admin accounts
-- 9. Limit API key permissions to minimum required
-- 10. Implement rate limiting at application level
```

---

## 💾 **How to Save These SQL Files:**

### **Step 1: Create Each File**

In your `contracts/database-contracts/` folder:

1. **Right-click** on `database-contracts` folder
2. **Select** "New File"
3. **Name it:** `schema.sql`
4. **Copy-paste** the SQL code from File 1 above
5. **Save:** `Ctrl+S` or `Cmd+S`

**Repeat for:**
- `entity-relationships.md` (File 2) - This is Markdown
- `indexes.sql` (File 3)
- `rls-policies.sql` (File 4)

---

### **Step 2: Verify Your Files**

Your `database-contracts/` folder should now have:
```
database-contracts/
├── schema.sql ✅
├── entity-relationships.md ✅
├── indexes.sql ✅
└── rls-policies.sql ✅