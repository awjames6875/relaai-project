# Component Implementation Task Template

## Task Metadata
- **Task ID:** [TASK-XXX]
- **Task Type:** Component Implementation
- **Agent:** UI Designer Agent
- **Priority:** [P0 / P1 / P2 / P3]
- **Status:** [To Do / In Progress / In Review / Done]
- **Created:** [YYYY-MM-DD]
- **Due Date:** [YYYY-MM-DD]

---

## User Story

**As a** [type of user]
**I want** [goal/desire]
**So that** [benefit/value]

**Example:**
> As a RelaAI user, I want to view a list of my notifications, so that I can stay updated on important events and messages.

---

## Component Overview

### Component Name
`ComponentName` (e.g., `NotificationListScreen`, `ContactCard`)

### Component Type
- [ ] Atom (Button, Input, Avatar, Badge, Icon)
- [ ] Molecule (SearchBar, MessageCard, FormField)
- [ ] Organism (MessageList, ContactList, Dashboard)
- [ ] Screen (Full page component)

### Component Location
`mobile/src/components/[atoms|molecules|organisms]/ComponentName.tsx`

or

`mobile/src/screens/ComponentName.tsx`

---

## Functional Requirements

### Primary Functionality
List the main features this component must implement:

1. **Requirement 1:** Display list of notifications
2. **Requirement 2:** Allow user to mark notification as read
3. **Requirement 3:** Allow user to delete notification
4. **Requirement 4:** Support pull-to-refresh
5. **Requirement 5:** Support infinite scroll pagination

### Secondary Functionality
Nice-to-have features (not blocking):

1. **Feature:** Filter by read/unread status
2. **Feature:** Swipe-to-delete gesture
3. **Feature:** Notification grouping by date

---

## Component Props

### Required Props
```typescript
interface ComponentNameProps {
  // TODO: Define props interface
  data: DataType[];
  onItemPress: (id: string) => void;
  // ... other props
}
```

### Optional Props
```typescript
interface ComponentNameProps {
  // ... required props
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  testID?: string;
}
```

### Props Contract
- [ ] Props interface defined in [component-interfaces.ts](contracts/component-contracts/component-interfaces.ts)
- [ ] Props documented with JSDoc comments
- [ ] Default props provided for optional props

---

## Visual Design

### Design Mockups
- **Figma Link:** [URL to Figma design]
- **Screenshot:** `docs/designs/component-name.png`

### Design Specifications
- **Width:** Full width minus 16px padding
- **Height:** Dynamic (based on content)
- **Spacing:** 16px between items
- **Border Radius:** 8px (theme.borderRadius.md)
- **Background:** theme.colors.surface
- **Text Color:** theme.colors.text

### Responsive Behavior
- **Small screens (375px):** Single column, 16px padding
- **Large screens (>400px):** Single column, 24px padding
- **Tablet (>768px):** Two columns, 32px padding

---

## State Management

### Local State
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
// ... other local state
```

### Redux State
- **Slice:** `notificationsSlice`
- **State Shape:**
```typescript
{
  items: Notification[];
  filter: 'all' | 'unread';
  loading: boolean;
  error: string | null;
}
```

- **Actions:** `fetchNotifications`, `markAsRead`, `deleteNotification`
- **Selectors:** `selectNotifications`, `selectUnreadCount`, `selectFilteredNotifications`

### Redux Contract
- [ ] State shape defined in [redux-types.ts](contracts/component-contracts/redux-types.ts)
- [ ] Slice created in `mobile/src/store/slices/`
- [ ] Selectors created in `mobile/src/store/selectors/`

---

## Data & API Integration

### Data Source
- **API Endpoint:** `GET /api/notifications`
- **Contract:** [notification-endpoints.yaml](contracts/api-contracts/notification-endpoints.yaml)
- **Response DTO:** `PaginatedResponse<Notification>`

### Sample Data
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "user-123",
      "title": "Birthday Reminder",
      "message": "Sarah's birthday is tomorrow!",
      "read": false,
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "cursor": "next-page-cursor",
    "hasMore": true
  }
}
```

---

## Navigation

### Navigation Params
```typescript
// In navigation-types.ts
export type MainStackParamList = {
  NotificationList: undefined;
  NotificationDetail: { notificationId: string };
};
```

### Navigation Actions
- **Navigate to:** `NotificationDetail` when notification tapped
- **Navigate from:** `Dashboard`, `Profile`
- **Deep Link:** `/notifications/:notificationId?`

---

## Styling Requirements

### Theme Usage
```typescript
const Container = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
`;
```

- [ ] All colors from theme
- [ ] All spacing from theme
- [ ] All typography from theme
- [ ] Dark mode support

### Platform-Specific Styles
```typescript
const shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: {
    elevation: 3,
  },
});
```

---

## Accessibility Requirements

### Accessibility Labels
```typescript
<TouchableOpacity
  accessibilityLabel="Mark notification as read"
  accessibilityRole="button"
  accessibilityHint="Tap to mark this notification as read"
  onPress={handleMarkRead}
>
  <Icon name="check" />
