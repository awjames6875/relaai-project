# UI Designer Quality Gate

This quality gate ensures UI Designer Agent has met all quality standards before handing off work to QA Agent.

**Purpose:** Prevent defects from reaching QA, ensure consistency, and maintain code quality standards.

---

## When to Use This Quality Gate

Use this checklist **before**:
- Completing any UI component implementation
- Handing off to QA Agent for testing
- Merging feature branch to development
- Requesting code review

---

## Code Quality Standards

### TypeScript Compliance
- [ ] `npm run typecheck` passes with **zero errors**
- [ ] No `any` types used (use `unknown` or proper types)
- [ ] All props interfaces defined in [component-interfaces.ts](contracts/component-contracts/component-interfaces.ts)
- [ ] All function parameters and return types explicitly typed
- [ ] Strict mode enabled and followed
- [ ] No `@ts-ignore` comments without explanation
- [ ] Enums used instead of string literals where appropriate

**Verification Command:**
```bash
cd mobile && npm run typecheck
```

**Expected Output:** `Found 0 errors`

---

### ESLint Compliance
- [ ] `npm run lint` passes with **zero warnings or errors**
- [ ] No unused variables
- [ ] No unused imports
- [ ] No console.log statements
- [ ] Hooks follow Rules of Hooks
- [ ] Dependencies arrays complete in useEffect/useCallback/useMemo
- [ ] No ESLint disable comments without justification

**Verification Command:**
```bash
cd mobile && npm run lint
```

**Expected Output:** `✔ No ESLint warnings or errors`

---

### Code Formatting
- [ ] `npm run format:check` passes
- [ ] All files formatted with Prettier
- [ ] Consistent indentation (2 spaces)
- [ ] No trailing whitespace
- [ ] Newline at end of files
- [ ] Max line length 100 characters

**Verification Command:**
```bash
cd mobile && npm run format:check
```

**Auto-fix Command:**
```bash
cd mobile && npm run format
```

---

## Component Quality Standards

### Atomic Design Compliance
- [ ] Component categorized correctly:
  - **Atoms:** Button, Input, Text, Avatar, Icon, Badge
  - **Molecules:** SearchBar, MessageCard, ContactListItem, FormField
  - **Organisms:** MessageList, ContactList, Dashboard, Header
  - **Screens:** Full page components in `src/screens/`
- [ ] Component placed in correct directory:
  - `src/components/atoms/`
  - `src/components/molecules/`
  - `src/components/organisms/`
  - `src/screens/`
- [ ] No business logic in presentational components
- [ ] Components are reusable (not overly specific)

---

### Props & Interfaces
- [ ] Props interface exported and documented
- [ ] Props interface added to [component-interfaces.ts](contracts/component-contracts/component-interfaces.ts)
- [ ] Required vs optional props clearly defined
- [ ] Default props provided for optional props
- [ ] Props interface has JSDoc comments
- [ ] No more than 10 props (split component if >10)
- [ ] Event handler props prefixed with `on` (e.g., `onPress`, `onChange`)

**Example:**
```typescript
/**
 * Props for NotificationCard component
 */
export interface NotificationCardProps {
  /** Notification data object */
  notification: Notification;
  /** Callback when notification is marked as read */
  onMarkRead: (id: string) => void;
  /** Callback when notification is deleted */
  onDelete: (id: string) => void;
  /** Optional test ID for E2E testing */
  testID?: string;
}
```

---

### Component Structure
- [ ] Component follows this structure:
  1. Imports
  2. Interface/Type definitions
  3. Component function
  4. Styled components (at bottom)
- [ ] Component exported as default or named export consistently
- [ ] Component has display name set (for debugging)
- [ ] No more than 200 lines (split into smaller components if larger)
- [ ] Hooks called at top of component
- [ ] Event handlers defined before JSX
- [ ] JSX returned at end

**Example:**
```typescript
import React from 'react';
import { View, Text } from 'react-native';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  // Hooks
  const [state, setState] = React.useState('');

  // Event handlers
  const handlePress = () => {
    // ...
  };

  // JSX
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};

MyComponent.displayName = 'MyComponent';
```

