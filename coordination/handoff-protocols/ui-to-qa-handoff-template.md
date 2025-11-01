# UI Designer to QA Agent Handoff Template

## Handoff Metadata
- **From Agent:** UI Designer Agent
- **To Agent:** QA Agent
- **Date:** [YYYY-MM-DD]
- **Feature/Component:** [Feature or component name]
- **PR Number:** [#123 or N/A]
- **Branch:** [feature/branch-name]

---

## Summary
Brief description of what was implemented and why.

**Example:** "Implemented notification list screen with mark-as-read and delete functionality. Users can now view, interact with, and manage their notifications."

---

## Implementation Details

### Components Implemented
List all new/modified components:

#### 1. Component Name: `NotificationListScreen.tsx`
- **Type:** Screen
- **Location:** `mobile/src/screens/NotificationListScreen.tsx`
- **Purpose:** Display user notifications with filtering and actions
- **Props:** See [navigation-types.ts:42](contracts/component-contracts/navigation-types.ts#L42)
- **State Management:** Redux slice `notifications`
- **Key Features:**
  - Infinite scroll pagination
  - Pull-to-refresh
  - Mark as read/unread
  - Delete notification
  - Filter by read/unread status

#### 2. Component Name: `NotificationCard.tsx`
- **Type:** Molecule
- **Location:** `mobile/src/components/molecules/NotificationCard.tsx`
- **Purpose:** Individual notification card with actions
- **Props:** See [component-interfaces.ts:156](contracts/component-contracts/component-interfaces.ts#L156)
- **Dependencies:** Uses `Button`, `Avatar` atoms
- **Key Features:**
  - Swipe-to-delete gesture
  - Tap to mark read
  - Visual read/unread indicator

### Redux Changes
- **New Slice:** `notifications` at `mobile/src/store/slices/notificationsSlice.ts`
- **Actions:** `fetchNotifications`, `markAsRead`, `deleteNotification`, `setFilter`
- **Selectors:** `selectUnreadCount`, `selectFilteredNotifications`, `selectNotificationById`
- **State Shape:**
```typescript
{
  notifications: {
    items: Notification[];
    filter: 'all' | 'unread';
    loading: boolean;
    error: string | null;
    pagination: { hasMore: boolean; cursor: string | null };
  }
}
```

### Navigation Changes
- **New Route:** `NotificationList` in main tab navigator
- **Updated:** [navigation-types.ts:42](contracts/component-contracts/navigation-types.ts#L42)
- **Deep Linking:** `/notifications/:notificationId?`

### API Integration
- **Endpoints Used:**
  - `GET /api/notifications` - Fetch notifications
  - `PATCH /api/notifications/:id/read` - Mark as read
  - `DELETE /api/notifications/:id` - Soft delete
- **Contract Reference:** [notification-endpoints.yaml](contracts/api-contracts/notification-endpoints.yaml)

---

## Testing Requirements

### Unit Tests Required
- [ ] `NotificationCard.test.tsx` - Component rendering and props
- [ ] `NotificationListScreen.test.tsx` - Screen logic
- [ ] `notificationsSlice.test.ts` - Redux slice actions/reducers
- [ ] `notificationSelectors.test.ts` - Selector logic
- [ ] `notificationThunks.test.ts` - Async thunk behavior

**Target Coverage:** >80% for all components

### Integration Tests Required
- [ ] Notification fetch with Redux integration
- [ ] Mark as read flow (UI → Redux → API mock)
- [ ] Delete notification flow
- [ ] Filter toggle behavior
- [ ] Pagination logic

**Target Coverage:** >85%

### E2E Tests Required
- [ ] User navigates to notification list
- [ ] User marks notification as read
- [ ] User deletes notification
- [ ] Pull-to-refresh loads new notifications
- [ ] Infinite scroll loads more notifications
- [ ] Filter toggle shows correct items

**Test File:** `mobile/__tests__/e2e/notifications.e2e.ts`

---

## Test Scenarios

### Scenario 1: View Notification List
**Given:** User has 10 unread notifications
**When:** User navigates to notification screen
**Then:** All 10 notifications displayed with unread indicator

**Test Data:**
```json
[
  { "id": "1", "title": "Birthday wish", "read": false },
  { "id": "2", "title": "Message sent", "read": false }
]
```

### Scenario 2: Mark as Read
**Given:** User views unread notification
**When:** User taps on notification card
**Then:** Notification marked as read, visual indicator updates
**Expected API Call:** `PATCH /api/notifications/1/read`

### Scenario 3: Delete Notification
**Given:** User views any notification
**When:** User swipes left and taps delete
**Then:** Notification removed from list with animation
**Expected API Call:** `DELETE /api/notifications/1`

### Scenario 4: Filter Toggle
**Given:** User has mix of read/unread notifications
**When:** User toggles "Unread Only" filter
**Then:** Only unread notifications shown
**Expected:** No API call, client-side filtering

### Scenario 5: Empty State
**Given:** User has no notifications
**When:** User views notification screen
**Then:** Empty state message displayed: "No notifications yet"

### Scenario 6: Error Handling
**Given:** API returns 500 error
**When:** User pulls to refresh
**Then:** Error toast shown, retry button available

---

## Accessibility Testing

### Accessibility Requirements
- [ ] All interactive elements have accessibility labels
- [ ] Screen reader announces notification count
- [ ] VoiceOver reads notification content
- [ ] Focus order is logical (top to bottom)
- [ ] Contrast ratio >4.5:1 for text
- [ ] Tap targets ≥44x44 points
- [ ] Supports iOS Dynamic Type
- [ ] Supports Android TalkBack

**Accessibility Labels Added:**
- `NotificationCard`: `aria-label="Notification from {sender}, {title}, {unread ? 'unread' : 'read'}"`
- `DeleteButton`: `accessibilityLabel="Delete notification"`
- `MarkReadButton`: `accessibilityLabel="Mark as read"`

---

## Performance Testing

### Performance Targets
- **Initial Load:** <500ms for 20 notifications
- **Scroll Performance:** Maintain 60 FPS
- **Mark as Read:** <200ms response time
- **Delete Animation:** Smooth 250ms transition

### Performance Notes
- Used `React.memo()` on NotificationCard
- Implemented `FlatList` with `windowSize={10}`
- Debounced filter toggle by 300ms
- Optimized re-renders with `useCallback` hooks

---

## Visual/UI Testing

### Responsive Design
Test on these devices:
- [ ] iPhone SE (small screen - 375x667)
- [ ] iPhone 14 Pro (standard - 393x852)
- [ ] iPhone 14 Pro Max (large - 430x932)
- [ ] iPad Pro (tablet - 1024x1366)
- [ ] Android Pixel 5 (393x851)
- [ ] Android Samsung S21 (360x800)

### Theme Testing
- [ ] Light mode rendering
- [ ] Dark mode rendering
- [ ] High contrast mode (accessibility)

### Screenshots Provided
- **Location:** `docs/screenshots/notifications/`
- **Files:** `list-view.png`, `empty-state.png`, `delete-action.png`

---

## Edge Cases to Test

1. **Network offline:** App shows cached notifications, displays offline indicator
2. **Empty state:** No notifications exist, show empty state illustration
3. **Very long notification text:** Text truncates with ellipsis after 2 lines
4. **Rapid tapping:** Prevent duplicate API calls with loading state
5. **Concurrent deletes:** Handle optimistic UI updates correctly
6. **Stale data:** Pull-to-refresh updates with latest data
7. **Deep link:** Tapping notification deep links to relevant screen

---

## Known Issues & Limitations

### Known Issues
1. **Issue:** Swipe gesture conflicts with tab navigation on Android
   - **Workaround:** Increased swipe threshold to 75px
   - **Tracked In:** Issue #234

2. **Issue:** Notification badge count doesn't update immediately on iOS
   - **Workaround:** Manual badge update in AppDelegate
   - **Tracked In:** Issue #235

### Intentional Limitations
- Maximum 100 notifications cached locally (memory constraint)
- Images in notifications load lazily (performance)
- No notification sounds in this version (planned for v2)

---

## Dependencies & Setup

### Environment Setup
```bash
# Install dependencies
cd mobile && npm install

# Start Metro bundler
npm start

# Run iOS simulator
npm run ios

# Run Android emulator
npm run android
```

### Test Data Setup
```bash
# Seed test notifications
npm run db:seed:notifications

# Or use Supabase Studio to insert test data
```

### Feature Flags
- [ ] `ENABLE_NOTIFICATIONS` - Set to `true` in `.env`
- [ ] `NOTIFICATION_PAGE_SIZE` - Set to `20` (default)

---

## Regression Testing

### Existing Features to Verify
Ensure these existing features still work:
- [ ] Dashboard loads correctly
- [ ] Contact list navigation works
- [ ] Message generation flows unaffected
- [ ] Settings screen accessible
- [ ] Profile tab functioning

---

## Acceptance Criteria

QA Agent should verify:
- [ ] All unit tests written and passing (>80% coverage)
- [ ] All integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Accessibility requirements met (>90 score)
- [ ] Performance targets met
- [ ] Responsive design tested on all devices
- [ ] Edge cases handled gracefully
- [ ] No regressions in existing features
- [ ] Screenshots/recordings captured for documentation

---

## Quality Gate Checklist

UI Designer - Complete before handing off:
- [ ] TypeScript compiles with no errors
- [ ] ESLint passes with no warnings
- [ ] All components have prop interfaces defined in contracts
- [ ] All interactive elements have accessibility labels
- [ ] Components follow atomic design pattern
- [ ] Redux state shape documented
- [ ] No `any` types in code
- [ ] Code formatted with Prettier
- [ ] Manual testing completed on iOS and Android
- [ ] This handoff document completed

---

## Code Review Notes

### Files Changed
- `mobile/src/screens/NotificationListScreen.tsx` (new)
- `mobile/src/components/molecules/NotificationCard.tsx` (new)
- `mobile/src/store/slices/notificationsSlice.ts` (new)
- `mobile/src/navigation/MainNavigator.tsx` (modified)
- `contracts/component-contracts/navigation-types.ts` (modified)

### Lines of Code
- **Added:** ~450 lines
- **Modified:** ~50 lines
- **Deleted:** 0 lines

---

## Questions & Clarifications

**QA Agent - Add questions here before starting testing:**

1. Question: [Your question]
   - Answer: [UI Designer response]

---

## References
- **Component Contracts:** [component-interfaces.ts](contracts/component-contracts/component-interfaces.ts)
- **API Contracts:** [notification-endpoints.yaml](contracts/api-contracts/notification-endpoints.yaml)
- **Design Mockups:** `docs/designs/notifications.fig`
- **Related Issues:** #123, #124

---

**Next Steps:** QA Agent should review implementation, write comprehensive tests, and report any bugs or issues found.
