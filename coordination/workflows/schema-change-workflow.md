# Schema Change Workflow

This workflow defines the complete process for making database schema changes in the RelaAI project using the multi-agent system.

**Agents Involved:** Database Agent, Backend Agent (future), UI Designer Agent, QA Agent

---

## Workflow Overview

```
Planning → Migration → Testing → Handoff → Deploy → Monitor
   ↓          ↓          ↓          ↓         ↓        ↓
 Impact    → Schema  → Verify  → Contracts→ Apply → Validate
 Analysis   Change     RLS       Updated    Changes  Production
```

**Typical Timeline:** 1-3 days for minor changes, 1-2 weeks for major refactoring

---

## Phase 1: Planning & Impact Analysis

### Objective
Assess the impact of schema changes and plan the migration strategy.

### Responsible Agent
**Database Agent**

### Steps

#### 1.1 Analyze Change Request
Understand what needs to change and why:

- [ ] Review feature requirements or bug report
- [ ] Identify affected tables, columns, and relationships
- [ ] Determine if this is additive (new columns/tables) or breaking (removing/renaming)
- [ ] Assess impact on existing data
- [ ] Identify dependent systems (backend, frontend, reporting)

**Change Types:**
- **Additive:** Adding tables, columns, indexes (low risk)
- **Modifying:** Changing column types, constraints (medium risk)
- **Breaking:** Removing/renaming tables or columns (high risk)

**Deliverables:**
- [ ] Change type identified
- [ ] Impact scope documented
- [ ] Risk level assessed

---

#### 1.2 Check Dependencies
Identify all code that will be affected:

```bash
# Search for table references in codebase
grep -r "table_name" mobile/src/
grep -r "table_name" backend/src/

# Check contract files
grep -r "table_name" contracts/

# Check for foreign key dependencies
psql -d postgres -c "\d+ table_name"
```

**Deliverables:**
- [ ] All dependent code identified
- [ ] Foreign key relationships documented
- [ ] API endpoints using this table listed
- [ ] UI components using this data listed

---

#### 1.3 Plan Migration Strategy

**For Additive Changes:**
- Simple forward migration
- No data migration needed
- Low risk

**For Breaking Changes:**
- [ ] Multi-phase migration required
- [ ] Data migration plan created
- [ ] Backwards compatibility strategy defined
- [ ] Rollback plan documented

**Migration Strategies:**

**Strategy 1: Expand-Contract Pattern** (Recommended for breaking changes)
```
Phase 1: Expand - Add new column/table alongside old
Phase 2: Migrate - Copy data from old to new
Phase 3: Contract - Remove old column/table
```

**Strategy 2: Blue-Green Migration** (For major refactoring)
```
Create new schema version
Dual-write to both schemas
Migrate reads to new schema
Deprecate old schema
```

**Strategy 3: Direct Migration** (For additive changes only)
```
Add new elements in single migration
No backwards compatibility needed
```

**Deliverables:**
- [ ] Migration strategy selected
- [ ] Migration phases defined
- [ ] Timeline estimated
- [ ] Rollback plan created

---

#### 1.4 Create Migration Checklist

Use [database-migration-task.md](coordination/task-template/database-migration-task.md) template:

- [ ] Write up migration SQL
- [ ] Write down migration SQL
- [ ] Test on local database
- [ ] Test with sample data
- [ ] Verify RLS policies
- [ ] Benchmark performance
- [ ] Update contracts
- [ ] Document changes

**Deliverables:**
- [ ] Migration task created
- [ ] Checklist complete
- [ ] Ready to implement

---

## Phase 2: Migration Implementation

### Objective
Write and test the database migration.

### Responsible Agent
**Database Agent**

### Steps

#### 2.1 Create Migration File

**Naming Convention:**
```
V###_description.sql
Example: V006_add_notification_preferences.sql
```