</TouchableOpacity>
```

### Requirements Checklist
- [ ] All interactive elements have `accessibilityLabel`
- [ ] Correct `accessibilityRole` assigned
- [ ] `accessibilityHint` for complex actions
- [ ] State changes announced
- [ ] VoiceOver/TalkBack tested
- [ ] Tap targets ≥44x44 points
- [ ] Color contrast ≥4.5:1
- [ ] Dynamic Type supported

---

## Performance Requirements

### Performance Targets
- [ ] Initial render <500ms
- [ ] Scrolling at 60 FPS
- [ ] No memory leaks
- [ ] Bundle size impact <100KB

### Optimization Techniques
- [ ] Use FlatList for lists (not ScrollView)
- [ ] Use React.memo for list items
- [ ] Use useCallback for event handlers
- [ ] Use useMemo for expensive calculations
- [ ] Lazy load images
- [ ] Implement pagination

---

## Testing Requirements

### Unit Tests
```typescript
// ComponentName.test.tsx
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interaction', () => {
    // Test implementation
  });

  it('should display loading state', () => {
    // Test implementation
  });

  it('should display error state', () => {
    // Test implementation
  });

  it('should display empty state', () => {
    // Test implementation
  });
});
```

### Test Coverage
- [ ] Component rendering tests
- [ ] User interaction tests
- [ ] Loading/error/empty state tests
- [ ] Accessibility tests
- [ ] Snapshot tests
- [ ] Coverage >80%

---

## Edge Cases

### Edge Cases to Handle
1. **Empty data:** Show empty state with illustration and message
2. **Very long text:** Truncate after 2 lines with ellipsis
3. **Network offline:** Show cached data with offline indicator
4. **Rapid tapping:** Debounce or prevent duplicate actions
5. **Large datasets:** Implement pagination, show loading indicator
6. **Slow network:** Show loading skeleton while fetching

---

## Acceptance Criteria

### Definition of Done
- [ ] Component renders correctly on all screen sizes
- [ ] All functional requirements implemented
- [ ] Redux integration working
- [ ] Navigation working
- [ ] Accessibility requirements met
- [ ] Performance targets met
- [ ] Unit tests written (>80% coverage)
- [ ] TypeScript compiles with no errors
- [ ] ESLint passes with no warnings
- [ ] Manually tested on iOS and Android
- [ ] Props interface in component contracts
- [ ] Code reviewed and approved
- [ ] Handoff document completed

### Verification Checklist
- [ ] **Happy path works:** User can complete primary flow
- [ ] **Error cases handled:** App doesn't crash on errors
- [ ] **Empty state shows:** Appropriate message when no data
- [ ] **Loading state shows:** Indicator during async operations
- [ ] **Accessibility passes:** VoiceOver/TalkBack navigation works
- [ ] **Performance acceptable:** 60 FPS scrolling, <500ms render

---

## Dependencies

### Blocked By
- [ ] Database schema for notifications ready
- [ ] API endpoint `/api/notifications` implemented
- [ ] Notification DTO defined

### Blocks
- [ ] E2E tests for notification flow
- [ ] Notification feature release

---

## Implementation Steps

### Step 1: Setup
1. Create component file: `mobile/src/components/molecules/ComponentName.tsx`
2. Create props interface in `contracts/component-contracts/component-interfaces.ts`
3. Create test file: `mobile/src/components/molecules/ComponentName.test.tsx`

### Step 2: Basic Structure
1. Implement basic component structure
2. Add props interface and types
3. Add JSDoc comments
4. Export component

### Step 3: Styling
1. Create styled components
2. Use theme for colors/spacing/typography
3. Add platform-specific styles
4. Test on multiple screen sizes

### Step 4: Functionality
1. Implement primary features
2. Add user interaction handlers
3. Add loading/error/empty states
4. Integrate with Redux (if needed)

### Step 5: Accessibility
1. Add accessibility labels
2. Add accessibility roles
3. Test with VoiceOver/TalkBack
4. Ensure tap targets are large enough

### Step 6: Testing
1. Write unit tests
2. Write accessibility tests
3. Write snapshot tests
4. Verify coverage >80%

### Step 7: Review
1. Self-review using [ui-designer-quality-gate.md](coordination/review-gates/ui-designer-quality-gate.md)
2. Complete [ui-to-qa-handoff-template.md](coordination/handoff-protocols/ui-to-qa-handoff-template.md)
3. Request code review
4. Address review comments

---

## Time Estimate
- **Estimated Time:** [X hours/days]
- **Actual Time:** [X hours/days] (fill in when complete)

---

## Notes & Questions

### Implementation Notes
- Note 1: Consider using memoization for expensive calculations
- Note 2: May need to optimize FlatList rendering for large datasets

### Questions
1. **Question:** Should notifications auto-dismiss after being read?
   - **Answer:** [To be answered]

2. **Question:** What happens when user deletes last notification?
   - **Answer:** Show empty state with encouraging message

---

## References
- **Design:** [Figma link]
- **API Contract:** [notification-endpoints.yaml](contracts/api-contracts/notification-endpoints.yaml)
- **Component Contract:** [component-interfaces.ts](contracts/component-contracts/component-interfaces.ts)
- **Redux Contract:** [redux-types.ts](contracts/component-contracts/redux-types.ts)
- **Related Tasks:** TASK-123, TASK-124

---

**Assigned To:** UI Designer Agent
**Created By:** [Agent/Person Name]
**Last Updated:** [YYYY-MM-DD]
