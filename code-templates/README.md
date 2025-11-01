# Code Templates

> Reusable code templates for the RelaAI multi-agent development system

## Overview

This directory contains production-ready code templates for implementing React Native components, Redux state management, database migrations, tests, and services. Each template follows RelaAI's architectural patterns and quality standards.

**Key Principle:** Copy templates, replace TODO markers, and integrate with contracts to ensure consistency across the codebase.

---

## Table of Contents

- [Directory Structure](#directory-structure)
- [Quick Start](#quick-start)
- [Template Categories](#template-categories)
- [How to Use Templates](#how-to-use-templates)
- [Integration with Contracts](#integration-with-contracts)
- [Customization Guide](#customization-guide)
- [Best Practices](#best-practices)
- [Technology Stack](#technology-stack)
- [Template Reference](#template-reference)
- [Examples](#examples)

---

## Directory Structure

```
code-templates/
├── react-native-components/   # React Native component templates
│   ├── atom-template.tsx       # Atomic design: Atoms (Button, Input, etc.)
│   ├── molecule-template.tsx   # Atomic design: Molecules (Card, ListItem, etc.)
│   ├── organism-template.tsx   # Atomic design: Organisms (List, Form, etc.)
│   ├── screen-template.tsx     # Full screen components
│   └── styled-components.tsx   # Styled components patterns
├── redux/                      # Redux Toolkit templates
│   ├── slice-template.ts       # Redux slice with reducers
│   ├── async-thunk-template.ts # Async operations
│   ├── selector-template.ts    # Memoized selectors
│   └── hooks-template.ts       # Typed Redux hooks
├── database/                   # Database migration templates
│   ├── migration-template.sql  # SQL migration (up/down)
│   ├── rls-policy-template.sql # Row Level Security policies
│   ├── function-template.sql   # PostgreSQL functions
│   └── seed-data-template.sql  # Test/seed data
├── testing/                    # Test templates
│   ├── unit-test-template.tsx  # Component unit tests
│   ├── integration-test-template.ts # Integration tests
│   ├── e2e-test-template.ts    # Detox E2E tests
│   └── test-utils.ts           # Testing utilities
└── services/                   # Service layer templates
    ├── api-service-template.ts # API integration
    ├── supabase-service-template.ts # Supabase client
    └── storage-service-template.ts  # AsyncStorage
```

---

## Quick Start

### 1. Choose the Right Template

Identify what you're building:
- **React Native Component** → `react-native-components/`
- **Redux State Management** → `redux/`
- **Database Migration** → `database/`
- **Tests** → `testing/`
- **API/Service** → `services/`

### 2. Copy Template

```bash
# Example: Creating a new component
cp code-templates/react-native-components/molecule-template.tsx \
   mobile/src/components/molecules/NotificationCard.tsx
```

### 3. Replace TODO Markers

Search for `TODO` comments and replace with your implementation:

```typescript
// TODO: Replace with your component name
export const NotificationCard: React.FC<NotificationCardProps> = ({

// Becomes:
export const NotificationCard: React.FC<NotificationCardProps> = ({
```

### 4. Update Contracts

Add your interfaces to the appropriate contract file:

```typescript
// In contracts/component-contracts/component-interfaces.ts
export interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}
```

### 5. Write Tests

Use the corresponding test template:

```bash
cp code-templates/testing/unit-test-template.tsx \
   mobile/src/components/molecules/__tests__/NotificationCard.test.tsx
```

---

## Template Categories

### 1. React Native Components

**Purpose:** Build consistent, accessible, and performant UI components.

**Templates:**
- **atom-template.tsx** - Simple, single-purpose components (Button, Input, Text, Avatar)
- **molecule-template.tsx** - Combinations of atoms (SearchBar, Card, ListItem)
- **organism-template.tsx** - Complex components with business logic (List, Dashboard)
- **screen-template.tsx** - Full screen components with navigation
- **styled-components.tsx** - Styled-components patterns with theme

**Key Features:**
- TypeScript interfaces for props
- Accessibility labels
- Theme integration
- Responsive design
- Platform-specific handling
- Performance optimizations (React.memo, useCallback)

**When to Use:**
- Starting any new UI component
- Ensuring consistent component structure
- Following atomic design principles

---

### 2. Redux State Management

**Purpose:** Manage global application state with Redux Toolkit.

**Templates:**
- **slice-template.ts** - Redux slice with state, reducers, and actions
- **async-thunk-template.ts** - Async operations (API calls, data fetching)
- **selector-template.ts** - Memoized selectors with reselect
- **hooks-template.ts** - Typed useAppSelector and useAppDispatch hooks

**Key Features:**
- Normalized state shape
- TypeScript types for state and actions
- Loading/error state handling
- Async thunk patterns
- Memoized selectors for performance

**When to Use:**
- Adding new feature state
- Implementing data fetching
- Creating derived state selectors
- Setting up typed Redux hooks

---

### 3. Database Migrations

**Purpose:** Safely evolve database schema with versioned migrations.

**Templates:**
- **migration-template.sql** - Complete migration with up/down scripts
- **rls-policy-template.sql** - Row Level Security policies
- **function-template.sql** - PostgreSQL functions and triggers
- **seed-data-template.sql** - Test and development seed data

**Key Features:**
- Idempotent migrations (safe to run multiple times)
- Rollback scripts (down migrations)
- RLS policies for security
- Indexes for performance
- Timestamps and soft deletes

**When to Use:**
- Creating new tables
- Modifying existing schema
- Adding RLS policies
- Creating database functions
- Seeding test data

---

### 4. Testing

**Purpose:** Comprehensive test coverage following the test pyramid.

**Templates:**
- **unit-test-template.tsx** - Component unit tests (Jest + RTL)
- **integration-test-template.ts** - Redux integration tests
- **e2e-test-template.ts** - End-to-end tests (Detox)
- **test-utils.ts** - Test utilities, mocks, and factories

**Key Features:**
- Arrange-Act-Assert (AAA) pattern
- React Native Testing Library best practices
- Mock data with Faker.js
- Accessibility testing
- Performance testing

**When to Use:**
- After implementing any component
- Testing Redux state management
- Verifying critical user flows
- Creating reusable test utilities

---

### 5. Services

**Purpose:** Encapsulate business logic and external integrations.

**Templates:**
- **api-service-template.ts** - RESTful API client
- **supabase-service-template.ts** - Supabase database client
- **storage-service-template.ts** - AsyncStorage wrapper

**Key Features:**
- TypeScript types for requests/responses
- Error handling
- Request/response interceptors
- Authentication integration
- Retry logic

**When to Use:**
- Integrating with APIs
- Accessing Supabase database
- Storing local data
- Implementing reusable service logic

---

## How to Use Templates

### Step-by-Step Process

#### 1. Review the Contract

Before copying a template, check the relevant contract:

```typescript
// contracts/component-contracts/component-interfaces.ts
export interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  testID?: string;
}
```

#### 2. Copy Template to Correct Location

Follow the directory structure:

```bash
# Component templates → mobile/src/components/[atoms|molecules|organisms]/
# Screen templates → mobile/src/screens/
# Redux templates → mobile/src/store/[slices|selectors]/
# Service templates → mobile/src/services/
# Test templates → mobile/__tests__/[unit|integration|e2e]/
```

#### 3. Rename File

Use descriptive, PascalCase names:

```
molecule-template.tsx → NotificationCard.tsx
slice-template.ts → notificationsSlice.ts
unit-test-template.tsx → NotificationCard.test.tsx
```

#### 4. Replace TODO Markers

Search for all `TODO` comments:

```typescript
// TODO: Replace with your component name
// TODO: Add your props interface
// TODO: Implement component logic
// TODO: Add styled components
```

Use find-and-replace or search for "TODO" in your editor.

#### 5. Implement Business Logic

Add your feature-specific implementation:

```typescript
// Template provides structure:
export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // TODO: Add state management

  // TODO: Add event handlers

  // TODO: Add render logic
};

// You implement:
export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMarkRead = useCallback(() => {
    onMarkRead(notification.id);
  }, [notification.id, onMarkRead]);

  return (
    <Card>
      <Title>{notification.title}</Title>
      <Message numberOfLines={isExpanded ? undefined : 2}>
        {notification.message}
      </Message>
      <Actions>
        <Button onPress={handleMarkRead}>Mark Read</Button>
        <Button onPress={() => onDelete(notification.id)}>Delete</Button>
      </Actions>
    </Card>
  );
};
```

#### 6. Update Contracts

Ensure your implementation matches contracts:

```typescript
// Add to contracts/component-contracts/component-interfaces.ts
export interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  testID?: string;
}

// Add to contracts/component-contracts/navigation-types.ts (if screen)
export type MainStackParamList = {
  NotificationList: undefined;
  NotificationDetail: { notificationId: string };
};
```

#### 7. Write Tests

Use the test template to achieve >80% coverage:

```bash
cp code-templates/testing/unit-test-template.tsx \
   mobile/src/components/molecules/__tests__/NotificationCard.test.tsx
```

---

## Integration with Contracts

### Contract-First Development

Templates are designed to work seamlessly with contracts:

```
1. Define Contract
   ↓
2. Copy Template
   ↓
3. Implement Using Contract
   ↓
4. Update Contract if Needed
```

### Contract Types

#### Component Contracts

```typescript
// contracts/component-contracts/component-interfaces.ts
export interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

// Your component template imports and uses this:
import { NotificationCardProps } from '@contracts/component-contracts';

export const NotificationCard: React.FC<NotificationCardProps> = (props) => {
  // Implementation matches contract
};
```

#### Data Contracts

```typescript
// contracts/data-contracts/dto-definitions.ts
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Your Redux slice uses this:
import { Notification } from '@contracts/data-contracts';

interface NotificationsState {
  items: Notification[];  // Type from contract
  loading: boolean;
}
```

#### Database Contracts

```sql
-- contracts/database-contracts/schema.sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Your migration template uses this as reference
```

---

## Customization Guide

### Customizing Component Templates

#### Adding Custom Props

```typescript
// Template provides basic structure:
interface ComponentProps {
  // TODO: Add your props
}

// Customize with your props:
interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  variant?: 'default' | 'compact';  // Add custom prop
  showActions?: boolean;            // Add custom prop
}
```

#### Adding Platform-Specific Styles

```typescript
// Use Platform.select from template:
const shadows = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  android: {
    elevation: 5,
  },
});

// Customize for your component:
const Card = styled.View`
  ${shadows}
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
`;
```

### Customizing Redux Templates

#### Adding Custom Reducers

```typescript
// Template provides basic reducers:
reducers: {
  // TODO: Add your reducers
}

// Customize with your business logic:
reducers: {
  markAsRead: (state, action: PayloadAction<string>) => {
    const notification = state.byId[action.payload];
    if (notification) {
      notification.read = true;
    }
  },
  deleteNotification: (state, action: PayloadAction<string>) => {
    delete state.byId[action.payload];
    state.allIds = state.allIds.filter(id => id !== action.payload);
  }
}
```

### Customizing Database Templates

#### Adding Custom Indexes

```sql
-- Template provides basic index pattern:
CREATE INDEX idx_table_column ON table_name(column_name);

-- Customize for your query patterns:
CREATE INDEX idx_notifications_user_read
  ON notifications(user_id, read)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_notifications_created
  ON notifications(created_at DESC);
```

### Customizing Test Templates

#### Adding Custom Test Scenarios

```typescript
// Template provides basic test structure:
describe('Component', () => {
  it('should render correctly', () => {
    // TODO: Add test
  });
});

// Customize with your scenarios:
describe('NotificationCard', () => {
  it('should show unread indicator when notification is unread', () => {
    const notification = createMockNotification({ read: false });
    const { getByTestId } = render(<NotificationCard notification={notification} />);
    expect(getByTestId('unread-indicator')).toBeVisible();
  });

  it('should call onMarkRead when mark read button pressed', () => {
    const mockOnMarkRead = jest.fn();
    const { getByLabelText } = render(
      <NotificationCard
        notification={createMockNotification()}
        onMarkRead={mockOnMarkRead}
      />
    );
    fireEvent.press(getByLabelText('Mark as read'));
    expect(mockOnMarkRead).toHaveBeenCalledTimes(1);
  });
});
```

---

## Best Practices

### 1. Always Start with Contracts

```markdown
# WRONG: Copy template, implement, then define contract
❌ This leads to mismatches and rework

# RIGHT: Define contract first, then use template
✅ Template implementation matches contract from the start
```

### 2. Don't Skip TODO Markers

```typescript
// WRONG: Leave TODOs in code
export const Component = () => {
  // TODO: Implement logic
  return null;  // Shipped to production!
};

// RIGHT: Replace all TODOs
export const NotificationCard = ({ notification }) => {
  const handleMarkRead = () => {
    // Fully implemented
  };
  return <Card>...</Card>;
};
```

### 3. Use TypeScript Strictly

```typescript
// WRONG: Using 'any' type
const data: any = await fetchData();

// RIGHT: Use proper types from contracts
const data: Notification[] = await notificationService.getAll();
```

### 4. Follow Atomic Design

```markdown
Atoms → Simple, reusable (Button, Input, Text)
    ↓
Molecules → Combinations (SearchBar, Card, ListItem)
    ↓
Organisms → Complex components (List, Form, Dashboard)
    ↓
Screens → Full pages (HomeScreen, SettingsScreen)
```

### 5. Test Every Component

```markdown
Component Implementation
    ↓
Copy test template
    ↓
Write tests (>80% coverage)
    ↓
Run tests (all passing)
    ↓
Ready for handoff
```

### 6. Keep Templates Updated

When you find a better pattern:
1. Update the template
2. Document the improvement
3. Notify other agents
4. Consider refactoring existing code

---

## Technology Stack

### Frontend

| Technology | Version | Purpose | Template Location |
|------------|---------|---------|-------------------|
| React Native | Latest | Mobile framework | `react-native-components/` |
| TypeScript | 5.0+ | Type safety | All templates |
| Redux Toolkit | Latest | State management | `redux/` |
| Styled Components | 6.0+ | Styling | `react-native-components/styled-components.tsx` |
| React Navigation | 6.0+ | Navigation | `react-native-components/screen-template.tsx` |

### Backend & Database

| Technology | Version | Purpose | Template Location |
|------------|---------|---------|-------------------|
| Supabase | Latest | Backend platform | `services/supabase-service-template.ts` |
| PostgreSQL | 15+ | Database | `database/` |
| Row Level Security | - | Authorization | `database/rls-policy-template.sql` |

### Testing

| Technology | Version | Purpose | Template Location |
|------------|---------|---------|-------------------|
| Jest | Latest | Test runner | `testing/unit-test-template.tsx` |
| React Native Testing Library | Latest | Component testing | `testing/unit-test-template.tsx` |
| Detox | Latest | E2E testing | `testing/e2e-test-template.ts` |
| Faker.js | Latest | Mock data | `testing/test-utils.ts` |

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static typing
- **Husky** - Git hooks
- **Expo** - Development platform

---

## Template Reference

### React Native Components

| Template | Use Case | Complexity | Typical Props |
|----------|----------|------------|---------------|
| atom-template.tsx | Button, Input, Text, Icon | Simple | 2-4 props |
| molecule-template.tsx | Card, ListItem, SearchBar | Medium | 4-8 props |
| organism-template.tsx | List, Form, Dashboard | Complex | 8-12 props |
| screen-template.tsx | Full screens with navigation | Complex | navigation, route |
| styled-components.tsx | Theme-aware styled components | Varies | theme props |

### Redux Templates

| Template | Use Case | Includes | Related Contracts |
|----------|----------|----------|-------------------|
| slice-template.ts | Feature state slice | reducers, actions, state | `redux-types.ts` |
| async-thunk-template.ts | API calls, async ops | pending, fulfilled, rejected | `dto-definitions.ts` |
| selector-template.ts | Derived state | createSelector, memoization | `redux-types.ts` |
| hooks-template.ts | Typed Redux hooks | useAppSelector, useAppDispatch | `redux-types.ts` |

### Database Templates

| Template | Use Case | Safety Features | Performance |
|----------|----------|-----------------|-------------|
| migration-template.sql | Schema changes | Up/down scripts, idempotent | Indexes |
| rls-policy-template.sql | Security policies | auth.uid() checks | Efficient WHERE clauses |
| function-template.sql | Business logic | Error handling | Optimized queries |
| seed-data-template.sql | Test data | Repeatable | Batch inserts |

### Testing Templates

| Template | Test Type | Coverage Target | Tools |
|----------|-----------|-----------------|-------|
| unit-test-template.tsx | Component tests | >80% | Jest, RTL |
| integration-test-template.ts | Feature tests | >85% | Jest, Redux |
| e2e-test-template.ts | User flow tests | Critical paths | Detox |
| test-utils.ts | Test helpers | N/A | Faker, mocks |

### Service Templates

| Template | Purpose | Error Handling | Auth |
|----------|---------|----------------|------|
| api-service-template.ts | REST API client | Try/catch, retry | Bearer token |
| supabase-service-template.ts | Database access | Error responses | RLS |
| storage-service-template.ts | Local storage | Fallback values | N/A |

---

## Examples

### Example 1: Creating a New Component

**Goal:** Implement NotificationCard component

**Steps:**

```bash
# 1. Check contract first
cat contracts/component-contracts/component-interfaces.ts | grep NotificationCard

# 2. Copy template
cp code-templates/react-native-components/molecule-template.tsx \
   mobile/src/components/molecules/NotificationCard.tsx

# 3. Open file and replace TODOs
# - Component name: NotificationCard
# - Props: NotificationCardProps from contract
# - Logic: Display notification with actions

# 4. Implement component
# (See completed NotificationCard.tsx)

# 5. Copy test template
cp code-templates/testing/unit-test-template.tsx \
   mobile/src/components/molecules/__tests__/NotificationCard.test.tsx

# 6. Write tests
# (See completed NotificationCard.test.tsx)

# 7. Run tests
cd mobile && npm test -- NotificationCard.test.tsx

# 8. Verify quality gate
npm run typecheck  # 0 errors
npm run lint       # 0 warnings
npm run test:coverage  # >80%
```

---

### Example 2: Creating Redux State Management

**Goal:** Implement notifications Redux slice

**Steps:**

```bash
# 1. Check contracts
cat contracts/component-contracts/redux-types.ts | grep NotificationsState
cat contracts/data-contracts/dto-definitions.ts | grep Notification

# 2. Copy templates
cp code-templates/redux/slice-template.ts \
   mobile/src/store/slices/notificationsSlice.ts

cp code-templates/redux/async-thunk-template.ts \
   mobile/src/store/slices/notificationsThunks.ts

cp code-templates/redux/selector-template.ts \
   mobile/src/store/selectors/notificationsSelectors.ts

# 3. Implement slice
# - State: { byId, allIds, loading, error }
# - Reducers: markAsRead, deleteNotification
# - Thunks: fetchNotifications, markNotificationAsRead

# 4. Implement selectors
# - selectAllNotifications
# - selectUnreadNotifications
# - selectNotificationById

# 5. Write tests
cp code-templates/testing/integration-test-template.ts \
   mobile/__tests__/integration/notifications.test.ts

# 6. Test Redux logic
npm test -- notifications.test.ts
```

---

### Example 3: Creating Database Migration

**Goal:** Add notifications table

**Steps:**

```bash
# 1. Check database contracts
cat contracts/database-contracts/schema.sql | grep notifications

# 2. Create migration file
cp code-templates/database/migration-template.sql \
   supabase/migrations/$(date +%Y%m%d%H%M%S)_add_notifications_table.sql

# 3. Implement migration
# - CREATE TABLE notifications
# - Add indexes
# - Enable RLS
# - Create policies

# 4. Add RLS policies
cp code-templates/database/rls-policy-template.sql \
   supabase/migrations/$(date +%Y%m%d%H%M%S)_notifications_rls.sql

# 5. Test migration
supabase migration up
supabase db diff

# 6. Verify RLS
psql -d postgres -c "SELECT * FROM notifications;"  # Should fail for non-owner

# 7. Create seed data
cp code-templates/database/seed-data-template.sql \
   supabase/seed/notifications.sql

# 8. Load seed data
supabase db seed
```

---

### Example 4: Writing E2E Tests

**Goal:** Test notification flow end-to-end

**Steps:**

```bash
# 1. Copy template
cp code-templates/testing/e2e-test-template.ts \
   mobile/__tests__/e2e/notifications.e2e.ts

# 2. Define test scenarios
# - User views notification list
# - User marks notification as read
# - User deletes notification
# - User filters notifications

# 3. Implement tests using Detox
describe('Notifications E2E', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display notifications', async () => {
    await element(by.id('tab-notifications')).tap();
    await expect(element(by.id('notification-list'))).toBeVisible();
  });

  it('should mark notification as read', async () => {
    await element(by.id('notification-1')).tap();
    await element(by.id('mark-read-button')).tap();
    await expect(element(by.id('unread-badge'))).not.toBeVisible();
  });
});

# 4. Run E2E tests
npm run e2e:build
npm run e2e:test
```

---

## Quick Reference

### File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Component | PascalCase.tsx | NotificationCard.tsx |
| Screen | PascalCase + Screen.tsx | NotificationListScreen.tsx |
| Redux Slice | camelCase + Slice.ts | notificationsSlice.ts |
| Selector | camelCase + Selectors.ts | notificationsSelectors.ts |
| Service | camelCase + Service.ts | notificationService.ts |
| Test | ComponentName.test.tsx | NotificationCard.test.tsx |
| E2E Test | feature.e2e.ts | notifications.e2e.ts |
| Migration | timestamp_description.sql | 20251101_add_notifications.sql |

### Import Aliases

Use path aliases in your code:

```typescript
// DON'T use relative imports
import { Button } from '../../../components/atoms/Button';

// DO use aliases
import { Button } from '@components/atoms/Button';
import { Notification } from '@contracts/data-contracts';
import { useAppSelector } from '@store/hooks';
import { notificationService } from '@services/notificationService';
```

Configure in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
      "@store/*": ["src/store/*"],
      "@services/*": ["src/services/*"],
      "@contracts/*": ["../contracts/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

---

## Getting Help

### Template Issues
- Check template TODO markers for guidance
- Review examples in this README
- Refer to existing implementations in codebase
- Ask in #dev-help Slack channel

### Integration Issues
- Verify contracts are up-to-date
- Check import paths and aliases
- Review agent-specific documentation in `agents/`
- Consult [coordination/README.md](../coordination/README.md)

### Quality Issues
- Run quality gate checklist: `coordination/review-gates/`
- Check TypeScript errors: `npm run typecheck`
- Verify linting: `npm run lint`
- Check test coverage: `npm run test:coverage`

---

## Contributing

### Updating Templates
If you improve a template:
1. Document the change
2. Update this README
3. Test with a real use case
4. Get approval from tech lead
5. Notify all agents

### Adding New Templates
New templates should:
- Follow existing template structure
- Include comprehensive TODO markers
- Provide example usage
- Link to relevant contracts
- Include TypeScript types
- Have corresponding test template

---

**Last Updated:** 2025-11-01
**Maintained By:** Tech Lead
**Version:** 1.0.0
