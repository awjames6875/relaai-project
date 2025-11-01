# Database Agent Quality Gate

This quality gate ensures Database Agent has met all quality standards before handing off schema changes to other agents.

**Purpose:** Prevent data integrity issues, ensure performance, and maintain security standards.

---

## When to Use This Quality Gate

Use this checklist **before**:
- Completing any database schema changes
- Creating new migrations
- Handing off to UI Designer or Backend Agent
- Deploying to staging/production

---

## Schema Design Quality Standards

### Table Design
- [ ] All tables follow naming convention (snake_case, plural)
- [ ] All tables have primary key
- [ ] Primary keys are UUIDs (not auto-increment integers)
- [ ] Foreign keys defined with proper constraints
- [ ] Column names descriptive and consistent
- [ ] Data types appropriate for data (no VARCHAR for numbers)
- [ ] NULL vs NOT NULL intentionally chosen
- [ ] Default values provided where appropriate
- [ ] Check constraints used for validation

**Example:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  title VARCHAR(100) NOT NULL,
  message VARCHAR(500) NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);
```

---

### Timestamps & Audit Trail
- [ ] `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()` on all tables
- [ ] `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()` on all tables
- [ ] `updated_at` trigger created for auto-update
- [ ] Timestamps use TIMESTAMPTZ (timezone-aware)
- [ ] Soft delete column `deleted_at TIMESTAMPTZ NULL` on user-facing tables

**Verification:**
```sql
-- Check all tables have timestamps
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
  AND table_name NOT IN (
    SELECT table_name FROM information_schema.columns
    WHERE column_name = 'created_at'
  );
```

**Expected:** Empty result (all tables have `created_at`)

---

### Relationships & Constraints
- [ ] All foreign keys have constraints defined
- [ ] Foreign key constraints have appropriate ON DELETE behavior:
  - `ON DELETE CASCADE` for dependent data
  - `ON DELETE SET NULL` for optional references
  - `ON DELETE RESTRICT` for protected references
- [ ] Composite keys used where appropriate
- [ ] Unique constraints defined where needed
- [ ] Check constraints validate data ranges

**Example:**
```sql
-- Good: Explicit ON DELETE behavior
ALTER TABLE messages
  ADD CONSTRAINT fk_messages_contact
  FOREIGN KEY (contact_id)
  REFERENCES contacts(id)
  ON DELETE CASCADE;
```

---

### Normalization
- [ ] Database is at least 3NF (Third Normal Form)
- [ ] No repeating groups
- [ ] No transitive dependencies
- [ ] JSONB used intentionally (not to avoid normalization)
- [ ] Denormalization documented if used for performance

---

## Migration Quality Standards

### Migration Files
- [ ] Migration follows naming convention: `V###_description.sql`
- [ ] Migration version number sequential
- [ ] Migration description clear and concise
- [ ] Migration tested on local database
- [ ] Migration is idempotent (can run multiple times safely)
- [ ] Rollback migration exists (`down.sql`)
- [ ] Migration completes in <5 minutes

**Naming Examples:**
- ✅ `V001_create_profiles_table.sql`
- ✅ `V012_add_notifications_table.sql`
- ✅ `V023_add_index_contacts_name.sql`
- ❌ `migration.sql`
- ❌ `new_table.sql`

---

### Migration Content
- [ ] Uses `CREATE TABLE IF NOT EXISTS` (idempotent)
- [ ] Uses `DROP TABLE IF EXISTS` in rollback
- [ ] No hardcoded values (use DEFAULT or variables)
- [ ] Comments explain non-obvious decisions
- [ ] No breaking changes without migration path
- [ ] Data migrations preserve existing data

**Example Idempotent Migration:**
```sql
-- Up migration
CREATE TABLE IF NOT EXISTS notifications (
  -- ...
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON notifications(user_id);

-- Down migration
DROP INDEX IF EXISTS idx_notifications_user_id;
DROP TABLE IF EXISTS notifications;
```

---

### Backwards Compatibility
- [ ] Additive changes preferred over destructive
- [ ] Column additions use DEFAULT or NULL
- [ ] Column renames use multi-step migration
- [ ] Table renames documented and communicated
- [ ] No data loss in migration

