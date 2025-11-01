# Bug Fix Workflow

This workflow defines the complete process for identifying, triaging, fixing, and verifying bugs in the RelaAI project using the multi-agent system.

**Agents Involved:** QA Agent, Database Agent, Backend Agent (future), UI Designer Agent

---

## Workflow Overview

```
Report → Triage → Investigate → Fix → Test → Deploy → Verify
  ↓        ↓          ↓          ↓      ↓      ↓        ↓
 Bug    Priority   Root       Impl   QA    Release  Monitor
 Filed   Assigned   Cause      Fix   Check  to Prod  Metrics
```

**Typical Timeline:**
- **P0 (Critical):** <4 hours
- **P1 (High):** <24 hours
- **P2 (Medium):** <1 week
- **P3 (Low):** <1 month

---

## Phase 1: Bug Reporting

### Objective
Capture bug information with enough detail for reproduction and diagnosis.

### Responsible Agent
**Anyone (User, QA Agent, Developers)**

### Steps

#### 1.1 File Bug Report

Use [qa-bug-report-template.md](coordination/handoff-protocols/qa-bug-report-template.md):

**Required Information:**
- **Title:** Clear, concise description (e.g., "App crashes when deleting contact")
- **Severity:** P0, P1, P2, P3
- **Steps to Reproduce:** Numbered, specific steps
- **Expected Behavior:** What should happen
- **Actual Behavior:** What actually happens
- **Environment:** OS, device, app version
- **Screenshots/Logs:** Visual evidence
- **Frequency:** Always, Sometimes, Rare

**Example Bug Report:**
```markdown
# Bug: App crashes when deleting contact with scheduled messages

## Severity: P1 (High)

## Steps to Reproduce
1. Open app and login
2. Navigate to Contacts screen
3. Select a contact that has scheduled messages
4. Tap "Delete Contact"
5. Confirm deletion

## Expected Behavior
- Contact is deleted
- User returns to Contacts screen
- Scheduled messages for that contact are cancelled

## Actual Behavior
- App crashes immediately after confirming deletion
- User sees white screen or app restarts
- Contact is NOT deleted

## Environment
- iOS 17.2 on iPhone 14 Pro
- App version 1.2.0 (build 45)
- Supabase connection stable

## Screenshots
[Crash screenshot attached]

## Logs
```
Error: Cannot read property 'user_id' of null
  at deleteContact (ContactService.ts:125)
  at onDeletePress (ContactDetail.tsx:89)
```

## Frequency
- Always reproducible
- Affects 100% of users with scheduled messages
```

**Deliverables:**
- [ ] Bug report filed with all required information
- [ ] Assigned to appropriate agent
- [ ] Tagged with component (database, backend, frontend)

---

#### 1.2 Attach Supporting Evidence

**Screenshots:**
- Error messages
- UI visual bugs
- Unexpected behavior

**Logs:**
- Frontend console errors
- Backend API errors
- Database query errors
- Crash reports (Sentry, Crashlytics)

**Screen Recording:**
- Video showing bug reproduction
- Particularly useful for UI/UX bugs

**Network Requests:**
- Failed API calls
- Request/response payloads
- Status codes

**Deliverables:**
- [ ] Evidence attached to bug report
- [ ] Logs sanitized (no sensitive data)
- [ ] Bug report complete

---

## Phase 2: Bug Triage

### Objective
Assess severity, prioritize, and assign to correct agent.

### Responsible Agent
**QA Agent** or **Tech Lead**

### Steps

#### 2.1 Determine Severity

**P0 - Critical (Drop everything)**
- App crashes on startup
- Data loss or corruption
- Security vulnerability
- Complete feature outage
- Affects >50% of users

**P1 - High (Fix ASAP)**
- Major feature broken
- App crashes in common flow
- Severe performance degradation
- Affects 10-50% of users
- Workaround exists but difficult

**P2 - Medium (Fix in current sprint)**
- Minor feature broken
- UI/UX issue affecting usability
- Performance issue in specific scenario
- Affects <10% of users
- Easy workaround exists

