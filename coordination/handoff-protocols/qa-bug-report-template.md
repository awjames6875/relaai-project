# QA Bug Report Template

## Bug Metadata
- **Report ID:** [BUG-XXX]
- **Reporter:** QA Agent
- **Date Reported:** [YYYY-MM-DD]
- **Severity:** [Critical / High / Medium / Low]
- **Priority:** [P0 / P1 / P2 / P3]
- **Status:** [Open / In Progress / Fixed / Won't Fix / Duplicate]
- **Assigned To:** [UI Designer / Database Agent / Backend Agent]

---

## Bug Summary
One-line description of the bug.

**Example:** "Notification list crashes when user has >100 notifications"

---

## Severity & Priority

### Severity
**[Critical]** - Select one:
- [ ] **Critical** - App crashes, data loss, security vulnerability, or complete feature failure
- [ ] **High** - Major feature broken, significant UX issue, affects many users
- [ ] **Medium** - Minor feature issue, workaround exists, affects some users
- [ ] **Low** - Cosmetic issue, typo, minor UX inconvenience

### Priority
**[P0]** - Select one:
- [ ] **P0** - Fix immediately, blocks release
- [ ] **P1** - Fix before release
- [ ] **P2** - Fix in next sprint
- [ ] **P3** - Fix when time permits, backlog

---

## Environment

### Platform
- **OS:** [iOS 17.1 / Android 14 / Both]
- **Device:** [iPhone 14 Pro / Pixel 5 / Samsung S21]
- **App Version:** [v1.2.0-beta.3]
- **React Native Version:** [0.73.1]
- **Node Version:** [20.10.0]

### Environment Type
- [ ] Production
- [ ] Staging
- [ ] Development
- [ ] Local

### Feature Flags
List any feature flags enabled:
- `ENABLE_NOTIFICATIONS=true`
- `DEBUG_MODE=false`

---

## Steps to Reproduce

### Prerequisites
What setup is needed before reproducing:
1. User must be logged in
2. User must have >100 notifications in database
3. Notifications feature flag enabled

### Reproduction Steps
Detailed step-by-step instructions:

1. Open RelaAI app
2. Navigate to Notifications tab
3. Pull down to refresh
4. Scroll to bottom of list
5. **Bug occurs:** App crashes with "Too many re-renders" error

### Reproduction Rate
- [ ] **Always** - 100% reproduction rate
- [ ] **Often** - >75% reproduction rate
- [ ] **Sometimes** - 25-75% reproduction rate
- [ ] **Rare** - <25% reproduction rate

**Details:** Reproduced 10/10 times on iPhone 14 Pro, 0/10 times on Android

---

## Expected Behavior
What should happen:

**Expected:** Notification list should load all notifications with pagination, maintain 60 FPS, and allow smooth scrolling through 100+ items.

---

## Actual Behavior
What actually happens:

**Actual:** App crashes after scrolling through ~50 notifications with error:

```
Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.
```

Stack trace shows infinite loop in `NotificationCard` component's `useEffect` hook.

---

## Visual Evidence

### Screenshots
- **Before Bug:** `docs/bugs/BUG-156/before-crash.png`
- **Error State:** `docs/bugs/BUG-156/crash-screen.png`
- **Console Logs:** `docs/bugs/BUG-156/console-output.png`

### Screen Recording
- **File:** `docs/bugs/BUG-156/crash-recording.mov`
- **Duration:** 45 seconds
- **Shows:** Full reproduction from app launch to crash

### Console Output
```
[2025-01-15 14:32:15] INFO: Fetching notifications...
[2025-01-15 14:32:16] INFO: Loaded 100 notifications
[2025-01-15 14:32:18] WARN: Re-render detected in NotificationCard
[2025-01-15 14:32:18] ERROR: Maximum update depth exceeded
[2025-01-15 14:32:18] CRASH: Application terminated
```

---

## Technical Analysis

### Root Cause (if known)
**Component:** `NotificationCard.tsx:78`

**Issue:** Missing dependency array in `useEffect` hook causes infinite re-renders when notifications change. The effect runs on every render and triggers state update, causing another render.

**Problematic Code:**
```typescript
useEffect(() => {
  setIsRead(notification.read); // Triggers re-render
}); // Missing dependency array!
```

**Should be:**
```typescript
useEffect(() => {
  setIsRead(notification.read);
}, [notification.read]); // Proper dependency array
```

### Affected Components
- `mobile/src/components/molecules/NotificationCard.tsx` (primary)
- `mobile/src/screens/NotificationListScreen.tsx` (renders NotificationCard)
- Redux slice `notificationsSlice.ts` (state updates trigger re-renders)

### Error Logs
```
Invariant Violation: Too many re-renders. React limits the number of renders to prevent an infinite loop.
  at NotificationCard (NotificationCard.tsx:78)
  at FlatList (VirtualizedList.js:1234)
  at NotificationListScreen (NotificationListScreen.tsx:42)
```

---

## Impact Assessment

### User Impact
- **Affected Users:** All users with >50 notifications (~15% of user base)
- **User Experience:** Complete feature failure, app unusable
- **Workaround Available:** No workaround, users must delete notifications via web

### Business Impact
- [ ] **Revenue Impact** - Paid users cannot access notifications
- [x] **User Retention Risk** - Users may uninstall app
- [ ] **Security Risk** - No security implications
- [x] **Compliance Risk** - None

### Scope
- [ ] Affects all users
- [x] Affects subset of users (>100 notifications)
- [ ] Affects single user
- [ ] Cannot be reproduced

---

## Suggested Fix

### Proposed Solution
Add dependency array to `useEffect` hook in `NotificationCard.tsx`:

```typescript
// File: mobile/src/components/molecules/NotificationCard.tsx
// Line: 78

- useEffect(() => {
-   setIsRead(notification.read);
- });

+ useEffect(() => {
+   setIsRead(notification.read);
+ }, [notification.read]);
```

### Alternative Solutions
1. **Use `useMemo` instead:** Memoize derived state to prevent recalculation
2. **Remove local state:** Use `notification.read` directly in JSX
3. **Add React.memo:** Wrap component to prevent unnecessary re-renders

### Testing Requirements
After fix:
- [ ] Unit test: Verify component doesn't re-render unnecessarily
- [ ] Integration test: Verify list with 100+ items loads smoothly
- [ ] E2E test: Verify full user flow with large dataset
- [ ] Performance test: Verify 60 FPS maintained

---

## Related Issues

### Duplicates
- **BUG-142:** Similar infinite loop in MessageCard (fixed in v1.1.5)

### Related Bugs
- **BUG-145:** Notification list slow on low-end devices (related to performance)
- **BUG-150:** Memory leak in FlatList (might be related)

### Blocked By
- None

### Blocks
- **Feature #234:** Notification grouping (can't implement until this is fixed)
- **Feature #240:** Real-time notification updates

---

## Test Coverage

### Existing Tests
- [ ] Unit test exists but didn't catch this bug
- [x] No unit test for this component
- [ ] Integration test exists
- [ ] E2E test exists

### Why Tests Didn't Catch This
Test suite only tested with <10 notifications. Need to add test with 100+ items to catch performance/re-render issues.

### New Tests Required
1. **Unit Test:** `NotificationCard.test.tsx` - Verify no re-render loops
2. **Integration Test:** Load 100+ notifications, verify stable render
3. **E2E Test:** Scroll through large list, verify no crashes

---

## Regression Risk

### Risk Assessment
- [ ] **High Risk** - Fix might break other features
- [x] **Medium Risk** - Localized change, low regression risk
- [ ] **Low Risk** - No regression risk

### Regression Test Plan
After fix, verify:
- [ ] Notifications with <10 items still work
- [ ] Mark as read still functions
- [ ] Delete notification still works
- [ ] Filter toggle still works
- [ ] Pull-to-refresh still works

---

## Acceptance Criteria for Fix

Fix is complete when:
- [ ] No infinite re-render errors with 100+ notifications
- [ ] App maintains 60 FPS when scrolling large list
- [ ] Unit test added to prevent regression
- [ ] Integration test passes with 150+ notifications
- [ ] E2E test passes full user flow
- [ ] Code review approved
- [ ] QA verified fix on iOS and Android
- [ ] Performance benchmarks met

---

## Timeline

- **Reported:** 2025-01-15 14:30 UTC
- **Acknowledged:** 2025-01-15 15:00 UTC
- **Fix In Progress:** 2025-01-15 16:00 UTC
- **Fix Complete:** [TBD]
- **QA Verified:** [TBD]
- **Deployed to Production:** [TBD]

---

## Communication

### Stakeholders Notified
- [x] UI Designer Agent
- [x] Product Owner
- [ ] Backend Team (not affected)
- [ ] Users (will notify after fix)

### User Communication
**Status Page Update:** "We're aware of an issue affecting users with many notifications. Fix in progress, ETA 2 hours."

---

## Additional Notes

- This bug was introduced in commit `a3f5b2c` when NotificationCard was refactored
- Similar pattern should be checked in all other components
- Consider adding ESLint rule to catch missing dependency arrays
- Performance testing should include large datasets going forward

---

## Attachments
- `crash-recording.mov` - Screen recording
- `console-logs.txt` - Full console output
- `profiler-snapshot.json` - React Profiler data showing re-render loop

---

**Next Steps:** Assigned to UI Designer Agent for immediate fix. Expected resolution within 4 hours.