**Migration Structure:**
```sql
-- V006_add_notification_preferences.sql
-- Description: Add notification preferences to user profiles
-- Author: Database Agent
-- Date: 2025-01-15

-- ==================================================================
-- UP MIGRATION
-- ==================================================================

BEGIN;

-- 1. Add new columns
ALTER TABLE profiles
ADD COLUMN notification_email BOOLEAN DEFAULT true,
ADD COLUMN notification_push BOOLEAN DEFAULT true,
ADD COLUMN notification_sms BOOLEAN DEFAULT false;

-- 2. Add comments
COMMENT ON COLUMN profiles.notification_email IS 'Email notification preference';
COMMENT ON COLUMN profiles.notification_push IS 'Push notification preference';
COMMENT ON COLUMN profiles.notification_sms IS 'SMS notification preference';

-- 3. Create indexes if needed
CREATE INDEX idx_profiles_notification_push
ON profiles(notification_push)
WHERE notification_push = true;

-- 4. Update RLS policies (if needed)
-- No RLS changes required for this migration

COMMIT;
```

**Deliverables:**
- [ ] Migration file created
- [ ] Comments added explaining changes
- [ ] Follows naming convention

---

#### 2.2 Write Rollback Migration

**CRITICAL:** Always provide a way to undo the migration.

```sql
-- V006_add_notification_preferences_rollback.sql
-- Description: Rollback notification preferences
-- Author: Database Agent
-- Date: 2025-01-15

BEGIN;

-- Remove indexes
DROP INDEX IF EXISTS idx_profiles_notification_push;

-- Remove columns
ALTER TABLE profiles
DROP COLUMN IF EXISTS notification_email,
DROP COLUMN IF EXISTS notification_push,
DROP COLUMN IF EXISTS notification_sms;

COMMIT;
```

**Rollback Rules:**
- Must restore schema to exact previous state
- Should handle case where migration was partially applied
- Use IF EXISTS / IF NOT EXISTS for idempotency
- Test rollback as thoroughly as forward migration

**Deliverables:**
- [ ] Rollback migration created
- [ ] Idempotent (can run multiple times safely)
- [ ] Tested locally

---

#### 2.3 Handle Breaking Changes

**For Column Renaming:**
```sql
-- Phase 1: Add new column
ALTER TABLE contacts ADD COLUMN full_name TEXT;

-- Phase 2: Copy data
UPDATE contacts SET full_name = name WHERE full_name IS NULL;

-- Phase 3: Add constraint
ALTER TABLE contacts ALTER COLUMN full_name SET NOT NULL;

-- Phase 4: (Later migration) Drop old column
-- ALTER TABLE contacts DROP COLUMN name;
```

**For Column Type Changes:**
```sql
-- Phase 1: Add new column with new type
ALTER TABLE messages ADD COLUMN scheduled_at_new TIMESTAMPTZ;

-- Phase 2: Migrate data
UPDATE messages
SET scheduled_at_new = scheduled_at::timestamptz
WHERE scheduled_at IS NOT NULL;

-- Phase 3: Drop old, rename new
ALTER TABLE messages DROP COLUMN scheduled_at;
ALTER TABLE messages RENAME COLUMN scheduled_at_new TO scheduled_at;
```

**For Table Splits:**
```sql
-- Phase 1: Create new table
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id),
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phase 2: Migrate data
INSERT INTO notification_preferences (user_id, email_enabled, push_enabled)
SELECT id, notification_email, notification_push
FROM profiles
WHERE notification_email IS NOT NULL;

-- Phase 3: (Later migration) Drop old columns
-- ALTER TABLE profiles DROP COLUMN notification_email, notification_push;
```

**Deliverables:**
- [ ] Breaking changes handled safely
- [ ] Multi-phase approach used
- [ ] Data migration tested

---

#### 2.4 Implement RLS Policies

**For New Tables:**
```sql
-- Enable RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read own preferences
CREATE POLICY users_read_own_preferences
ON notification_preferences
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can update own preferences
CREATE POLICY users_update_own_preferences
ON notification_preferences
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can insert own preferences
CREATE POLICY users_insert_own_preferences
ON notification_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**For Modified Tables:**
- [ ] Review existing policies
- [ ] Update if new columns need protection
- [ ] Test that policies still work correctly

**Deliverables:**
- [ ] RLS enabled on new tables
- [ ] Policies created for all operations
- [ ] Policies tested with sample queries

---

#### 2.5 Add Performance Indexes

**Index Strategy:**
```sql
-- Foreign key indexes (always create these)
CREATE INDEX idx_notification_prefs_user_id
ON notification_preferences(user_id);