**Multi-Step Column Rename:**
```sql
-- Step 1: Add new column
ALTER TABLE contacts ADD COLUMN full_name VARCHAR(200);

-- Step 2: Backfill data
UPDATE contacts SET full_name = name WHERE full_name IS NULL;

-- Step 3: Update application code to use full_name

-- Step 4 (later migration): Drop old column
ALTER TABLE contacts DROP COLUMN name;
```

---

### Migration Testing
- [ ] Migration tested on empty database
- [ ] Migration tested on database with sample data
- [ ] Migration tested on copy of production data (if available)
- [ ] Rollback tested successfully
- [ ] Migration performance measured
- [ ] No errors in migration logs

**Testing Commands:**
```bash
# Test up migration
supabase migration up

# Verify schema
psql -d postgres -c "\d+ notifications"

# Test down migration
supabase migration down

# Verify rollback
psql -d postgres -c "\d+ notifications" # Should not exist
```

---

## Row Level Security (RLS) Quality Standards

### RLS Policies
- [ ] RLS enabled on **all user-scoped tables**
- [ ] Policies created for SELECT, INSERT, UPDATE, DELETE
- [ ] Policies use `auth.uid()` for user scoping
- [ ] Policies tested with different users
- [ ] Policies tested for unauthorized access attempts
- [ ] System tables (no user data) have RLS disabled

**Enable RLS:**
```sql
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
```

---

### Policy Definitions
- [ ] Policy names descriptive: `{table}__{operation}__{description}`
- [ ] Policies as restrictive as possible
- [ ] No overly permissive policies (e.g., `true` condition)
- [ ] Policies documented with comments

**Example:**
```sql
-- Allow users to read their own notifications
CREATE POLICY notifications__select__own
  ON notifications
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to update their own notifications
CREATE POLICY notifications__update__own
  ON notifications
  FOR UPDATE
  USING (user_id = auth.uid());

-- Allow users to soft-delete their own notifications
CREATE POLICY notifications__delete__own
  ON notifications
  FOR DELETE
  USING (user_id = auth.uid());
```

---

### RLS Testing
- [ ] Positive test: User can access own data
- [ ] Negative test: User cannot access others' data
- [ ] Negative test: Unauthenticated user cannot access data
- [ ] Performance test: RLS adds <5ms overhead

**Test Script:**
```sql
-- Create test users
INSERT INTO auth.users (id, email) VALUES
  ('user-1', 'alice@test.com'),
  ('user-2', 'bob@test.com');

-- Set session as user-1
SET request.jwt.claim.sub = 'user-1';

-- Insert data as user-1
INSERT INTO notifications (user_id, title, message)
  VALUES ('user-1', 'Test', 'Message for Alice');

-- Verify user-1 can see own data
SELECT * FROM notifications; -- Should return 1 row

-- Set session as user-2
SET request.jwt.claim.sub = 'user-2';

-- Verify user-2 cannot see user-1's data
SELECT * FROM notifications; -- Should return 0 rows
```

---

## Index Quality Standards

### Index Coverage
- [ ] Indexes on all foreign keys
- [ ] Indexes on frequently queried columns
- [ ] Composite indexes for multi-column queries
- [ ] Unique indexes for unique constraints
- [ ] GIN indexes for full-text search (if needed)
- [ ] GiST indexes for geometric data (if needed)

---

### Index Design
- [ ] Index column order optimized (most selective first)
- [ ] No redundant indexes (index on `(a, b)` covers `(a)`)
- [ ] Partial indexes used for filtered queries
- [ ] Index names descriptive: `idx_{table}_{columns}_{type}`

**Example:**
```sql
-- Foreign key index
CREATE INDEX idx_messages_contact_id ON messages(contact_id);

-- Composite index for common query
CREATE INDEX idx_messages_user_status ON messages(user_id, status);

-- Partial index for active records only
CREATE INDEX idx_contacts_active ON contacts(user_id)
  WHERE deleted_at IS NULL;

-- GIN index for full-text search
CREATE INDEX idx_contacts_name_gin ON contacts
  USING gin(to_tsvector('english', name));
```

---

