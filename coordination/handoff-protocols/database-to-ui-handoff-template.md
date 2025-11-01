# Database to UI Designer Handoff Template

## Handoff Metadata
- **From Agent:** Database Agent
- **To Agent:** UI Designer Agent
- **Date:** [YYYY-MM-DD]
- **Database Version:** [e.g., v1.2.0]
- **Migration ID:** [e.g., V005_add_notification_table]

---

## Summary
Brief overview of what changed in the database schema and why.

**Example:** "Added notifications table to support push notification feature. Updated user preferences to include notification settings."

---

## Schema Changes

### Tables Added
- **Table Name:** `table_name`
  - **Purpose:** What this table stores
  - **Key Columns:** List important columns
  - **Relationships:** Foreign keys to other tables
  - **RLS Policies:** Enabled/Disabled, policy names

### Tables Modified
- **Table Name:** `existing_table`
  - **Columns Added:** List new columns with types
  - **Columns Modified:** List changed columns
  - **Indexes Added:** List new indexes
  - **RLS Changes:** Any policy updates

### Tables Removed
- **Table Name:** `deprecated_table`
  - **Reason:** Why it was removed
  - **Migration Notes:** Data migration strategy

---

## Contract Updates

### Updated Contracts
List all contract files that have been updated to reflect these changes:

- [ ] `contracts/database-contracts/schema.sql` - Updated
- [ ] `contracts/database-contracts/indexes.sql` - Updated
- [ ] `contracts/data-contracts/dto-definitions.ts` - Updated (if DTOs changed)
- [ ] `contracts/api-contracts/[endpoint].yaml` - Updated (if API affected)

### New DTOs Required
If new DTOs are needed, specify here:

```typescript
// Example:
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
```

---

## UI Impact

### Components Affected
List React Native components that need updates:

- **Component:** `ComponentName.tsx`
  - **Why:** Reason for change
  - **Action Required:** What needs to be done

### New Components Needed
- **Component:** `NewComponentName.tsx`
  - **Purpose:** What it should do
  - **Data Source:** Which table/endpoint it uses

### Redux State Updates
Indicate if Redux state shape needs to change:

- [ ] New slice needed: `sliceName`
- [ ] Existing slice update: `existingSlice` (add fields: X, Y, Z)
- [ ] No Redux changes required

---

## Sample Data

### Test Data
Provide sample data for testing the UI:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "title": "New message from Sarah",
  "message": "Your friend Sarah just sent you a birthday wish!",
  "read": false,
  "createdAt": "2025-01-15T10:30:00Z"
}
```

### Seed Script Location
- **File:** `path/to/seed/script.sql`
- **Command:** `npm run db:seed:notifications`

---

## Testing Scenarios

### Scenarios to Test
1. **Scenario:** User views notification list
   - **Expected Behavior:** All unread notifications appear first
   - **Test Data:** Use seed data above

2. **Scenario:** User marks notification as read
   - **Expected Behavior:** Notification moves to read section
   - **Test Data:** Toggle `read` field

3. **Scenario:** User deletes notification
   - **Expected Behavior:** Soft delete (deleted_at set)
   - **Test Data:** Verify deleted_at timestamp

---

## Performance Considerations
- **Query Performance:** Expected p95 latency for common queries
- **Indexes:** List indexes added for performance
- **Pagination:** Recommended page size for list views
- **Caching Strategy:** Suggestions for client-side caching

**Example:** "Notification queries should return <50ms for 100 items. Use cursor-based pagination with limit=20."

---

## Security & RLS

### RLS Policies Applied
- **Policy Name:** `users_read_own_notifications`
  - **Rule:** `user_id = auth.uid()`
  - **Operations:** SELECT, UPDATE

### Security Notes
- All notification operations require authentication
- Users can only see/modify their own notifications
- Admins have no special access (privacy-first design)

---

## Migration & Rollback

### Migration Instructions
```bash
# Apply migration
supabase migration up

# Verify migration
npm run db:verify
```

### Rollback Procedure
```bash
# Rollback if issues found
supabase migration down

# Restore previous state
git checkout HEAD~1 contracts/database-contracts/
```

---

## Dependencies & Blockers

### Prerequisites
- [ ] Supabase project updated to v2.x
- [ ] PostgreSQL 15+ required
- [ ] No blocking dependencies

### Known Issues
- None

---

## Acceptance Criteria

UI Designer should verify:
- [ ] All contract files reviewed and understood
- [ ] Sample data loads successfully in local Supabase
- [ ] Component requirements are clear
- [ ] No ambiguity in data structure
- [ ] Performance expectations are reasonable
- [ ] Ready to implement UI components

---

## Questions & Clarifications

**UI Designer - Add questions here before starting implementation:**

1. Question: [Your question]
   - Answer: [Database Agent response]

---

## Handoff Checklist

Database Agent - Complete before handing off:
- [ ] Schema migration tested locally
- [ ] RLS policies verified
- [ ] Indexes added for expected queries
- [ ] Sample/seed data provided
- [ ] All contracts updated
- [ ] Performance benchmarks documented
- [ ] This handoff document completed

---

## References
- **Migration File:** `path/to/migration/file.sql`
- **Contract Files:** Links to updated contracts
- **Related Issues:** Link to GitHub issues/tasks
- **Documentation:** Link to additional docs if needed

---

**Next Steps:** UI Designer Agent should review this handoff, ask clarifying questions, and begin component implementation once all questions are resolved.
