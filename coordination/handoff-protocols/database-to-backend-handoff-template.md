# Database to Backend Handoff Template

## Handoff Metadata
- **From Agent:** Database Agent
- **To Agent:** Backend/API Agent
- **Date:** [YYYY-MM-DD]
- **Database Version:** [v1.2.0]
- **Schema Status:** [Ready for Integration]

---

## Summary
Brief overview of the database schema that's ready for backend API integration.

**Example:** "User notification system database schema is complete with all tables, RLS policies, indexes, and triggers. Backend can now implement API endpoints for notification CRUD operations."

---

## Schema Overview

### Tables Available
Complete list of tables ready for API integration:

| Table Name | Purpose | Primary Key | RLS Enabled |
|------------|---------|-------------|-------------|
| `profiles` | User accounts | `id` (uuid) | Yes |
| `contacts` | User contacts | `id` (uuid) | Yes |
| `messages` | Messages (draft/sent) | `id` (uuid) | Yes |
| `relationships` | Relationship health | `id` (uuid) | Yes |
| `personal_facts` | AI-extracted facts | `id` (uuid) | Yes |
| `message_templates` | Message templates | `id` (uuid) | Yes |
| `notifications` | Push notifications | `id` (uuid) | Yes |

### Entity Relationship Diagram
- **Location:** `docs/diagrams/erd.png`
- **Tool:** dbdiagram.io
- **Link:** https://dbdiagram.io/d/relaai-schema-xxxxx

---

## API Contract Mapping

### Endpoints to Implement
Map database tables to API endpoints:

#### 1. Notifications API
**Contract:** [notification-endpoints.yaml](contracts/api-contracts/notification-endpoints.yaml)

**Table:** `notifications`

**Endpoints Required:**
- `GET /api/notifications` → Fetch user's notifications
- `GET /api/notifications/:id` → Get single notification
- `PATCH /api/notifications/:id/read` → Mark as read
- `DELETE /api/notifications/:id` → Soft delete notification
- `GET /api/notifications/unread-count` → Get unread count

**RLS Handling:** User can only access their own notifications via `user_id = auth.uid()` policy

#### 2. Contacts API
**Contract:** [contact-endpoints.yaml](contracts/api-contracts/contact-endpoints.yaml)

**Table:** `contacts`, `relationships`, `personal_facts`

**Endpoints Required:**
- `GET /api/contacts` → List all contacts (with search/filter)
- `POST /api/contacts` → Create new contact
- `PATCH /api/contacts/:id` → Update contact
- `DELETE /api/contacts/:id` → Soft delete contact
- `GET /api/contacts/:id/relationship` → Get relationship health data
- `GET /api/contacts/:id/facts` → Get personal facts

**RLS Handling:** All contacts scoped to `user_id = auth.uid()`

---

## Database Functions

### Available Functions
PostgreSQL functions you can call from backend:

#### 1. `calculate_relationship_health(contact_id UUID)`
**Purpose:** Calculates health score (0-100) for a contact
**Returns:** JSONB with `{ score: number, temperature: string, trend: string }`
**Usage:**
```sql
SELECT calculate_relationship_health('550e8400-e29b-41d4-a716-446655440000');
```

**API Integration:** Call this function when `GET /api/contacts/:id/relationship` is requested

#### 2. `get_upcoming_occasions(user_id UUID, days_ahead INT)`
**Purpose:** Returns upcoming birthdays/anniversaries
**Returns:** Table of contacts with upcoming dates
**Usage:**
```sql
SELECT * FROM get_upcoming_occasions(auth.uid(), 30);
```

**API Integration:** Use for dashboard endpoint `GET /api/dashboard/upcoming-occasions`

#### 3. `full_text_search_contacts(user_id UUID, query TEXT)`
**Purpose:** Full-text search across contacts
**Returns:** Ranked list of matching contacts
**Usage:**
```sql
SELECT * FROM full_text_search_contacts(auth.uid(), 'sarah hiking');
```