**P3 - Low (Fix when convenient)**
- Cosmetic issue
- Edge case bug
- Nice-to-have feature request
- Affects <1% of users
- Minimal impact

**Deliverables:**
- [ ] Severity assigned (P0, P1, P2, P3)
- [ ] Reasoning documented
- [ ] Severity label added to ticket

---

#### 2.2 Identify Affected Component

**Database Layer:**
- Database errors
- RLS policy issues
- Query performance
- Data integrity issues

**Backend Layer:**
- API errors
- Business logic bugs
- Authentication/authorization
- Integration issues

**Frontend Layer:**
- UI rendering bugs
- Component crashes
- Navigation issues
- State management bugs

**Infrastructure:**
- Deployment issues
- Performance/scaling
- Third-party service failures

**Deliverables:**
- [ ] Component identified
- [ ] Bug assigned to correct agent
- [ ] Component label added to ticket

---

#### 2.3 Verify Reproducibility

**QA Agent attempts to reproduce:**
```bash
# 1. Set up same environment
# - Same device/OS version
# - Same app version
# - Same user state

# 2. Follow exact reproduction steps
# 3. Observe behavior
# 4. Document results
```

**Reproducibility Levels:**
- **Always:** 100% reproduction rate - highest priority
- **Often:** >50% reproduction rate - investigate environment factors
- **Sometimes:** <50% reproduction rate - likely race condition or environment-specific
- **Cannot Reproduce:** Unable to reproduce - request more info from reporter

**If Cannot Reproduce:**
- [ ] Request more detailed steps from reporter
- [ ] Ask for specific environment details
- [ ] Request screen recording
- [ ] Try different devices/OS versions
- [ ] Check if bug was already fixed in newer version

**Deliverables:**
- [ ] Reproduction attempted
- [ ] Reproducibility documented
- [ ] If reproducible, move to Phase 3
- [ ] If not reproducible, request more info

---

#### 2.4 Hotfix vs Regular Fix Decision

**Hotfix Criteria (expedited process):**
- [ ] Severity is P0
- [ ] Affects production users
- [ ] No workaround available
- [ ] Risk of rollback is low
- [ ] Fix is small and isolated

**Regular Fix Criteria (standard process):**
- [ ] Severity is P1-P3
- [ ] Workaround exists
- [ ] Can wait for next release
- [ ] Fix requires extensive testing
- [ ] Fix affects multiple components

**Hotfix Process:**
```bash
# 1. Create hotfix branch from production
git checkout production
git checkout -b hotfix/contact-delete-crash

# 2. Fix bug (minimal changes only)
# 3. Test fix
# 4. Deploy directly to production
# 5. Merge back to main
```

**Regular Fix Process:**
```bash
# 1. Create feature branch from main
git checkout main
git checkout -b fix/contact-delete-crash

# 2. Fix bug
# 3. Full testing cycle
# 4. Merge to main
# 5. Deploy with next release
```

**Deliverables:**
- [ ] Fix type decided (hotfix vs regular)
- [ ] Timeline communicated to stakeholders
- [ ] Branch strategy determined

---

## Phase 3: Root Cause Analysis

### Objective
Understand why the bug exists and identify the fix.

### Responsible Agent
**Assigned agent (varies by component)**

### Steps

#### 3.1 Reproduce Bug Locally

```bash
# Set up local environment exactly matching bug report
# - Same app version
# - Same database state
# - Same test data

# Enable detailed logging
DEBUG=* npm start

# Follow reproduction steps
# Observe logs, debugger, network requests
```

**Deliverables:**
- [ ] Bug reproduced locally
- [ ] Logs captured
- [ ] Stack trace obtained

---

#### 3.2 Investigate Root Cause

**Use debugging techniques:**

**For Frontend Bugs:**
```typescript
// Add breakpoints
debugger;

// Log state
console.log('State before delete:', state);

// Inspect Redux state
import { store } from './store';
console.log('Redux state:', store.getState());

// Check component lifecycle
useEffect(() => {
  console.log('Component mounted');
  return () => console.log('Component unmounted');
}, []);
```