---

## Styling Quality Standards

### Theme Usage
- [ ] All colors from `theme.colors.*` (no hardcoded hex values)
- [ ] All spacing from `theme.spacing.*` (no magic numbers)
- [ ] All font sizes from `theme.typography.*`
- [ ] All border radius from `theme.borderRadius.*`
- [ ] Theme referenced from [theme-contract.ts](contracts/component-contracts/theme-contract.ts)
- [ ] Dark mode support if applicable

**Bad:**
```typescript
const Container = styled.View`
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
`;
```

**Good:**
```typescript
const Container = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
`;
```

---

### Responsive Design
- [ ] Tested on iPhone SE (small - 375x667)
- [ ] Tested on iPhone 14 Pro (standard - 393x852)
- [ ] Tested on iPhone 14 Pro Max (large - 430x932)
- [ ] Tested on iPad Pro (tablet - 1024x1366)
- [ ] Tested on Android Pixel 5 (393x851)
- [ ] Text scales with platform settings (Dynamic Type/Font Scale)
- [ ] Layout adapts to screen size (no cutoff content)
- [ ] Horizontal padding for safe area

**Testing Command:**
```bash
# iOS Simulator - Change device
xcrun simctl list devices

# Android Emulator - Change device
emulator -list-avds
```

---

### Platform-Specific Handling
- [ ] Platform differences handled gracefully
- [ ] Uses `Platform.select()` or `Platform.OS` when needed
- [ ] iOS-specific code clearly marked
- [ ] Android-specific code clearly marked
- [ ] No platform-specific bugs

**Example:**
```typescript
const elevation = Platform.select({
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
```

---

## Accessibility Quality Standards

### Accessibility Labels
- [ ] **All** interactive elements have `accessibilityLabel`
- [ ] **All** images have `accessibilityLabel` or `accessibilityRole="image"`
- [ ] Labels describe purpose, not just text content
- [ ] Form inputs have labels
- [ ] Buttons describe action ("Delete notification", not "Button")

**Example:**
```typescript
<TouchableOpacity
  accessibilityLabel="Mark notification as read"
  accessibilityRole="button"
  onPress={handleMarkRead}
>
  <Icon name="check" />
</TouchableOpacity>
```

---

### Accessibility Roles
- [ ] Correct `accessibilityRole` assigned:
  - `button` for pressable actions
  - `header` for section titles
  - `text` for static text
  - `link` for navigation elements
  - `image` for images/icons
  - `none` for decorative elements

---

### Accessibility Testing
- [ ] VoiceOver tested (iOS) - navigate through component
- [ ] TalkBack tested (Android) - navigate through component
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] All content announced correctly
- [ ] State changes announced (loading, error, success)
- [ ] Focus moves correctly after actions

**Testing Commands:**
```bash
# iOS - Enable VoiceOver
Settings > Accessibility > VoiceOver

# Android - Enable TalkBack
Settings > Accessibility > TalkBack
```

---

### Visual Accessibility
- [ ] Text contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Large text contrast ratio ≥ 3:1
- [ ] Tap targets ≥ 44x44 points (iOS) / 48x48dp (Android)
- [ ] No color-only information (use icons + color)
- [ ] Supports Dynamic Type (iOS) - text scales
- [ ] Supports Font Scale (Android) - text scales

**Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

## State Management Quality Standards

### Redux Integration
- [ ] Redux slice created in `src/store/slices/`
- [ ] Slice follows Redux Toolkit patterns
- [ ] State shape defined in [redux-types.ts](contracts/component-contracts/redux-types.ts)
- [ ] Selectors created in separate file `src/store/selectors/`
- [ ] useSelector hooks use typed selectors
- [ ] useDispatch uses AppDispatch type
- [ ] No business logic in components (moved to thunks)

---

### Async Operations
- [ ] Async actions use `createAsyncThunk`
- [ ] Loading states handled (pending, fulfilled, rejected)
- [ ] Error handling implemented
- [ ] Loading indicators shown during async operations
- [ ] Optimistic updates used where appropriate
- [ ] Race conditions prevented

**Example:**
```typescript
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.getNotifications(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

---

### State Normalization
- [ ] State is normalized (no nested arrays of objects)
- [ ] Entities stored by ID
- [ ] IDs array used for order
- [ ] No data duplication

**Bad:**
```typescript
{
  contacts: [
    { id: '1', name: 'Alice', messages: [{ id: 'm1', text: '...' }] },
    { id: '2', name: 'Bob', messages: [{ id: 'm2', text: '...' }] }
  ]
}
```

**Good:**
```typescript
{
  contacts: {
    byId: { '1': { id: '1', name: 'Alice' }, '2': { id: '2', name: 'Bob' } },
    allIds: ['1', '2']
  },
  messages: {
    byId: { 'm1': { id: 'm1', contactId: '1', text: '...' } },
    allIds: ['m1']
  }
}
```

---

## Performance Quality Standards

### List Rendering
- [ ] FlatList used for lists (not ScrollView with map)
- [ ] FlatList has `keyExtractor` function
- [ ] FlatList has `getItemLayout` for fixed-height items
- [ ] FlatList has `windowSize` optimized (default 21)
- [ ] `removeClippedSubviews` enabled for long lists
- [ ] Pagination implemented for large datasets

---

### Component Optimization
- [ ] React.memo used for frequently re-rendered components
- [ ] useCallback used for event handlers passed as props
- [ ] useMemo used for expensive calculations
- [ ] No inline object/array literals in JSX (causes re-renders)
- [ ] Images optimized and cached

**Example:**
```typescript
// Bad - creates new object on every render
<Component style={{ padding: 16 }} />

// Good - memoized style object
const style = useMemo(() => ({ padding: 16 }), []);
<Component style={style} />
```

---

### Performance Testing
- [ ] 60 FPS maintained during scrolling
- [ ] No lag during animations
- [ ] No memory leaks (test with React DevTools Profiler)
- [ ] Bundle size increase <500KB
- [ ] Initial render <500ms

**Testing Commands:**
```bash
# Open React DevTools Profiler
# Record interaction
# Check for unnecessary re-renders

# Check bundle size
npm run analyze-bundle
```

---

## Navigation Quality Standards

### Navigation Types
- [ ] Navigation params typed in [navigation-types.ts](contracts/component-contracts/navigation-types.ts)
- [ ] Screen components use correct navigation prop type
- [ ] Deep linking configured if needed
- [ ] Back button behavior tested

**Example:**
```typescript
// In navigation-types.ts
export type MainStackParamList = {
  NotificationList: undefined;
  NotificationDetail: { notificationId: string };
};

// In component
type Props = NativeStackScreenProps<MainStackParamList, 'NotificationDetail'>;

export const NotificationDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { notificationId } = route.params; // Typed!
};
```

---

### Navigation Testing
- [ ] Navigation to screen works
- [ ] Navigation params passed correctly
- [ ] Back button returns to previous screen
- [ ] Deep links work (if configured)
- [ ] Tab switching works (if tabs)

---

## Testing Quality Standards

### Unit Tests
- [ ] Component unit tests written
- [ ] Tests in `__tests__/` directory next to component
- [ ] Test coverage >80%
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Tests use React Native Testing Library
- [ ] No shallow rendering (use `render()`)
- [ ] User events simulated with `fireEvent` or `userEvent`

**Example:**
```typescript
describe('NotificationCard', () => {
  it('should call onMarkRead when tapped', () => {
    // Arrange
    const mockOnMarkRead = jest.fn();
    const notification = { id: '1', title: 'Test', read: false };

    // Act
    const { getByLabelText } = render(
      <NotificationCard notification={notification} onMarkRead={mockOnMarkRead} />
    );
    fireEvent.press(getByLabelText('Mark notification as read'));

    // Assert
    expect(mockOnMarkRead).toHaveBeenCalledWith('1');
  });
});
```

---

### Test Coverage
- [ ] `npm run test:coverage` shows >80% coverage
- [ ] Critical paths have 100% coverage
- [ ] Edge cases tested
- [ ] Error cases tested
- [ ] Loading states tested

**Verification Command:**
```bash
cd mobile && npm run test:coverage
```

**Expected Output:** `Statements: >80%, Branches: >80%, Functions: >80%, Lines: >80%`

---

## Documentation Quality Standards

### JSDoc Comments
- [ ] All exported components have JSDoc
- [ ] All public functions have JSDoc
- [ ] Complex logic has inline comments explaining "why"
- [ ] Props interface has JSDoc
- [ ] Examples provided for complex components

**Example:**
```typescript
/**
 * NotificationCard displays a single notification with actions
 *
 * Supports swipe-to-delete gesture and tap-to-mark-read interaction.
 *
 * @example
 * ```tsx
 * <NotificationCard
 *   notification={notification}
 *   onMarkRead={handleMarkRead}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export const NotificationCard: React.FC<NotificationCardProps> = ({ ... }) => {
  // ...
};
```

---

### Code Comments
- [ ] Complex algorithms explained
- [ ] Workarounds documented with reason
- [ ] TODOs have ticket numbers (TODO: Fix in #123)
- [ ] No commented-out code (delete or explain)

---

## Contract Compliance

### Component Contracts
- [ ] Component interface in [component-interfaces.ts](contracts/component-contracts/component-interfaces.ts)
- [ ] Navigation types in [navigation-types.ts](contracts/component-contracts/navigation-types.ts)
- [ ] Redux types in [redux-types.ts](contracts/component-contracts/redux-types.ts)
- [ ] Theme usage follows [theme-contract.ts](contracts/component-contracts/theme-contract.ts)

### Data Contracts
- [ ] DTOs match [dto-definitions.ts](contracts/data-contracts/dto-definitions.ts)
- [ ] API responses typed correctly
- [ ] Error handling follows [error-types.ts](contracts/data-contracts/error-types.ts)

---

## Manual Testing Checklist

### Happy Path
- [ ] Primary user flow works end-to-end
- [ ] All interactive elements respond correctly
- [ ] Navigation works as expected
- [ ] Data loads and displays correctly

### Error Scenarios
- [ ] Network offline - shows offline message
- [ ] API error - shows error message
- [ ] Empty state - shows empty state illustration
- [ ] Loading state - shows loading indicator

### Edge Cases
- [ ] Very long text - truncates or wraps correctly
- [ ] Empty data - displays gracefully
- [ ] Rapid tapping - prevents duplicate actions
- [ ] Slow network - shows loading state

---

## Pre-Handoff Final Check

### Files to Include
- [ ] Component implementation files
- [ ] Test files
- [ ] Updated contract files
- [ ] Screenshots (if UI changes)
- [ ] Screen recordings (for complex interactions)

### Handoff Documentation
- [ ] [ui-to-qa-handoff-template.md](coordination/handoff-protocols/ui-to-qa-handoff-template.md) completed
- [ ] Test scenarios documented
- [ ] Known issues listed
- [ ] Acceptance criteria defined

### Version Control
- [ ] Code committed with descriptive message
- [ ] Branch pushed to remote
- [ ] No merge conflicts
- [ ] No uncommitted changes

---

## Quality Gate Approval

### Self-Review
- [ ] All checklist items above completed
- [ ] Code reviewed by self
- [ ] Manual testing completed
- [ ] Ready for peer review

### Peer Review (if applicable)
- Reviewer Name: _______________
- Review Date: _______________
- **Status:** [ ] Approved / [ ] Changes Requested

---

## Quality Gate Decision

**[ ] PASS** - Ready to hand off to QA Agent
**[ ] FAIL** - Address issues before handoff

**Issues to Address:**
1. _______________________
2. _______________________
3. _______________________

---

**Signature:** UI Designer Agent
**Date:** _______________
**Next Agent:** QA Agent

---

**Remember:** This quality gate protects the team from preventable defects. Take the time to complete it thoroughly!
