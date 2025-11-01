# Database Migration Task Template

## Task Metadata
- **Task ID:** [TASK-XXX]
- **Task Type:** Database Migration
- **Agent:** Database Agent
- **Priority:** [P0 / P1 / P2 / P3]
- **Status:** [To Do / In Progress / In Review / Done]
- **Created:** [YYYY-MM-DD]
- **Due Date:** [YYYY-MM-DD]

---

## Migration Overview

### Purpose
Brief description of why this migration is needed.

**Example:** "Add notifications table to support push notification feature for users."

### Migration Type
- [ ] **Additive** - Adding new tables/columns (low risk)
- [ ] **Modification** - Modifying existing tables/columns (medium risk)
- [ ] **Destructive** - Removing tables/columns (high risk, requires data migration)
- [ ] **Data Migration** - Moving/transforming data

---

## Schema Changes

### New Tables
List all new tables being created:

#### Table: `notifications`
```sql
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  message VARCHAR(500) NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);
```

**Purpose:** Store user notifications for push/in-app alerts

**Columns:**
- `id` - Primary key (UUID)
- `user_id` - Foreign key to profiles table
- `title` - Notification title (max 100 chars)
- `message` - Notification body (max 500 chars)
- `read` - Whether notification has been read
- `created_at` - Timestamp of creation
- `updated_at` - Timestamp of last update
- `deleted_at` - Soft delete timestamp

---

### Modified Tables
List tables being modified:

#### Table: `profiles`
**Changes:**
- **Add Column:** `notification_preferences JSONB DEFAULT '{}'::jsonb`
- **Purpose:** Store user notification preferences

```sql
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{}'::jsonb;
```

---

### Removed Tables/Columns
List tables/columns being removed:

#### Column: `profiles.old_field`
**Reason for Removal:** No longer used, replaced by new_field
**Data Migration:** Data moved to `new_field` in previous migration V010

```sql
ALTER TABLE profiles
  DROP COLUMN IF EXISTS old_field;
```

---

## Indexes

### New Indexes
```sql
-- Index on foreign key for fast user-scoped queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON notifications(user_id);

-- Composite index for common query pattern (unread notifications)
CREATE INDEX IF NOT EXISTS idx_notifications_user_read
  ON notifications(user_id, read)
  WHERE deleted_at IS NULL;

-- GIN index for full-text search (if needed)
CREATE INDEX IF NOT EXISTS idx_notifications_message_gin
  ON notifications USING gin(to_tsvector('english', message));
```

**Index Justification:**
- `idx_notifications_user_id`: Needed for `WHERE user_id = ?` queries
- `idx_notifications_user_read`: Optimizes unread notification count query
- `idx_notifications_message_gin`: Enables full-text search on message content

---

## Row Level Security (RLS)

### RLS Policies
```sql
-- Enable RLS on table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own notifications
CREATE POLICY notifications__select__own
  ON notifications
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY notifications__update__own
  ON notifications
  FOR UPDATE
  USING (user_id = auth.uid());

-- Policy: Users can soft-delete their own notifications
CREATE POLICY notifications__delete__own
  ON notifications
  FOR DELETE
  USING (user_id = auth.uid());

-- Policy: System can insert notifications for any user
CREATE POLICY notifications__insert__system
  ON notifications
  FOR INSERT
  WITH CHECK (true); -- System-level insert only, not exposed to client
```

### RLS Testing
Test scenarios to verify RLS policies:

1. **User A can read own notifications:** ✅
2. **User A cannot read User B's notifications:** ✅
3. **User A can mark own notification as read:** ✅
4. **User A cannot mark User B's notification as read:** ✅
5. **User A can delete own notification:** ✅
6. **User A cannot delete User B's notification:** ✅

---

## Functions & Triggers

### Database Functions
```sql
-- Function to calculate unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INT
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::INT
  FROM notifications
  WHERE user_id = p_user_id
    AND read = FALSE
    AND deleted_at IS NULL;
$$;
```

### Triggers
```sql
-- Trigger function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger
CREATE TRIGGER trg_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();
```

---

## Data Migration

### Data Migration Required?
- [ ] Yes - Existing data needs to be migrated
- [x] No - New table, no existing data

### Migration Script (if applicable)
```sql
-- Example: Migrate old_notifications to new notifications table
INSERT INTO notifications (user_id, title, message, created_at)
SELECT
  user_id,
  subject AS title,
  body AS message,
  created_at
FROM old_notifications
WHERE migrated = FALSE;

-- Mark as migrated
UPDATE old_notifications SET migrated = TRUE;
```

### Rollback Data Migration
```sql
-- Rollback: Delete migrated notifications
DELETE FROM notifications
WHERE id IN (
  SELECT new_id FROM migration_log WHERE migration = 'V012'
);
```