**For Backend Bugs:**
```javascript
// Add logging
logger.info('Deleting contact', { contactId, userId });

// Inspect database state
const contact = await db.contacts.findById(contactId);
console.log('Contact before delete:', contact);

// Check error details
try {
  await deleteContact(contactId);
} catch (error) {
  logger.error('Delete failed', { error: error.stack });
  throw error;
}
```

**For Database Bugs:**
```sql
-- Check data integrity
SELECT * FROM contacts WHERE id = 'contact-id';
SELECT * FROM messages WHERE contact_id = 'contact-id';

-- Check constraints
\d+ contacts

-- Test query
EXPLAIN ANALYZE SELECT * FROM contacts WHERE id = 'contact-id';

-- Check RLS
SET ROLE authenticated;
SET request.jwt.claims.sub = 'user-id';
SELECT * FROM contacts WHERE id = 'contact-id';
RESET ROLE;
```

**Common Root Causes:**
- Null pointer exception
- Race condition
- Improper error handling
- Missing validation
- Incorrect state management
- Database constraint violation
- RLS policy too restrictive
- Memory leak
- Infinite loop

**Deliverables:**
- [ ] Root cause identified
- [ ] Documented in bug ticket
- [ ] Fix approach determined

---

#### 3.3 Assess Impact & Side Effects

**Before fixing, ask:**
- What other code depends on this?
- Will this fix break other features?
- Are there similar bugs elsewhere?
- Is this a symptom of a larger problem?

**Check for similar patterns:**
```bash
# Search for similar code patterns
grep -r "similar_pattern" mobile/src/

# Check if other components use same approach
grep -r "deleteContact" mobile/src/
```

**Deliverables:**
- [ ] Impact assessed
- [ ] Related code identified
- [ ] Similar bugs found and filed
- [ ] Fix scope determined

---

## Phase 4: Bug Fix Implementation

### Objective
Fix the bug with minimal side effects.

### Responsible Agent
**Assigned agent (Database, Backend, or UI Designer)**

### Steps

#### 4.1 Implement Fix

**For Frontend Bugs:**
```typescript
// Example: Fix null pointer exception
export const ContactDetail: React.FC<Props> = ({ route }) => {
  const { contactId } = route.params;
  const contact = useAppSelector(state => selectContactById(state, contactId));

  // BEFORE (buggy)
  const scheduledCount = contact.scheduledMessages.length; // Crashes if null

  // AFTER (fixed)
  const scheduledCount = contact?.scheduledMessages?.length ?? 0;

  const handleDelete = async () => {
    try {
      // BEFORE (buggy) - doesn't check for scheduled messages
      await dispatch(deleteContact(contactId));

      // AFTER (fixed) - cancel scheduled messages first
      if (scheduledCount > 0) {
        await dispatch(cancelScheduledMessages(contactId));
      }
      await dispatch(deleteContact(contactId));

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete contact');
    }
  };

  // ... rest of component
};
```

**For Database Bugs:**
```sql
-- Example: Fix cascade delete issue

-- BEFORE (buggy) - foreign key prevents deletion
ALTER TABLE messages
ADD CONSTRAINT fk_contact
FOREIGN KEY (contact_id) REFERENCES contacts(id);

-- AFTER (fixed) - cascade delete or set null
ALTER TABLE messages
DROP CONSTRAINT fk_contact;

ALTER TABLE messages
ADD CONSTRAINT fk_contact
FOREIGN KEY (contact_id) REFERENCES contacts(id)
ON DELETE CASCADE; -- or ON DELETE SET NULL depending on requirements
```

**For Backend Bugs:**
```javascript
// Example: Fix error handling

// BEFORE (buggy)
app.delete('/api/contacts/:id', async (req, res) => {
  const contact = await db.contacts.delete(req.params.id);
  res.json({ success: true });
});

// AFTER (fixed)
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const contact = await db.contacts.findOne({ id, userId });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Cancel scheduled messages first
    await db.messages.updateMany(
      { contactId: id, status: 'scheduled' },
      { status: 'cancelled' }
    );

    // Delete contact
    await db.contacts.delete(id);

    res.json({ success: true });
  } catch (error) {
    logger.error('Delete contact failed', { error, contactId: req.params.id });
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});
```