-- Query pattern indexes (based on expected queries)
CREATE INDEX idx_messages_scheduled_at
ON messages(scheduled_at)
WHERE scheduled_at IS NOT NULL;

-- Composite indexes (for multi-column queries)
CREATE INDEX idx_messages_user_status
ON messages(user_id, status);

-- Partial indexes (for filtered queries)
CREATE INDEX idx_contacts_active
ON contacts(user_id, last_contacted_at)
WHERE deleted_at IS NULL;

-- Full-text search indexes
CREATE INDEX idx_contacts_search
ON contacts USING gin(to_tsvector('english', name || ' ' || COALESCE(notes, '')));
```

**Index Guidelines:**
- Index foreign keys
- Index columns in WHERE clauses
- Index columns in ORDER BY
- Use partial indexes for filtered queries
- Use composite indexes for multi-column queries
- Don't over-index (each index slows writes)

**Deliverables:**
- [ ] Indexes created for common query patterns
- [ ] Index strategy documented
- [ ] Performance tested

---

## Phase 3: Testing & Validation

### Objective
Thoroughly test the migration before deploying.

### Responsible Agent
**Database Agent**

### Steps

#### 3.1 Test on Local Database

```bash
# Start local Supabase
supabase start

# Apply migration
supabase migration up

# Verify schema
psql -h localhost -U postgres -d postgres -c "\d+ table_name"

# Check indexes
psql -h localhost -U postgres -d postgres -c "\di table_name*"

# Verify RLS
psql -h localhost -U postgres -d postgres -c "\dRp table_name"
```

**Validation Checks:**
- [ ] Migration applies without errors
- [ ] Schema matches expected state
- [ ] All indexes created
- [ ] RLS policies active
- [ ] No syntax errors

**Deliverables:**
- [ ] Local migration successful
- [ ] Schema verified

---

#### 3.2 Test with Sample Data

```sql
-- Create test data
INSERT INTO profiles (id, email, notification_email, notification_push)
VALUES
  ('123e4567-e89b-12d3-a456-426614174000', 'test@example.com', true, false),
  ('123e4567-e89b-12d3-a456-426614174001', 'test2@example.com', false, true);

-- Test queries that will be used by application
SELECT * FROM profiles WHERE notification_push = true;
SELECT * FROM profiles WHERE id = '123e4567-e89b-12d3-a456-426614174000';

-- Verify data integrity
SELECT COUNT(*) FROM profiles WHERE notification_email IS NULL;
```

**Deliverables:**
- [ ] Sample data inserted successfully
- [ ] Queries return expected results
- [ ] No data integrity issues

---

#### 3.3 Test RLS Policies

```sql
-- Switch to user context
SET ROLE authenticated;
SET request.jwt.claims.sub = '123e4567-e89b-12d3-a456-426614174000';

-- Test SELECT policy (should see own data only)
SELECT * FROM notification_preferences WHERE user_id = current_setting('request.jwt.claims.sub')::uuid;

-- Test UPDATE policy (should update own data only)
UPDATE notification_preferences
SET email_enabled = false
WHERE user_id = current_setting('request.jwt.claims.sub')::uuid;

-- Test INSERT policy
INSERT INTO notification_preferences (user_id, email_enabled, push_enabled)
VALUES (current_setting('request.jwt.claims.sub')::uuid, true, true);

-- Try to access other user's data (should fail)
SELECT * FROM notification_preferences WHERE user_id != current_setting('request.jwt.claims.sub')::uuid;

-- Reset role
RESET ROLE;
```

**Deliverables:**
- [ ] RLS policies verified for SELECT
- [ ] RLS policies verified for INSERT
- [ ] RLS policies verified for UPDATE
- [ ] RLS policies verified for DELETE
- [ ] Cross-user access correctly blocked

---

#### 3.4 Performance Benchmarking

```sql
-- Enable timing
\timing on

-- Test common queries with EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT * FROM profiles WHERE notification_push = true;

