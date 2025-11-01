# Test Suite Task Template

## Task Metadata
- **Task ID:** [TASK-XXX]
- **Task Type:** Test Suite Implementation
- **Agent:** QA Agent
- **Priority:** [P0 / P1 / P2 / P3]
- **Status:** [To Do / In Progress / In Review / Done]
- **Created:** [YYYY-MM-DD]
- **Due Date:** [YYYY-MM-DD]

---

## Test Overview

### Feature Being Tested
**Feature Name:** Notification Management

**Feature Description:** Users can view, mark as read, and delete notifications

**Implementation Reference:** [ui-to-qa-handoff-template.md](coordination/handoff-protocols/ui-to-qa-handoff-template.md)

---

## Test Strategy

### Test Pyramid Distribution
- **Unit Tests:** 60% (fast, isolated, many)
- **Integration Tests:** 30% (medium speed, some integration)
- **E2E Tests:** 10% (slow, full system, few)

### Coverage Goals
- **Overall:** >80%
- **Critical Paths:** 100%
- **Components:** >80%
- **Services:** >90%
- **Utilities:** >90%

---

## Unit Tests

### Component Unit Tests

#### Test File: `NotificationCard.test.tsx`
**Location:** `mobile/src/components/molecules/__tests__/NotificationCard.test.tsx`

**Test Cases:**
```typescript
describe('NotificationCard', () => {
  describe('Rendering', () => {
    it('should render notification title and message', () => {
      // Arrange
      const notification = createMockNotification({
        title: 'Test Title',
        message: 'Test Message'
      });

      // Act
      const { getByText } = render(
        <NotificationCard notification={notification} />
      );

      // Assert
      expect(getByText('Test Title')).toBeVisible();
      expect(getByText('Test Message')).toBeVisible();
    });

    it('should show unread indicator for unread notifications', () => {
      const notification = createMockNotification({ read: false });
      const { getByTestId } = render(
        <NotificationCard notification={notification} />
      );
      expect(getByTestId('unread-indicator')).toBeVisible();
    });

    it('should not show unread indicator for read notifications', () => {
      const notification = createMockNotification({ read: true });
      const { queryByTestId } = render(
        <NotificationCard notification={notification} />
      );
      expect(queryByTestId('unread-indicator')).toBeNull();
    });
  });

  describe('Interactions', () => {
    it('should call onMarkRead when mark as read button tapped', () => {
      const mockOnMarkRead = jest.fn();
      const notification = createMockNotification({ id: '123', read: false });

      const { getByLabelText } = render(
        <NotificationCard
          notification={notification}
          onMarkRead={mockOnMarkRead}
        />
      );

      fireEvent.press(getByLabelText('Mark as read'));
      expect(mockOnMarkRead).toHaveBeenCalledWith('123');
    });

    it('should call onDelete when delete button tapped', () => {
      const mockOnDelete = jest.fn();
      const notification = createMockNotification({ id: '123' });

      const { getByLabelText } = render(
        <NotificationCard
          notification={notification}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.press(getByLabelText('Delete notification'));
      expect(mockOnDelete).toHaveBeenCalledWith('123');
    });
  });

  describe('Edge Cases', () => {
    it('should truncate very long messages', () => {
      const longMessage = 'a'.repeat(500);
      const notification = createMockNotification({ message: longMessage });

      const { getByText } = render(
        <NotificationCard notification={notification} />
      );

      const displayedText = getByText(/a+/).props.children;
      expect(displayedText.length).toBeLessThan(longMessage.length);
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility labels', () => {
      const notification = createMockNotification({
        title: 'Birthday',
        read: false
      });

      const { getByLabelText } = render(
        <NotificationCard notification={notification} />
      );

      expect(getByLabelText(/Birthday.*unread/i)).toBeTruthy();
    });
  });
});
```

**Coverage Target:** >85%

---

### Redux Unit Tests

#### Test File: `notificationsSlice.test.ts`
**Location:** `mobile/src/store/slices/__tests__/notificationsSlice.test.ts`