**Fix Principles:**
- Minimal change (don't refactor while fixing)
- Add error handling
- Add validation
- Add defensive checks (null checks, boundary checks)
- Document why the fix works

**Deliverables:**
- [ ] Bug fixed with minimal changes
- [ ] Error handling added
- [ ] Code commented explaining fix
- [ ] No new bugs introduced

---

#### 4.2 Add Regression Test

**CRITICAL:** Prevent this bug from happening again.

**Frontend Test:**
```typescript
// ContactDetail.test.tsx
describe('ContactDetail - Bug Fix: Delete with scheduled messages', () => {
  it('should cancel scheduled messages before deleting contact', async () => {
    // Arrange
    const contact = createMockContact({
      id: 'contact-1',
      scheduledMessages: [
        { id: 'msg-1', status: 'scheduled' },
        { id: 'msg-2', status: 'scheduled' },
      ],
    });

    const mockCancelScheduled = jest.fn().mockResolvedValue(true);
    const mockDeleteContact = jest.fn().mockResolvedValue(true);

    const { getByText } = render(
      <ContactDetail
        contact={contact}
        onCancelScheduled={mockCancelScheduled}
        onDelete={mockDeleteContact}
      />
    );

    // Act
    fireEvent.press(getByText('Delete Contact'));
    fireEvent.press(getByText('Confirm')); // Confirmation dialog

    // Assert
    await waitFor(() => {
      expect(mockCancelScheduled).toHaveBeenCalledWith('contact-1');
      expect(mockDeleteContact).toHaveBeenCalledWith('contact-1');
      expect(mockCancelScheduled).toHaveBeenCalledBefore(mockDeleteContact);
    });
  });

  it('should not crash if contact has no scheduled messages', async () => {
    // Arrange
    const contact = createMockContact({
      id: 'contact-1',
      scheduledMessages: null, // Edge case
    });

    const { getByText } = render(<ContactDetail contact={contact} />);

    // Act & Assert - should not crash
    expect(() => {
      fireEvent.press(getByText('Delete Contact'));
    }).not.toThrow();
  });
});
```

**Backend Test:**
```javascript
// contacts.test.js
describe('DELETE /api/contacts/:id - Bug Fix: Scheduled messages', () => {
  it('should cancel scheduled messages before deleting contact', async () => {
    // Arrange
    const user = await createTestUser();
    const contact = await createTestContact({ userId: user.id });
    const scheduledMsg = await createTestMessage({
      contactId: contact.id,
      status: 'scheduled',
      scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
    });

    // Act
    const response = await request(app)
      .delete(`/api/contacts/${contact.id}`)
      .set('Authorization', `Bearer ${user.token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    // Verify message was cancelled
    const message = await db.messages.findById(scheduledMsg.id);
    expect(message.status).toBe('cancelled');

    // Verify contact was deleted
    const deletedContact = await db.contacts.findById(contact.id);
    expect(deletedContact).toBeNull();
  });
});
```

**Database Test:**
```sql
-- test_cascade_delete.sql
BEGIN;

-- Arrange: Create test data
INSERT INTO contacts (id, user_id, name) VALUES
  ('test-contact-1', 'test-user-1', 'Test Contact');

INSERT INTO messages (id, contact_id, status) VALUES
  ('test-msg-1', 'test-contact-1', 'scheduled');

-- Act: Delete contact
DELETE FROM contacts WHERE id = 'test-contact-1';

-- Assert: Message should be cascade deleted or set to null
SELECT * FROM messages WHERE id = 'test-msg-1';
-- Expected: Row deleted (cascade) or contact_id = null (set null)