**API Integration:** Use for `GET /api/contacts?search=sarah+hiking`

### Function Reference
**File:** [functions.sql](contracts/database-contracts/functions.sql)

---

## RLS Policies & Authentication

### Authentication Requirements
All API requests must include Supabase JWT token in `Authorization` header:

```
Authorization: Bearer <supabase-jwt-token>
```

The token is automatically validated by Supabase and `auth.uid()` is populated.

### RLS Policy Summary

| Table | Policy Name | Operations | Rule |
|-------|-------------|------------|------|
| `profiles` | `users_read_own_profile` | SELECT | `id = auth.uid()` |
| `profiles` | `users_update_own_profile` | UPDATE | `id = auth.uid()` |
| `contacts` | `users_manage_own_contacts` | ALL | `user_id = auth.uid()` |
| `messages` | `users_manage_own_messages` | ALL | `user_id = auth.uid()` |
| `notifications` | `users_read_own_notifications` | SELECT, UPDATE | `user_id = auth.uid()` |

**Important:** RLS is automatically enforced by PostgreSQL. Backend doesn't need to filter by `user_id` in WHERE clauses - the database does it automatically.

### Testing RLS Policies
**File:** `tests/database/rls-policies.test.sql`
**Command:** `npm run test:rls`

---

## Data Validation Rules

### Database Constraints
These constraints are enforced at database level:

#### Contacts Table
- `name` - NOT NULL, min 1 char, max 200 chars
- `email` - UNIQUE per user, valid email format (CHECK constraint)
- `phone` - E.164 format (CHECK constraint: `phone ~ '^\+[1-9]\d{1,14}$'`)
- `relationship_type` - ENUM: 'family', 'friend', 'colleague', 'romantic', 'other'

#### Messages Table
- `content` - NOT NULL, min 1 char, max 5000 chars
- `status` - ENUM: 'draft', 'scheduled', 'sent', 'failed'
- `scheduled_for` - Must be in the future if status='scheduled' (CHECK constraint)
- `tone` - ENUM: 'casual', 'formal', 'warm', 'professional', 'humorous'

#### Notifications Table
- `title` - NOT NULL, max 100 chars
- `message` - NOT NULL, max 500 chars
- `read` - BOOLEAN, default FALSE

**Recommendation:** Validate data in API layer BEFORE database insert for better error messages. Database constraints are last line of defense.

**Validation Schema Reference:** [validation-schemas.ts](contracts/data-contracts/validation-schemas.ts)

---

## Performance & Indexes

### Available Indexes
Optimized for common query patterns:

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| `contacts` | `idx_contacts_user_id` | `user_id` | Fast user-scoped queries |
| `contacts` | `idx_contacts_name_gin` | `name` (GIN) | Full-text search |
| `messages` | `idx_messages_user_contact` | `user_id, contact_id` | Filter by contact |
| `messages` | `idx_messages_status` | `status` | Filter by status |
| `notifications` | `idx_notifications_user_read` | `user_id, read` | Unread count query |
| `relationships` | `idx_relationships_user_contact` | `user_id, contact_id` | UNIQUE constraint |

### Query Performance Targets
- **Single row fetch:** <10ms (p95)
- **List query (20 items):** <50ms (p95)
- **Search query:** <100ms (p95)
- **Aggregation query:** <200ms (p95)

### Pagination Recommendations
**Cursor-based pagination** recommended for all list endpoints:

```sql
-- Example: Get next page of contacts
SELECT * FROM contacts
WHERE user_id = auth.uid()
  AND id > '550e8400-e29b-41d4-a716-446655440000' -- cursor
ORDER BY id ASC
LIMIT 20;
```

**Why:** More efficient than OFFSET for large datasets, prevents missing items when data changes.

**API Pattern:** Return `{ data: [...], cursor: "last-id", hasMore: true }`

---

## Sample Queries

### Common Query Patterns