**Test Cases:**
```typescript
describe('notificationsSlice', () => {
  describe('reducers', () => {
    it('should set filter', () => {
      const state = notificationsReducer(
        initialState,
        setFilter('unread')
      );
      expect(state.filter).toBe('unread');
    });

    it('should mark notification as read optimistically', () => {
      const notification = createMockNotification({ id: '1', read: false });
      const state = {
        ...initialState,
        items: [notification]
      };

      const newState = notificationsReducer(
        state,
        markAsReadOptimistic('1')
      );

      expect(newState.items[0].read).toBe(true);
    });
  });

  describe('fetchNotifications thunk', () => {
    it('should fetch notifications successfully', async () => {
      const mockNotifications = [
        createMockNotification({ id: '1' }),
        createMockNotification({ id: '2' })
      ];

      api.getNotifications = jest.fn().resolves({
        data: mockNotifications,
        meta: { hasMore: false }
      });

      const store = mockStore(initialState);
      await store.dispatch(fetchNotifications());

      const actions = store.getActions();
      expect(actions[0].type).toBe(fetchNotifications.pending.type);
      expect(actions[1].type).toBe(fetchNotifications.fulfilled.type);
      expect(actions[1].payload).toEqual(mockNotifications);
    });

    it('should handle fetch error', async () => {
      api.getNotifications = jest.fn().rejects(new Error('Network error'));

      const store = mockStore(initialState);
      await store.dispatch(fetchNotifications());

      const actions = store.getActions();
      expect(actions[1].type).toBe(fetchNotifications.rejected.type);
      expect(actions[1].error.message).toBe('Network error');
    });
  });

  describe('selectors', () => {
    it('should select unread count', () => {
      const state = {
        notifications: {
          items: [
            createMockNotification({ read: false }),
            createMockNotification({ read: false }),
            createMockNotification({ read: true })
          ]
        }
      };

      const count = selectUnreadCount(state);
      expect(count).toBe(2);
    });
  });
});
```

**Coverage Target:** >90%

---

## Integration Tests

### API Integration Tests

#### Test File: `notifications.integration.test.ts`
**Location:** `mobile/src/services/__tests__/notifications.integration.test.ts`

**Test Cases:**
```typescript
describe('Notification API Integration', () => {
  beforeEach(() => {
    // Reset mock API
    nock.cleanAll();
  });

  it('should fetch notifications with pagination', async () => {
    const mockData = {
      data: [createMockNotification(), createMockNotification()],
      meta: { cursor: 'next-cursor', hasMore: true }
    };

    nock('https://api.relaai.com')
      .get('/api/notifications')
      .query({ limit: 20 })
      .reply(200, mockData);

    const result = await notificationService.getNotifications({ limit: 20 });

    expect(result.data).toHaveLength(2);
    expect(result.meta.hasMore).toBe(true);
  });

  it('should mark notification as read', async () => {
    nock('https://api.relaai.com')
      .patch('/api/notifications/123/read')
      .reply(200, { success: true });

    const result = await notificationService.markAsRead('123');

    expect(result.success).toBe(true);
  });

  it('should handle 401 unauthorized error', async () => {
    nock('https://api.relaai.com')
      .get('/api/notifications')
      .reply(401, { error: 'Unauthorized' });

    await expect(notificationService.getNotifications())
      .rejects.toThrow('Unauthorized');
  });

  it('should retry on network error', async () => {
    nock('https://api.relaai.com')
      .get('/api/notifications')
      .times(2)
      .replyWithError('Network error');

    nock('https://api.relaai.com')
      .get('/api/notifications')
      .reply(200, { data: [] });

    const result = await notificationService.getNotifications();
    expect(result.data).toEqual([]);
  });
});
```

**Coverage Target:** >85%

---

### Redux Integration Tests

#### Test File: `notifications.redux.integration.test.ts`
**Location:** `mobile/src/store/__tests__/notifications.redux.integration.test.ts`