ROLLBACK;
```

**Deliverables:**
- [ ] Regression test added
- [ ] Test covers exact bug scenario
- [ ] Test includes edge cases
- [ ] Test passes

---

#### 4.3 Test Fix Manually

```bash
# 1. Apply fix locally
# 2. Reproduce original bug steps
# 3. Verify bug is fixed
# 4. Test edge cases
# 5. Test related functionality
```

**Test Checklist:**
- [ ] Original bug no longer occurs
- [ ] No new errors introduced
- [ ] Related features still work
- [ ] Performance not degraded
- [ ] UI/UX not broken

**Deliverables:**
- [ ] Manual testing complete
- [ ] Bug verified as fixed
- [ ] No side effects found

---

## Phase 5: QA Validation

### Objective
Verify the fix works and doesn't introduce new bugs.

### Responsible Agent
**QA Agent**

### Steps

#### 5.1 Verify Bug Fix

```bash
# Test exact reproduction steps from bug report
# Verify expected behavior occurs
# Test on all affected platforms (iOS, Android)
```

**Verification Checklist:**
- [ ] Bug no longer reproducible
- [ ] Fix works on iOS
- [ ] Fix works on Android
- [ ] Fix works on all device sizes
- [ ] No error messages

**Deliverables:**
- [ ] Bug fix verified
- [ ] Testing notes documented
- [ ] Screenshots/video of working feature

---

#### 5.2 Regression Testing

Test related features to ensure no side effects:

**For Contact Delete Bug:**
- [ ] Deleting contact without scheduled messages
- [ ] Deleting contact with sent messages
- [ ] Deleting contact with draft messages
- [ ] Viewing contact list after deletion
- [ ] Creating new contact after deletion
- [ ] Searching contacts after deletion

**Deliverables:**
- [ ] Regression tests passed
- [ ] No new bugs found
- [ ] Related features working

---

#### 5.3 Quality Gate Check

Use [qa-agent-quality-gate.md](coordination/review-gates/qa-agent-quality-gate.md):

- [ ] All tests passing
- [ ] Code coverage maintained (>80%)
- [ ] Performance benchmarks met
- [ ] Accessibility not broken
- [ ] No console errors
- [ ] No memory leaks

**Deliverables:**
- [ ] Quality gate passed
- [ ] Approval to merge

---

## Phase 6: Deployment

### Objective
Deploy the fix to production.

### Responsible Agent
**Tech Lead / DevOps**

### Steps

#### 6.1 Code Review

```bash
# Create pull request
git checkout main
git checkout -b fix/contact-delete-crash

# ... make fixes ...

git add .
git commit -m "Fix: Prevent crash when deleting contact with scheduled messages

- Cancel scheduled messages before deleting contact
- Add null checks for scheduledMessages array
- Add regression test

Fixes #123"

git push origin fix/contact-delete-crash
gh pr create --title "Fix: Contact delete crash" --body "Fixes #123"
```

**Review Checklist:**
- [ ] Code follows style guidelines
- [ ] Fix is minimal and targeted
- [ ] Tests added
- [ ] Comments explain why
- [ ] No unrelated changes
- [ ] Contracts updated if needed

**Deliverables:**
- [ ] PR created
- [ ] Code review approved
- [ ] All CI checks passing

---

#### 6.2 Merge & Deploy

**For Hotfix (P0):**
```bash
# Merge to main
gh pr merge --squash

# Deploy immediately
git checkout production
git merge main
git push production

# Tag release
git tag -a v1.2.1-hotfix -m "Hotfix: Contact delete crash"
git push origin v1.2.1-hotfix

# Monitor for 1 hour
```

**For Regular Fix (P1-P3):**
```bash
# Merge to main
gh pr merge --squash

# Wait for next release
# Will be included in v1.3.0
```

**Deliverables:**
- [ ] Fix merged to main
- [ ] Deployed to production (hotfix) or staged for release
- [ ] Release notes updated

---

#### 6.3 Verify in Production

```bash
# Test in production environment
# Use same steps as bug report
# Verify fix is live
# Monitor error rates
```

**Production Verification:**
- [ ] Bug no longer occurs in production
- [ ] Error rate decreased
- [ ] No new errors introduced
- [ ] User reports stopped

**Deliverables:**
- [ ] Production verification complete
- [ ] Metrics improved
- [ ] Bug marked as resolved

---

## Phase 7: Post-Fix Activities

### Objective
Ensure long-term quality and prevent recurrence.

### Steps

#### 7.1 Update Documentation

```markdown
# Known Issues
~~- App crashes when deleting contact with scheduled messages~~ (Fixed in v1.2.1)