---

## Migration Files

### Up Migration
**File:** `supabase/migrations/V012_add_notifications_table.sql`

```sql
-- ============================================
-- Migration: V012 - Add notifications table
-- Description: Support push/in-app notifications
-- Author: Database Agent
-- Date: 2025-01-15
-- ============================================

BEGIN;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  message VARCHAR(500) NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read) WHERE deleted_at IS NULL;

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY notifications__select__own ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY notifications__update__own ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY notifications__delete__own ON notifications FOR DELETE USING (user_id = auth.uid());
CREATE POLICY notifications__insert__system ON notifications FOR INSERT WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER trg_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at(); -- Assumes this function exists from previous migration

-- Add comment
COMMENT ON TABLE notifications IS 'Stores user notifications for push/in-app alerts';

COMMIT;
```

---

### Down Migration
**File:** `supabase/migrations/V012_add_notifications_table_down.sql`

```sql
-- ============================================
-- Rollback Migration: V012
-- ============================================

BEGIN;

-- Drop RLS policies
DROP POLICY IF EXISTS notifications__select__own ON notifications;
DROP POLICY IF EXISTS notifications__update__own ON notifications;
DROP POLICY IF EXISTS notifications__delete__own ON notifications;
DROP POLICY IF EXISTS notifications__insert__system ON notifications;

-- Drop triggers
DROP TRIGGER IF EXISTS trg_notifications_updated_at ON notifications;

-- Drop indexes
DROP INDEX IF EXISTS idx_notifications_user_id;
DROP INDEX IF EXISTS idx_notifications_user_read;

-- Drop table
DROP TABLE IF EXISTS notifications;

COMMIT;
```

---

## Testing

### Local Testing
```bash
# Apply migration
supabase migration up

# Verify table created
psql -d postgres -c "\d+ notifications"

# Verify indexes created
psql -d postgres -c "\di+ idx_notifications_*"

# Verify RLS enabled
psql -d postgres -c "SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'notifications';"

# Test rollback
supabase migration down

# Verify table dropped
psql -d postgres -c "\d+ notifications" # Should error
```

### RLS Testing
```sql
-- Set up test users
INSERT INTO auth.users (id, email) VALUES
  ('user-1', 'alice@test.com'),
  ('user-2', 'bob@test.com');

-- Insert test data as system
INSERT INTO notifications (user_id, title, message)
VALUES
  ('user-1', 'Test 1', 'Message for Alice'),
  ('user-2', 'Test 2', 'Message for Bob');

-- Test as user-1 (should see only own notification)
SET request.jwt.claim.sub = 'user-1';
SELECT * FROM notifications; -- Should return 1 row

-- Test as user-2 (should see only own notification)
SET request.jwt.claim.sub = 'user-2';
SELECT * FROM notifications; -- Should return 1 row

-- Test unauthorized access (should return 0 rows)
SET request.jwt.claim.sub = 'user-1';
SELECT * FROM notifications WHERE user_id = 'user-2'; -- Should return 0 rows (RLS blocks)
```

### Performance Testing
```sql
-- Test query performance with EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT * FROM notifications
WHERE user_id = 'user-1'
  AND read = FALSE
  AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 20;

-- Expected: Index Scan using idx_notifications_user_read
-- Expected: Execution Time < 50ms
```

---

## Performance Considerations

### Query Patterns
Expected query patterns this migration optimizes:

1. **Get unread notifications for user:**
```sql
SELECT * FROM notifications
WHERE user_id = ? AND read = FALSE AND deleted_at IS NULL
ORDER BY created_at DESC;
```
**Index Used:** `idx_notifications_user_read`

2. **Mark notification as read:**
```sql
UPDATE notifications
SET read = TRUE
WHERE id = ? AND user_id = ?;
```
**Index Used:** Primary key + `idx_notifications_user_id`

3. **Get notification count:**
```sql
SELECT COUNT(*) FROM notifications
WHERE user_id = ? AND deleted_at IS NULL;
```
**Index Used:** `idx_notifications_user_id`

### Performance Targets
- **Query Time:** <50ms (p95)
- **RLS Overhead:** <5ms
- **Index Scan:** Yes (no seq scans expected)

---

## Backwards Compatibility

### Breaking Changes?
- [ ] Yes - This migration breaks existing functionality
- [x] No - Additive change, no breaking changes

### API Impact
**New API Endpoints Required:**
- `GET /api/notifications` - List user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Soft delete

**Existing Endpoints Affected:**
- None

---

## Contract Updates