**Test Cases:**
```typescript
describe('Notification Redux Integration', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      notifications: initialState
    });
  });

  it('should fetch and store notifications', async () => {
    const mockNotifications = [createMockNotification(), createMockNotification()];
    api.getNotifications = jest.fn().resolves({ data: mockNotifications });

    await store.dispatch(fetchNotifications());

    const state = store.getState().notifications;
    expect(state.items).toEqual(mockNotifications);
    expect(state.loading).toBe(false);
  });

  it('should handle mark as read with optimistic update', async () => {
    const notification = createMockNotification({ id: '1', read: false });
    store = mockStore({
      notifications: {
        ...initialState,
        items: [notification]
      }
    });

    api.markNotificationAsRead = jest.fn().resolves({ success: true });

    await store.dispatch(markAsRead('1'));

    const actions = store.getActions();
    // First action: optimistic update
    expect(actions[0].type).toBe('notifications/markAsReadOptimistic');
    // Second action: API call success
    expect(actions[1].type).toBe(markAsRead.fulfilled.type);
  });

  it('should rollback optimistic update on error', async () => {
    const notification = createMockNotification({ id: '1', read: false });
    store = mockStore({
      notifications: {
        ...initialState,
        items: [notification]
      }
    });

    api.markNotificationAsRead = jest.fn().rejects(new Error('API error'));

    await store.dispatch(markAsRead('1'));

    const state = store.getState().notifications;
    expect(state.items[0].read).toBe(false); // Rolled back
  });
});
```

**Coverage Target:** >85%

---

## E2E Tests

### E2E Test File: `notifications.e2e.ts`
**Location:** `mobile/__tests__/e2e/notifications.e2e.ts`
**Tool:** Detox

**Test Cases:**
```typescript
describe('Notification E2E Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
    await loginAsTestUser();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await seedTestNotifications();
  });

  it('should display notification list', async () => {
    await element(by.id('tab-notifications')).tap();

    await expect(element(by.id('notification-list'))).toBeVisible();
    await expect(element(by.text('Birthday Reminder'))).toBeVisible();
  });

  it('should mark notification as read', async () => {
    await element(by.id('tab-notifications')).tap();

    // Verify unread indicator present
    await expect(element(by.id('unread-indicator-1'))).toBeVisible();

    // Tap notification
    await element(by.id('notification-card-1')).tap();

    // Verify unread indicator gone
    await expect(element(by.id('unread-indicator-1'))).not.toBeVisible();
  });

  it('should delete notification with swipe gesture', async () => {
    await element(by.id('tab-notifications')).tap();

    // Verify notification exists
    await expect(element(by.id('notification-card-1'))).toBeVisible();

    // Swipe to delete
    await element(by.id('notification-card-1')).swipe('left');
    await element(by.id('delete-button-1')).tap();

    // Verify notification removed
    await expect(element(by.id('notification-card-1'))).not.toBeVisible();
  });

  it('should show empty state when no notifications', async () => {
    await clearAllNotifications();
    await element(by.id('tab-notifications')).tap();

    await expect(element(by.text('No notifications yet'))).toBeVisible();
  });

  it('should handle pull-to-refresh', async () => {
    await element(by.id('tab-notifications')).tap();
    await element(by.id('notification-list')).swipe('down', 'fast');

    // Loading indicator should appear briefly
    await expect(element(by.id('loading-indicator'))).toBeVisible();
    await waitFor(element(by.id('loading-indicator')))
      .not.toBeVisible()
      .withTimeout(3000);
  });

  it('should handle infinite scroll pagination', async () => {
    await seed100Notifications();
    await element(by.id('tab-notifications')).tap();

    // Scroll to bottom
    await element(by.id('notification-list')).scrollTo('bottom');

    // Verify more items loaded
    await expect(element(by.id('notification-card-50'))).toBeVisible();
  });

  it('should show offline message when network unavailable', async () => {
    await device.setNetworkState('off');
    await element(by.id('tab-notifications')).tap();

    await expect(element(by.text('You are offline'))).toBeVisible();

    await device.setNetworkState('on');
  });
});
```

**Coverage Target:** Critical user flows (100%)

---

## Performance Tests

### Performance Benchmarks