# Changelog
## v1.2.1 (2025-01-15)
### Bug Fixes
- Fixed crash when deleting contact with scheduled messages (#123)
```

**Deliverables:**
- [ ] Changelog updated
- [ ] Known issues updated
- [ ] Release notes published

---

#### 7.2 Communicate Fix

**Internal:**
```
#engineering channel:
"✅ Bug Fix Deployed: Contact delete crash (P1)
- Fixed in v1.2.1
- Deployed to production at 2:00 PM UTC
- Monitoring for 24 hours
- No action required from team"
```

**External (if user-facing):**
```
Release Notes:
"Fixed an issue where the app would crash when deleting a contact
that had scheduled messages. The app now properly cancels scheduled
messages before removing the contact."
```

**To Bug Reporter:**
```
"Thanks for reporting this issue! We've fixed the bug in v1.2.1,
which is now live in production. Please update your app and verify
the fix. Let us know if you encounter any issues."
```

**Deliverables:**
- [ ] Team notified
- [ ] Users notified (if applicable)
- [ ] Bug reporter thanked
- [ ] Ticket closed

---

#### 7.3 Root Cause Prevention

Ask: "How do we prevent this category of bug in the future?"

**Prevention Strategies:**

**For null pointer bugs:**
- [ ] Enable strict null checks in TypeScript
- [ ] Add linter rule for optional chaining
- [ ] Add defensive programming guidelines

**For race conditions:**
- [ ] Add async operation guidelines
- [ ] Use proper locking mechanisms
- [ ] Add concurrency tests

**For validation bugs:**
- [ ] Strengthen input validation
- [ ] Add schema validation at API boundaries
- [ ] Use Zod or Joi for runtime validation

**For state management bugs:**
- [ ] Improve Redux patterns
- [ ] Add state machine for complex flows
- [ ] Better documentation of state transitions

**Deliverables:**
- [ ] Prevention measures identified
- [ ] Guidelines updated
- [ ] Team training scheduled (if needed)

---

#### 7.4 Post-Mortem (For P0/P1 bugs)

**Post-Mortem Template:**
```markdown
# Post-Mortem: Contact Delete Crash

## Summary
App crashed when users deleted contacts with scheduled messages,
affecting 100% of users in this scenario.

## Timeline
- 2025-01-14 10:00 AM: Bug introduced in v1.2.0 deployment
- 2025-01-14 11:30 AM: First user report received
- 2025-01-14 12:00 PM: Bug reproduced and triaged as P1
- 2025-01-14 1:00 PM: Root cause identified
- 2025-01-14 2:00 PM: Fix implemented and tested
- 2025-01-14 3:00 PM: Hotfix deployed to production
- 2025-01-14 4:00 PM: Verified in production

## Root Cause
The deleteContact function didn't check for or handle scheduled messages
before deletion, causing a null pointer exception when the component
tried to access scheduledMessages after contact was removed.

## What Went Well
- Bug was caught within 90 minutes of deployment
- Clear reproduction steps from user report
- Fast triage and prioritization
- Hotfix deployed within 5 hours
- No data loss occurred

## What Didn't Go Well
- Bug wasn't caught in testing before deployment
- No test coverage for this scenario
- Error handling was insufficient
- No monitoring alert triggered

## Action Items
1. [ ] Add regression test for delete with scheduled messages
2. [ ] Improve test coverage for contact deletion flows
3. [ ] Add error boundary around contact operations
4. [ ] Add monitoring alert for contact delete failures
5. [ ] Update testing checklist to include message states
6. [ ] Review similar patterns in other delete operations

## Lessons Learned
- Always test deletion with related data
- Add comprehensive error handling for user actions
- Improve test coverage for edge cases
- Better monitoring can catch issues faster
```

**Deliverables:**
- [ ] Post-mortem documented
- [ ] Action items assigned
- [ ] Lessons learned shared with team

---

## Decision Gates

### Gate 1: Is This a Bug?
**When:** Phase 2
**Criteria:** Reproducible, unintended behavior, affects users
**Options:**
- [ ] Yes - proceed with fix
- [ ] No - close as "Working as Intended"
- [ ] Defer - known limitation, not fixing now

---

### Gate 2: Hotfix or Regular?
**When:** Phase 2.4
**Criteria:** Severity P0, no workaround, production impact
**Options:**
- [ ] Hotfix - expedite deployment
- [ ] Regular - include in next release

---

### Gate 3: Ready to Deploy?
**When:** Phase 5
**Criteria:** Tests pass, QA approved, no side effects
**Options:**
- [ ] Deploy - all checks passed
- [ ] Revise - issues found, back to Phase 4

---

## Troubleshooting

### Issue: Cannot reproduce bug
**Solution:**
- Request more details from reporter
- Try different devices/OS versions
- Check app version matches
- Verify same backend environment
- Ask for screen recording

---

### Issue: Fix introduces new bug
**Solution:**
- Rollback fix
- Reassess approach
- Increase test coverage
- Consider alternative solution

---

### Issue: Root cause unclear
**Solution:**
- Add more logging
- Use debugger with breakpoints
- Simplify reproduction steps
- Consult with other developers
- Check git blame for recent changes

---

### Issue: Fix is too complex
**Solution:**
- Break into smaller fixes
- Consider refactoring separately
- Document technical debt
- Schedule proper fix for later

---

## Bug Fix Anti-Patterns

### DON'T:
- Don't fix bugs by copy-pasting code
- Don't make unrelated changes in bug fix PR
- Don't skip writing tests
- Don't deploy on Friday afternoon
- Don't fix symptoms instead of root cause
- Don't introduce breaking changes in bug fix
- Don't ignore similar bugs elsewhere

### DO:
- Write regression tests first (TDD)
- Keep fixes small and focused
- Add error handling
- Update documentation
- Communicate with team
- Learn from bugs
- Prevent recurrence

---

## Example: Contact Delete Crash (P1)

**Week 1 - Tuesday:**
- 10:00 AM: Bug introduced in v1.2.0 deployment
- 11:30 AM: User reports crash, includes video
- 12:00 PM: QA reproduces bug, triages as P1
- 1:00 PM: UI Designer identifies null pointer in scheduledMessages
- 2:00 PM: Fix implemented with optional chaining and proper flow
- 3:00 PM: Regression test added, QA validates
- 4:00 PM: Hotfix v1.2.1 deployed to production
- 5:00 PM: Verified in production, bug resolved

**Total Time:** 6 hours from report to resolution

---

## Example: Slow Contact Search (P2)

**Week 1 - Monday:**
- User reports slow search on large contact list
- QA verifies: 5+ second search time with 1000+ contacts
- Triaged as P2 (usability issue, not broken)

**Week 1 - Tuesday:**
- Database Agent investigates, finds missing index
- Root cause: Full table scan on contacts.name

**Week 1 - Wednesday:**
- Database Agent adds GIN index for full-text search
- Performance improves to <100ms

**Week 1 - Thursday:**
- QA validates performance improvement
- Regression tests added

**Week 2 - Monday:**
- Deployed with v1.3.0 regular release

**Total Time:** 1 week from report to deployment

---

## Success Indicators

- [ ] Bug fixed and verified
- [ ] Regression test added
- [ ] No new bugs introduced
- [ ] Deployed within SLA (P0: <4h, P1: <24h, P2: <1w)
- [ ] User satisfied with fix
- [ ] Documentation updated
- [ ] Team learned from bug
- [ ] Prevention measures implemented

---

**Remember:** Bugs are learning opportunities. Fix them quickly, prevent recurrence, and continuously improve quality!