#### 1. Get all contacts with pagination
```sql
SELECT
  c.*,
  r.health_score,
  r.temperature,
  COUNT(m.id) AS total_messages
FROM contacts c
LEFT JOIN relationships r ON c.id = r.contact_id
LEFT JOIN messages m ON c.id = m.contact_id
WHERE c.user_id = auth.uid()
  AND c.deleted_at IS NULL
GROUP BY c.id, r.health_score, r.temperature
ORDER BY c.name ASC
LIMIT 20;
```

#### 2. Get unread notification count
```sql
SELECT COUNT(*) AS unread_count
FROM notifications
WHERE user_id = auth.uid()
  AND read = FALSE
  AND deleted_at IS NULL;
```

#### 3. Search contacts by name/email
```sql
SELECT * FROM full_text_search_contacts(
  auth.uid(),
  'sarah'
) LIMIT 20;
```

#### 4. Get dashboard stats
```sql
SELECT
  (SELECT COUNT(*) FROM contacts WHERE user_id = auth.uid() AND deleted_at IS NULL) AS total_contacts,
  (SELECT COUNT(*) FROM messages WHERE user_id = auth.uid() AND status = 'sent') AS messages_sent,
  (SELECT AVG(health_score) FROM relationships WHERE user_id = auth.uid()) AS avg_health_score,
  (SELECT COUNT(*) FROM get_upcoming_occasions(auth.uid(), 7)) AS upcoming_occasions;
```

**Performance:** All queries <100ms with proper indexes

---

## Data Transfer Objects (DTOs)

### TypeScript Interfaces
Backend should use these DTOs for type safety:

**File:** [dto-definitions.ts](contracts/data-contracts/dto-definitions.ts)

**Key DTOs:**
```typescript
// Response DTOs
export interface Contact { /* ... */ }
export interface Message { /* ... */ }
export interface Notification { /* ... */ }
export interface Relationship { /* ... */ }

// Request DTOs
export interface CreateContactRequest { /* ... */ }
export interface UpdateContactRequest { /* ... */ }
export interface GenerateMessageRequest { /* ... */ }

// Pagination
export interface PaginatedResponse<T> { /* ... */ }
```

### API Response Format
**Standard Success Response:**
```json
{
  "success": true,
  "data": { /* entity or array */ },
  "meta": {
    "cursor": "uuid-string",
    "hasMore": true,
    "total": 150
  }
}
```

**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "not-an-email"
    }
  }
}
```

**Contract:** [error-types.ts](contracts/data-contracts/error-types.ts)

---

## Migration & Deployment

### Current Schema Version
- **Version:** v1.2.0
- **Migration Files:** `supabase/migrations/` directory
- **Total Migrations:** 12 files

### Deployment Instructions
```bash
# Connect to Supabase project
supabase link --project-ref your-project-ref

# Check migration status
supabase migration list

# Apply pending migrations
supabase db push

# Verify deployment
npm run db:verify
```

### Rollback Procedure
```bash
# Rollback last migration
supabase migration down

# Rollback to specific version
supabase migration down --version V010_add_notifications
```

---

## Testing & Seed Data

### Test Database Setup
```bash
# Start local Supabase (includes database)
supabase start

# Run seed script
npm run db:seed

# This will create:
# - 3 test users
# - 50 contacts per user
# - 100 messages per user
# - 20 notifications per user
```

### Seed Data Users
Use these credentials for testing:

| Email | Password | Has Data |
|-------|----------|----------|
| `alice@test.com` | `password123` | 50 contacts, 100 messages |
| `bob@test.com` | `password123` | 30 contacts, 50 messages |
| `charlie@test.com` | `password123` | 10 contacts, 20 messages |

### Sample API Test Script
```typescript
// Example: Fetch contacts for alice@test.com
const { data, error } = await supabase
  .from('contacts')
  .select('*')
  .order('name', { ascending: true })
  .limit(20);

console.log(data); // Array of contacts
```

---

## Real-time Subscriptions

### Available Subscriptions
Supabase provides real-time capabilities on these tables:

#### 1. Notifications Table
**Use Case:** Live notification updates

```typescript
// Backend can enable this for frontend
supabase
  .channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // New notification received
  })
  .subscribe();