```typescript
describe('Notification Performance', () => {
  it('should render list of 100 items in <500ms', async () => {
    const notifications = Array(100).fill(null).map(() => createMockNotification());

    const startTime = performance.now();

    const { getByTestId } = render(
      <NotificationList notifications={notifications} />
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(500);
  });

  it('should maintain 60 FPS while scrolling', async () => {
    // Use React Native Performance Monitor
    // Test scrolling FPS with large dataset
    await element(by.id('notification-list')).scroll(500, 'down');

    const fps = await getFPS();
    expect(fps).toBeGreaterThanOrEqual(55); // Allow slight margin
  });
});
```

---

## Accessibility Tests

### Accessibility Test Cases

```typescript
describe('Notification Accessibility', () => {
  it('should have correct accessibility labels', () => {
    const notification = createMockNotification({
      title: 'Birthday',
      read: false
    });

    const { getByLabelText } = render(
      <NotificationCard notification={notification} />
    );

    expect(getByLabelText(/Birthday.*unread/i)).toBeTruthy();
    expect(getByLabelText('Mark notification as read')).toBeTruthy();
    expect(getByLabelText('Delete notification')).toBeTruthy();
  });

  it('should have correct accessibility roles', () => {
    const { UNSAFE_getByType } = render(<NotificationCard />);

    const button = UNSAFE_getByType(TouchableOpacity);
    expect(button.props.accessibilityRole).toBe('button');
  });

  it('should announce state changes to screen readers', async () => {
    const { getByLabelText, rerender } = render(
      <NotificationCard notification={{ read: false }} />
    );

    // Mark as read
    fireEvent.press(getByLabelText('Mark as read'));

    rerender(<NotificationCard notification={{ read: true }} />);

    expect(getByLabelText(/read notification/i)).toBeTruthy();
  });
});
```

---

## Test Data Factories

### Factory Functions

```typescript
// File: mobile/src/__tests__/factories/notificationFactory.ts

export const createMockNotification = (
  overrides?: Partial<Notification>
): Notification => ({
  id: faker.datatype.uuid(),
  userId: faker.datatype.uuid(),
  title: faker.lorem.sentence(),
  message: faker.lorem.paragraph(),
  read: false,
  createdAt: faker.date.recent().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides
});

export const createMockNotificationList = (
  count: number,
  overrides?: Partial<Notification>
): Notification[] => {
  return Array(count)
    .fill(null)
    .map(() => createMockNotification(overrides));
};
```

---

## Mocking Strategy

### API Mocks

```typescript
// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null })
    }))
  }
}));
```

### Redux Mocks

```typescript
// Mock Redux store
const mockStore = configureStore([thunk]);

const initialState = {
  notifications: {
    items: [],
    loading: false,
    error: null,
    filter: 'all'
  }
};
```

---

## Test Execution

### Run Tests Locally

```bash
# Run all tests
npm run test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run E2E tests only
npm run test:e2e

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm run test NotificationCard.test.tsx
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run unit tests
        run: npm run test:unit
      - name: Run integration tests
        run: npm run test:integration
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

## Acceptance Criteria

### Definition of Done
- [ ] All unit tests written (>80% coverage)
- [ ] All integration tests written
- [ ] E2E tests written for critical flows
- [ ] All tests passing locally
- [ ] All tests passing in CI/CD
- [ ] Performance benchmarks met
- [ ] Accessibility tests passing
- [ ] Test documentation complete
- [ ] Code review approved

---

## Time Estimate
- **Unit Tests:** 8 hours
- **Integration Tests:** 6 hours
- **E2E Tests:** 6 hours
- **Performance Tests:** 2 hours
- **Accessibility Tests:** 2 hours
- **Total:** 24 hours

---

## References
- **Handoff Document:** [ui-to-qa-handoff-template.md](coordination/handoff-protocols/ui-to-qa-handoff-template.md)
- **Component Contract:** [component-interfaces.ts](contracts/component-contracts/component-interfaces.ts)
- **API Contract:** [notification-endpoints.yaml](contracts/api-contracts/notification-endpoints.yaml)
- **Jest Docs:** https://jestjs.io/
- **React Native Testing Library:** https://callstack.github.io/react-native-testing-library/
- **Detox Docs:** https://wix.github.io/Detox/

---

**Assigned To:** QA Agent
**Created By:** [Agent/Person Name]
**Last Updated:** [YYYY-MM-DD]