EXPLAIN ANALYZE
SELECT p.*, np.*
FROM profiles p
LEFT JOIN notification_preferences np ON p.id = np.user_id
WHERE p.id = '123e4567-e89b-12d3-a456-426614174000';

-- Check query execution time
-- Target: <100ms for p95
```

**Performance Targets:**
- Simple SELECT: <50ms
- JOIN queries: <100ms
- Aggregation queries: <200ms
- Full-text search: <500ms

**If performance is poor:**
- [ ] Add missing indexes
- [ ] Optimize query structure
- [ ] Consider materialized views
- [ ] Consider partitioning (for very large tables)

**Deliverables:**
- [ ] All queries meet performance targets
- [ ] Slow queries optimized
- [ ] Benchmarks documented

---

#### 3.5 Test Rollback

**CRITICAL:** Always test the rollback before deploying.

```bash
# Apply migration
supabase migration up

# Verify it worked
psql -h localhost -U postgres -d postgres -c "\d+ profiles"

# Rollback
psql -h localhost -U postgres -d postgres < V006_add_notification_preferences_rollback.sql

# Verify rollback worked
psql -h localhost -U postgres -d postgres -c "\d+ profiles"

# Re-apply to continue testing
supabase migration up
```

**Deliverables:**
- [ ] Rollback script tested
- [ ] Schema restored to previous state
- [ ] Rollback is idempotent

---

## Phase 4: Contract Updates & Handoff

### Objective
Update contracts and hand off to dependent agents.

### Responsible Agent
**Database Agent**

### Steps

#### 4.1 Update Database Contracts

**Update schema.sql:**
```sql
-- contracts/database-contracts/schema.sql

-- Add the new schema definition
ALTER TABLE profiles
ADD COLUMN notification_email BOOLEAN DEFAULT true,
ADD COLUMN notification_push BOOLEAN DEFAULT true,
ADD COLUMN notification_sms BOOLEAN DEFAULT false;
```

**Update indexes.sql:**
```sql
-- contracts/database-contracts/indexes.sql

CREATE INDEX idx_profiles_notification_push
ON profiles(notification_push)
WHERE notification_push = true;
```

**Update functions.sql (if applicable):**
```sql
-- contracts/database-contracts/functions.sql

-- Add any new functions or triggers
```

**Deliverables:**
- [ ] schema.sql updated
- [ ] indexes.sql updated
- [ ] functions.sql updated (if needed)
- [ ] Contracts committed to repository

---

#### 4.2 Update Data Contracts

**Update DTO definitions:**
```typescript
// contracts/data-contracts/dto-definitions.ts

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  // NEW: Notification preferences
  notificationEmail: boolean;
  notificationPush: boolean;
  notificationSms: boolean;
  createdAt: string;
  updatedAt: string;
}