```

#### 2. Messages Table
**Use Case:** Live message status updates

```typescript
supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'messages',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Message status changed (draft → sent)
  })
  .subscribe();
```

**Performance Note:** Real-time subscriptions have minimal overhead. Suitable for production use.

---

## Security Considerations

### SQL Injection Prevention
✅ **All queries use parameterized queries via Supabase client** - no SQL injection risk

### Data Exposure Prevention
✅ **RLS policies enforce user-scoped data** - users cannot access other users' data

### Rate Limiting Recommendations
Implement rate limiting at API gateway level:
- **Read endpoints:** 100 requests/minute per user
- **Write endpoints:** 30 requests/minute per user
- **Search endpoints:** 20 requests/minute per user (more expensive)

### Sensitive Data
**PII Fields:** `contacts.email`, `contacts.phone`, `profiles.email`
- **Recommendation:** Encrypt in transit (HTTPS only)
- **Recommendation:** Mask in logs
- **Recommendation:** GDPR compliance - allow data export/deletion

---

## Monitoring & Observability

### Database Metrics to Monitor
- **Connection Pool Usage:** Should stay <80%
- **Query Performance:** p95 latency per table
- **RLS Policy Performance:** Overhead should be <5ms
- **Slow Query Log:** Any query >200ms

### Logging Recommendations
**Log these events:**
- Database connection errors
- RLS policy violations (security concern)
- Slow queries (performance concern)
- Failed constraint validations (data quality concern)

**Tools:**
- Supabase Dashboard → Logs & Monitoring
- Custom backend logging with structured logs

---

## Known Limitations

1. **Soft Deletes:** All tables use soft deletes (`deleted_at`). Backend must filter `WHERE deleted_at IS NULL` in queries.

2. **UUID Primary Keys:** All IDs are UUIDs, not auto-increment integers. Backend must generate UUIDs or use `gen_random_uuid()`.

3. **Timestamp Timezone:** All timestamps use `timestamptz` (UTC). Backend must handle timezone conversion for display.

4. **JSONB Fields:** Some tables have `metadata` JSONB columns. Backend should validate JSON structure before insert.

5. **No CASCADE Deletes:** Soft deletes don't cascade. Backend must manually soft-delete related records if needed.

---

## Acceptance Criteria

Backend Agent should verify:
- [ ] All database tables understood and accessible
- [ ] RLS policies tested and verified
- [ ] Database functions identified and documented
- [ ] Sample queries tested successfully
- [ ] Seed data loaded and accessible
- [ ] Performance benchmarks understood
- [ ] Real-time subscription capabilities understood
- [ ] DTOs reviewed and matched to database schema
- [ ] Security considerations acknowledged
- [ ] Ready to implement API endpoints

---

## Handoff Checklist

Database Agent - Complete before handing off:
- [ ] All migrations applied to staging/dev environment
- [ ] RLS policies tested with multiple users
- [ ] Indexes verified with EXPLAIN ANALYZE
- [ ] Seed data script working
- [ ] Database functions tested
- [ ] Performance benchmarks documented
- [ ] All contracts updated
- [ ] ERD diagram generated
- [ ] This handoff document completed

---

## Questions & Clarifications

**Backend Agent - Add questions here:**

1. Question: [Your question]
   - Answer: [Database Agent response]

---

## References
- **Schema File:** [schema.sql](contracts/database-contracts/schema.sql)
- **Indexes File:** [indexes.sql](contracts/database-contracts/indexes.sql)
- **Functions File:** [functions.sql](contracts/database-contracts/functions.sql)
- **API Contracts:** [contracts/api-contracts/](contracts/api-contracts/)
- **DTO Definitions:** [dto-definitions.ts](contracts/data-contracts/dto-definitions.ts)
- **Supabase Docs:** https://supabase.com/docs

---

**Next Steps:** Backend Agent should implement API endpoints following the contracts, using the database schema and functions provided.