### Index Performance
- [ ] `EXPLAIN ANALYZE` shows indexes are used
- [ ] Index selectivity high (unique values / total rows > 0.1)
- [ ] No sequential scans on large tables for common queries
- [ ] Index bloat monitored (<20% bloat acceptable)

**Verification:**
```sql
-- Check if index is used
EXPLAIN ANALYZE
SELECT * FROM notifications
WHERE user_id = 'some-uuid'
  AND read = FALSE;

-- Should show "Index Scan using idx_notifications_user_read"
-- Should NOT show "Seq Scan on notifications"
```

---

## Performance Quality Standards

### Query Performance
- [ ] Common queries <100ms (p95)
- [ ] Single-row fetches <10ms (p95)
- [ ] List queries with pagination <50ms (p95)
- [ ] Search queries <200ms (p95)
- [ ] Aggregation queries <500ms (p95)

**Measurement:**
```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM contacts
WHERE user_id = auth.uid()
ORDER BY name
LIMIT 20;

-- Check "Execution Time:" in output
```

---

### Query Optimization
- [ ] No N+1 query patterns
- [ ] JOINs optimized with proper indexes
- [ ] WHERE clauses use indexed columns
- [ ] Subqueries avoided when JOIN possible
- [ ] CTEs used for readability (but monitored for performance)

**Bad (N+1 pattern):**
```sql
-- First query
SELECT id FROM contacts WHERE user_id = 'uuid';

-- Then for each contact (N queries)
SELECT * FROM messages WHERE contact_id = ?;
```

**Good (single JOIN):**
```sql
SELECT c.*, m.*
FROM contacts c
LEFT JOIN messages m ON c.id = m.contact_id
WHERE c.user_id = 'uuid';
```

---

### Pagination
- [ ] Cursor-based pagination for large datasets
- [ ] LIMIT clause on all list queries
- [ ] Offset pagination avoided for large datasets

**Cursor Pagination:**
```sql
-- Page 1
SELECT * FROM contacts
WHERE user_id = auth.uid()
ORDER BY id
LIMIT 20;

-- Page 2 (using last ID from page 1)
SELECT * FROM contacts
WHERE user_id = auth.uid()
  AND id > 'last-id-from-page-1'
ORDER BY id
LIMIT 20;
```

---

## Function & Trigger Quality Standards

### Database Functions
- [ ] Functions have clear purpose
- [ ] Functions are IMMUTABLE, STABLE, or VOLATILE (explicitly defined)
- [ ] Functions have return type defined
- [ ] Functions handle NULL inputs
- [ ] Functions have error handling
- [ ] Functions documented with comments

**Example:**
```sql
CREATE OR REPLACE FUNCTION calculate_relationship_health(
  p_contact_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE -- Function doesn't modify database
AS $$
DECLARE
  v_health_score INT;
  v_temperature VARCHAR;
BEGIN
  -- Calculate health score logic
  SELECT health_score INTO v_health_score
  FROM relationships
  WHERE contact_id = p_contact_id;

  -- Determine temperature
  v_temperature := CASE
    WHEN v_health_score >= 75 THEN 'hot'
    WHEN v_health_score >= 50 THEN 'warm'
    ELSE 'cold'
  END;

  RETURN jsonb_build_object(
    'score', v_health_score,
    'temperature', v_temperature
  );
END;
$$;
```

---

### Triggers
- [ ] Triggers only used when necessary (prefer application logic)
- [ ] Triggers are BEFORE or AFTER (intentionally chosen)
- [ ] Triggers are FOR EACH ROW or FOR EACH STATEMENT
- [ ] Triggers don't cause cascading updates
- [ ] Trigger functions return proper type (NEW or NULL)

**Example:**
```sql
-- Trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
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
  EXECUTE FUNCTION update_updated_at();
```

---

### Function Testing
- [ ] Functions tested with valid inputs
- [ ] Functions tested with edge cases
- [ ] Functions tested with NULL inputs
- [ ] Functions performance benchmarked

**Test:**
```sql
-- Test function
SELECT calculate_relationship_health('550e8400-e29b-41d4-a716-446655440000');

-- Expected: {"score": 85, "temperature": "hot"}
```

---

## Security Quality Standards