### Contracts to Update
- [ ] [schema.sql](contracts/database-contracts/schema.sql) - Add notifications table
- [ ] [indexes.sql](contracts/database-contracts/indexes.sql) - Add notification indexes
- [ ] [functions.sql](contracts/database-contracts/functions.sql) - Add helper functions (if any)
- [ ] [triggers.sql](contracts/database-contracts/triggers.sql) - Add updated_at trigger
- [ ] [dto-definitions.ts](contracts/data-contracts/dto-definitions.ts) - Add Notification DTO
- [ ] [notification-endpoints.yaml](contracts/api-contracts/notification-endpoints.yaml) - Add API contract

### New DTO
```typescript
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
```

---

## Rollback Plan

### When to Rollback
Rollback if:
- Migration fails to apply
- RLS policies block legitimate access
- Performance degrades significantly
- Data integrity issues detected

### Rollback Procedure
```bash
# 1. Stop application
pm2 stop relaai-api

# 2. Rollback migration
supabase migration down

# 3. Verify rollback
psql -d postgres -c "\d+ notifications" # Should not exist

# 4. Restart application
pm2 start relaai-api

# 5. Notify team
# Post in #engineering Slack channel
```

### Rollback Risk
- **Low Risk:** New table, no existing data to preserve
- **No Data Loss:** Table is new, dropping it loses no important data

---

## Deployment

### Pre-Deployment Checklist
- [ ] Migration tested on local database
- [ ] Migration tested on copy of production data (if available)
- [ ] RLS policies verified
- [ ] Performance benchmarks met
- [ ] Rollback script tested
- [ ] Contracts updated
- [ ] Handoff document completed
- [ ] Code review approved

### Deployment Steps
```bash
# 1. Backup production database
pg_dump relaai_production > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Apply migration to staging
supabase migration up --env staging

# 3. Verify on staging
psql -d relaai_staging -c "\d+ notifications"

# 4. Test on staging
npm run test:staging

# 5. Apply to production (if staging passed)
supabase migration up --env production

# 6. Verify on production
psql -d relaai_production -c "\d+ notifications"

# 7. Monitor logs
tail -f /var/log/postgres/postgresql.log
```

### Post-Deployment Verification
- [ ] Table exists in production
- [ ] Indexes created successfully
- [ ] RLS policies active
- [ ] Triggers working
- [ ] No errors in application logs
- [ ] API endpoints functional
- [ ] Performance acceptable

---

## Acceptance Criteria

### Definition of Done
- [ ] Migration file created (`V###_description.sql`)
- [ ] Rollback file created (`V###_description_down.sql`)
- [ ] Migration tested locally
- [ ] RLS policies tested with multiple users
- [ ] Performance benchmarks met
- [ ] Indexes verified with EXPLAIN ANALYZE
- [ ] Contracts updated
- [ ] Handoff document completed ([database-to-ui-handoff-template.md](coordination/handoff-protocols/database-to-ui-handoff-template.md))
- [ ] Code review approved
- [ ] Successfully deployed to staging
- [ ] Ready for production deployment

---

## Dependencies

### Blocked By
- [ ] None

### Blocks
- [ ] UI implementation of notification list screen
- [ ] API endpoints for notification CRUD operations
- [ ] Backend notification service

---

## Time Estimate
- **Estimated Time:** 4 hours
  - Schema design: 1 hour
  - Migration writing: 1 hour
  - Testing: 1 hour
  - Contract updates: 1 hour
- **Actual Time:** _____ (fill in when complete)

---

## Risks & Mitigation

### Risk 1: RLS Policies Too Restrictive
**Risk:** Users unable to access legitimate notifications
**Mitigation:** Thoroughly test with multiple user accounts, verify policies before production

### Risk 2: Performance Degradation
**Risk:** Queries slower than expected
**Mitigation:** Use EXPLAIN ANALYZE, create proper indexes, set performance budgets

### Risk 3: Migration Failure
**Risk:** Migration fails partway through
**Mitigation:** Use transactions (BEGIN/COMMIT), test rollback, have backup

---

## Notes & Questions

### Implementation Notes
- Use UUID for primary keys (consistent with other tables)
- Soft deletes via `deleted_at` column (don't hard delete user data)
- RLS policies prevent cross-user data access

### Questions
1. **Question:** Should we keep deleted notifications for analytics?
   - **Answer:** Yes, soft delete only. Purge after 90 days via cron job.

2. **Question:** What's the max number of notifications per user?
   - **Answer:** No hard limit. Show latest 100 in app, older ones archived.

---

## References
- **Database Contract:** [schema.sql](contracts/database-contracts/schema.sql)
- **API Contract:** [notification-endpoints.yaml](contracts/api-contracts/notification-endpoints.yaml)
- **DTO Definition:** [dto-definitions.ts](contracts/data-contracts/dto-definitions.ts)
- **Related Tasks:** TASK-145 (UI), TASK-146 (API)

---

**Assigned To:** Database Agent
**Created By:** [Agent/Person Name]
**Last Updated:** [YYYY-MM-DD]