// If creating new table, create new DTO
export interface NotificationPreferences {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Update validation schemas:**
```typescript
// contracts/data-contracts/validation-schemas.ts

export const NotificationPreferencesSchema = z.object({
  userId: z.string().uuid(),
  emailEnabled: z.boolean(),
  pushEnabled: z.boolean(),
  smsEnabled: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
```

**Deliverables:**
- [ ] DTOs updated to match schema
- [ ] Validation schemas updated
- [ ] TypeScript types exported
- [ ] Contracts committed

---

#### 4.3 Document Breaking Changes

If this is a breaking change, document it clearly:

**Create BREAKING_CHANGES.md:**
```markdown
# Schema Breaking Changes

## v1.2.0 - 2025-01-15

### BREAKING: Contacts table - `name` renamed to `full_name`

**Affected:**
- Backend API: GET /api/contacts
- Frontend: ContactList, ContactDetail components
- Database queries using `name` column

**Migration Plan:**
- Phase 1 (v1.2.0): Add `full_name` column alongside `name`
- Phase 2 (v1.3.0): Update all code to use `full_name`
- Phase 3 (v1.4.0): Remove `name` column

**Action Required:**
- Backend: Update all queries to use `full_name`
- Frontend: Update ContactDTO to use `fullName`
- Update all components reading contact name

**Timeline:**
- Phase 1: Jan 15, 2025
- Phase 2: Feb 1, 2025
- Phase 3: March 1, 2025
```

**Deliverables:**
- [ ] Breaking changes documented
- [ ] Migration timeline provided
- [ ] Action items for each agent
- [ ] Deprecation warnings added to old fields

---

#### 4.4 Handoff to Backend Agent

Complete [database-to-backend-handoff-template.md](coordination/handoff-protocols/database-to-backend-handoff-template.md):

**Key Information:**
- Schema changes summary
- New tables/columns
- Modified endpoints
- Sample queries
- Performance expectations
- RLS policies

**Deliverables:**
- [ ] Backend handoff document completed
- [ ] Sample data provided
- [ ] Query examples documented
- [ ] Backend agent notified

---

#### 4.5 Handoff to UI Designer Agent

Complete [database-to-ui-handoff-template.md](coordination/handoff-protocols/database-to-ui-handoff-template.md):

**Key Information:**
- New data available
- Updated DTOs
- Components requiring updates
- Sample data for testing
- UI/UX implications

**Deliverables:**
- [ ] UI handoff document completed
- [ ] Component impact list provided
- [ ] Sample data for UI testing
- [ ] UI Designer agent notified

---

## Phase 5: Deployment

### Objective
Deploy schema changes to staging and production.

### Responsible Agent
**Database Agent + DevOps**

### Steps

#### 5.1 Deploy to Staging

```bash
# 1. Backup staging database
pg_dump staging_db > backup_staging_$(date +%Y%m%d_%H%M%S).sql

# 2. Apply migration to staging
supabase migration up --env staging

# 3. Verify migration
psql -h staging-db.supabase.co -d postgres -c "\d+ profiles"

# 4. Test with staging API
curl https://staging-api.relaai.com/api/profiles/me

# 5. Monitor logs for errors
tail -f /var/log/postgres/postgresql.log
```

**Validation:**
- [ ] Migration applied successfully
- [ ] Schema correct
- [ ] RLS policies active
- [ ] API returns correct data
- [ ] No errors in logs

**Deliverables:**
- [ ] Staging deployment successful
- [ ] Smoke tests passed
- [ ] Ready for production

---

#### 5.2 Staged Production Deployment

**For Low-Risk Changes (additive):**
```bash
# Simple deployment
pg_dump production_db > backup_prod_$(date +%Y%m%d_%H%M%S).sql
supabase migration up --env production
```

**For High-Risk Changes (breaking):**
```bash
# 1. Maintenance window
# Announce: "Scheduled maintenance 2:00 AM - 2:30 AM UTC"

# 2. Enable read-only mode (if possible)
ALTER DATABASE production SET default_transaction_read_only = true;

# 3. Backup production
pg_dump production_db > backup_prod_$(date +%Y%m%d_%H%M%S).sql

# 4. Apply migration
supabase migration up --env production

# 5. Verify
psql -h prod-db.supabase.co -d postgres -c "\d+ profiles"

# 6. Test critical paths
curl https://api.relaai.com/health
curl https://api.relaai.com/api/profiles/me

# 7. Disable read-only mode
ALTER DATABASE production SET default_transaction_read_only = false;

# 8. Monitor for 30 minutes
```

**Deliverables:**
- [ ] Production backup created
- [ ] Migration applied successfully
- [ ] Critical paths tested
- [ ] Monitoring active

---

#### 5.3 Post-Deployment Monitoring

**Monitor for first 24 hours:**

```bash
# Check error rates
SELECT COUNT(*) FROM pg_stat_database_conflicts WHERE datname = 'production';

# Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 10;

# Check table sizes
SELECT
  schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Check RLS performance
SELECT * FROM pg_stat_user_tables WHERE schemaname = 'public';
```

**Metrics to Monitor:**
- [ ] Error rate (<1%)
- [ ] Query performance (p95 <100ms)
- [ ] Database CPU (<70%)
- [ ] Database memory (<80%)
- [ ] Connection pool usage (<80%)
- [ ] Replication lag (<1s)

**Deliverables:**
- [ ] Metrics within acceptable range
- [ ] No critical issues
- [ ] Schema change stable

---

## Phase 6: Backwards Compatibility (For Breaking Changes)

### Objective
Maintain backwards compatibility during transition period.

### Steps

#### 6.1 Add Deprecation Warnings

```sql
-- Create view for backwards compatibility
CREATE OR REPLACE VIEW contacts_legacy AS
SELECT
  id,
  full_name AS name, -- Map new column to old name
  email,
  phone,
  created_at,
  updated_at
FROM contacts;

-- Add comment warning
COMMENT ON VIEW contacts_legacy IS
'DEPRECATED: Use contacts table with full_name column. This view will be removed in v1.4.0';
```

**Deliverables:**
- [ ] Legacy views created
- [ ] Deprecation warnings added
- [ ] Removal timeline communicated

---

#### 6.2 Support Dual Writes (Transition Period)

```sql
-- Trigger to keep old and new columns in sync
CREATE OR REPLACE FUNCTION sync_contact_name()
RETURNS TRIGGER AS $$
BEGIN
  -- If old column updated, sync to new
  IF NEW.name IS DISTINCT FROM OLD.name THEN
    NEW.full_name = NEW.name;
  END IF;

  -- If new column updated, sync to old
  IF NEW.full_name IS DISTINCT FROM OLD.full_name THEN
    NEW.name = NEW.full_name;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_contact_name_trigger
BEFORE UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION sync_contact_name();
```

**Deliverables:**
- [ ] Sync triggers created
- [ ] Both columns stay in sync
- [ ] No data loss during transition

---

#### 6.3 Remove Deprecated Elements

**After transition period (e.g., 2 releases later):**

```sql
-- V010_remove_deprecated_contact_name.sql

BEGIN;

-- Drop trigger
DROP TRIGGER IF EXISTS sync_contact_name_trigger ON contacts;
DROP FUNCTION IF EXISTS sync_contact_name();

-- Drop legacy view
DROP VIEW IF EXISTS contacts_legacy;

-- Drop old column
ALTER TABLE contacts DROP COLUMN IF EXISTS name;

COMMIT;
```

**Deliverables:**
- [ ] Deprecated elements removed
- [ ] Migration tested
- [ ] Codebase updated

---

## Checkpoints & Decision Gates

### Checkpoint 1: Impact Assessment
**When:** After Phase 1
**Criteria:** Impact understood, dependencies identified, strategy planned
**Decision:** Proceed with migration or reconsider approach

---

### Checkpoint 2: Migration Tested
**When:** After Phase 3
**Criteria:** Migration works locally, RLS verified, performance benchmarks met
**Decision:** Proceed to deployment or fix issues

---

### Checkpoint 3: Staging Validated
**When:** After Phase 5.1
**Criteria:** Staging deployment successful, no errors, API functional
**Decision:** Proceed to production or rollback

---

### Checkpoint 4: Production Stable
**When:** 24 hours after Phase 5.2
**Criteria:** Metrics normal, no errors, user complaints minimal
**Decision:** Migration complete or rollback

---

## Rollback Procedures

### When to Rollback
- Migration fails to apply
- RLS policies break data access
- Performance degrades >25%
- Data integrity issues discovered
- Critical bugs in production

### Rollback Steps

```bash
# 1. Assess situation
# - How long since deployment?
# - What data was created since migration?
# - Is rollback safe?

# 2. Apply rollback migration
psql -h prod-db.supabase.co -d postgres < V006_rollback.sql

# 3. Verify rollback
psql -h prod-db.supabase.co -d postgres -c "\d+ profiles"

# 4. Restart API servers (to clear cached schema)
kubectl rollout restart deployment/api-server

# 5. Verify application works
curl https://api.relaai.com/health

# 6. Notify team
# Post to #incidents channel

# 7. Post-mortem
# Document what went wrong and how to prevent
```

**Rollback Considerations:**
- **Safe:** Additive changes (new columns/tables) - can rollback anytime
- **Risky:** Data migrations - may lose data created after deployment
- **Dangerous:** Column drops - cannot rollback without data loss

---

## Example: Adding Notification Preferences

**Scenario:** Add notification preferences to user profiles

### Week 1: Planning
- Database Agent analyzes impact
- Identifies affected components: ProfileSettings screen, UserProfile API
- Strategy: Additive change (low risk)

### Week 2: Implementation
- Migration created: V006_add_notification_preferences.sql
- Rollback created and tested
- RLS policies added
- Contracts updated
- Handoff to UI Designer

### Week 3: Deployment
- Deployed to staging Monday
- UI Designer implements settings screen Tuesday-Thursday
- Deployed to production Friday
- Monitored for 48 hours - no issues

**Result:** Successful schema change with zero downtime

---

## Example: Renaming Column (Breaking Change)

**Scenario:** Rename `contacts.name` to `contacts.full_name` for clarity

### Phase 1: Add New Column (v1.2.0)
```sql
ALTER TABLE contacts ADD COLUMN full_name TEXT;
UPDATE contacts SET full_name = name WHERE full_name IS NULL;
```
- Both columns exist
- Sync trigger keeps them in sync
- Old code still works

### Phase 2: Update Codebase (v1.3.0)
- Backend updates to use `full_name`
- Frontend updates to use `fullName`
- Contracts updated
- Deprecation warnings added
- Old column still exists but marked deprecated

### Phase 3: Remove Old Column (v1.4.0)
```sql
DROP TRIGGER sync_contact_name_trigger;
ALTER TABLE contacts DROP COLUMN name;
```
- Old column removed
- All code using new column
- Breaking change complete

**Timeline:** 3 releases over 2 months

---

## Troubleshooting

### Issue: Migration fails with "column already exists"
**Cause:** Migration already partially applied
**Solution:**
```sql
-- Make migration idempotent
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS notification_email BOOLEAN DEFAULT true;
```

---

### Issue: RLS policies too restrictive
**Cause:** Policy logic incorrect
**Solution:**
```sql
-- Drop and recreate policy
DROP POLICY IF EXISTS users_read_own_preferences ON notification_preferences;

CREATE POLICY users_read_own_preferences
ON notification_preferences
FOR SELECT
USING (auth.uid() = user_id);

-- Test immediately
SET ROLE authenticated;
SET request.jwt.claims.sub = 'test-user-id';
SELECT * FROM notification_preferences;
RESET ROLE;
```

---

### Issue: Performance degradation after migration
**Cause:** Missing indexes
**Solution:**
```sql
-- Analyze which queries are slow
EXPLAIN ANALYZE SELECT * FROM profiles WHERE notification_push = true;

-- Add index
CREATE INDEX CONCURRENTLY idx_profiles_notification_push
ON profiles(notification_push)
WHERE notification_push = true;

-- CONCURRENTLY prevents table locking
```

---

### Issue: Foreign key constraint violation during data migration
**Cause:** Referenced data doesn't exist
**Solution:**
```sql
-- Find orphaned records
SELECT * FROM child_table c
LEFT JOIN parent_table p ON c.parent_id = p.id
WHERE p.id IS NULL;

-- Either fix data or use ON DELETE CASCADE
ALTER TABLE child_table
ADD CONSTRAINT fk_parent
FOREIGN KEY (parent_id) REFERENCES parent_table(id)
ON DELETE CASCADE;
```

---

## Best Practices

### DO:
- Always write rollback scripts
- Test migrations on local database first
- Use transactions for atomic changes
- Add comments explaining why
- Benchmark performance before and after
- Update contracts immediately
- Communicate breaking changes early
- Monitor production closely after deployment

### DON'T:
- Don't make breaking changes without migration plan
- Don't skip testing RLS policies
- Don't deploy on Friday afternoon
- Don't skip backups
- Don't ignore performance regressions
- Don't remove old columns immediately
- Don't forget to update contracts
- Don't deploy to production without staging validation

---

## Success Indicators

- [ ] Migration applied successfully
- [ ] Zero downtime deployment
- [ ] All RLS policies working
- [ ] Performance targets met
- [ ] Contracts updated
- [ ] Handoffs complete
- [ ] Dependent agents unblocked
- [ ] Production stable after 48 hours
- [ ] No rollback required

---

**Remember:** Database changes are permanent and affect all agents. Take time to plan, test thoroughly, and communicate clearly!