### SQL Injection Prevention
- [ ] All queries parameterized (via Supabase client)
- [ ] No dynamic SQL construction
- [ ] No user input directly in queries
- [ ] Functions use parameter binding

---

### Data Exposure Prevention
- [ ] RLS enabled on all user tables
- [ ] No public data access without authentication
- [ ] Sensitive columns encrypted if needed
- [ ] No passwords in plain text

---

### Privilege Management
- [ ] Minimal privileges granted to roles
- [ ] Public role has no write access to user tables
- [ ] Authenticated role scoped to own data via RLS

---

## Data Integrity Quality Standards

### Constraints
- [ ] Primary keys enforced
- [ ] Foreign keys enforced
- [ ] Unique constraints where needed
- [ ] Check constraints for valid ranges
- [ ] NOT NULL for required fields

**Example:**
```sql
ALTER TABLE contacts
  ADD CONSTRAINT chk_contacts_email
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE messages
  ADD CONSTRAINT chk_messages_status
  CHECK (status IN ('draft', 'scheduled', 'sent', 'failed'));
```

---

### Data Validation
- [ ] Email format validated
- [ ] Phone format validated (E.164)
- [ ] Enum values constrained
- [ ] Date ranges validated
- [ ] String lengths limited

---

## Contract Compliance

### Database Contracts
- [ ] [schema.sql](contracts/database-contracts/schema.sql) updated
- [ ] [indexes.sql](contracts/database-contracts/indexes.sql) updated
- [ ] [functions.sql](contracts/database-contracts/functions.sql) updated
- [ ] [triggers.sql](contracts/database-contracts/triggers.sql) updated

### Data Contracts
- [ ] [dto-definitions.ts](contracts/data-contracts/dto-definitions.ts) matches schema
- [ ] DTOs have correct field types
- [ ] DTOs include all table columns
- [ ] Optional fields marked correctly

---

## Documentation Quality Standards

### Schema Documentation
- [ ] Table comments describe purpose
- [ ] Column comments explain non-obvious fields
- [ ] Complex queries documented
- [ ] Migration notes written

**Example:**
```sql
COMMENT ON TABLE notifications IS
  'Stores user notifications for push/in-app alerts';

COMMENT ON COLUMN notifications.read IS
  'Whether user has marked notification as read';
```

---

### ERD Diagram
- [ ] ERD diagram generated and up-to-date
- [ ] ERD shows all tables and relationships
- [ ] ERD saved in `docs/diagrams/erd.png`
- [ ] ERD source file committed (dbdiagram.io, etc.)

---

## Pre-Handoff Final Check

### Local Testing
- [ ] All migrations applied successfully
- [ ] Sample data seeded
- [ ] Queries tested with sample data
- [ ] RLS policies verified
- [ ] Performance benchmarks met

**Commands:**
```bash
# Apply migrations
supabase migration up

# Seed data
npm run db:seed

# Verify schema
psql -d postgres -c "\dt"

# Test queries
npm run db:test
```

---

### Handoff Documentation
- [ ] [database-to-ui-handoff-template.md](coordination/handoff-protocols/database-to-ui-handoff-template.md) completed (if UI changes)
- [ ] [database-to-backend-handoff-template.md](coordination/handoff-protocols/database-to-backend-handoff-template.md) completed (if backend changes)
- [ ] Sample queries documented
- [ ] Performance benchmarks documented
- [ ] Known limitations documented

---

## Quality Gate Approval

### Self-Review
- [ ] All checklist items completed
- [ ] Migrations tested multiple times
- [ ] RLS policies tested with different users
- [ ] Performance benchmarks met
- [ ] Ready for peer review

### Peer Review (if applicable)
- Reviewer Name: _______________
- Review Date: _______________
- **Status:** [ ] Approved / [ ] Changes Requested

---

## Quality Gate Decision

**[ ] PASS** - Ready to hand off to UI Designer / Backend Agent
**[ ] FAIL** - Address issues before handoff

**Issues to Address:**
1. _______________________
2. _______________________
3. _______________________

---

**Signature:** Database Agent
**Date:** _______________
**Next Agent:** _______________

---

**Remember:** Database changes are hard to rollback in production. Take extra care with this quality gate!
