# Code Review Checklist

This checklist ensures thorough code reviews across all agents (UI Designer, Database, QA).

**Purpose:** Maintain code quality, catch bugs early, share knowledge, and ensure consistency.

---

## How to Use This Checklist

**Reviewer:**
1. Check out the feature branch
2. Read the PR description and handoff document
3. Go through each section below
4. Add comments on specific lines of code
5. Approve, Request Changes, or Comment

**Author:**
1. Complete self-review before requesting review
2. Address all reviewer comments
3. Re-request review after changes

---

## General Code Quality

### Code Readability
- [ ] Code is easy to read and understand
- [ ] Variable names are descriptive (no single letters except loops)
- [ ] Function names describe what they do
- [ ] Complex logic has explanatory comments
- [ ] No overly clever code (KISS principle)
- [ ] Functions are small (<50 lines)
- [ ] Files are focused (<500 lines)

**Questions to Ask:**
- Can a junior developer understand this code?
- Could I understand this code in 6 months?
- Are there simpler ways to achieve the same result?

---

### Code Organization
- [ ] Files organized logically
- [ ] Imports organized (React > external > internal)
- [ ] No circular dependencies
- [ ] Related code is grouped together
- [ ] Consistent file/folder naming
- [ ] No unnecessary files

**Example Import Order:**
```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. External library imports
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

// 3. Internal imports - absolute paths
import { Button } from '@/components/atoms/Button';
import { useAppDispatch } from '@/store/hooks';

// 4. Relative imports
import { NotificationCardProps } from './types';
import { calculateScore } from './utils';

// 5. Types
import type { Notification } from '@/contracts/data-contracts/dto-definitions';
```

---

### DRY Principle (Don't Repeat Yourself)
- [ ] No duplicate code
- [ ] Repeated logic extracted to utilities
- [ ] Repeated components extracted to shared
- [ ] Repeated strings extracted to constants
- [ ] Magic numbers replaced with named constants

**Example:**
```typescript
// Bad
const isValidEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
const isValidWorkEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) && email.includes('company.com');

// Good
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const isValidEmail = (email: string) => EMAIL_REGEX.test(email);
const isValidWorkEmail = (email: string) => isValidEmail(email) && email.includes('company.com');
```

---

### SOLID Principles
- [ ] Single Responsibility - each function/class has one purpose
- [ ] Open/Closed - open for extension, closed for modification
- [ ] Liskov Substitution - subtypes can replace base types
- [ ] Interface Segregation - no unnecessary interface methods
- [ ] Dependency Inversion - depend on abstractions, not concretions

---

## TypeScript Quality

### Type Safety
- [ ] No `any` types
- [ ] No `@ts-ignore` without explanation
- [ ] All function parameters typed
- [ ] All function return types explicit
- [ ] Proper use of `unknown` for untrusted input
- [ ] Proper use of generics where appropriate
- [ ] Union types used correctly
- [ ] Type guards used for narrowing

**Example:**
```typescript
// Bad
function processData(data: any): any {
  return data.map((item: any) => item.value);
}

// Good
interface DataItem {
  value: string;
}

function processData(data: DataItem[]): string[] {
  return data.map(item => item.value);
}
```

---

### Interface & Type Definitions
- [ ] Interfaces in contract files
- [ ] Interfaces exported for reuse
- [ ] JSDoc comments on interfaces
- [ ] Discriminated unions for variants
- [ ] Readonly where appropriate
- [ ] Optional vs required fields correct

**Example:**
```typescript
/**
 * Notification data structure
 */
export interface Notification {
  readonly id: string;
  readonly userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  deletedAt?: string; // Optional
}
```

---

## React/React Native Quality

### Component Design
- [ ] Component has single responsibility
- [ ] Component is reusable
- [ ] Props interface defined
- [ ] PropTypes or TypeScript types
- [ ] Default props provided
- [ ] Component properly memoized (if needed)
- [ ] No business logic in presentational components

---

### Hooks Usage
- [ ] Hooks follow Rules of Hooks
- [ ] Hooks at top of component
- [ ] Dependency arrays complete
- [ ] No stale closures
- [ ] useCallback for event handlers
- [ ] useMemo for expensive calculations
- [ ] Custom hooks for reusable logic

**Example:**
```typescript
// Bad
const handlePress = () => {
  console.log(notification); // Might be stale
};

// Good
const handlePress = useCallback(() => {
  console.log(notification);
}, [notification]); // Fresh on notification change
```

---

### State Management
- [ ] State at appropriate level (local vs global)
- [ ] Redux for global state
- [ ] Local state for UI-only concerns
- [ ] State updates are immutable
- [ ] No direct state mutation
- [ ] Reducers are pure functions

---

### Performance
- [ ] No unnecessary re-renders
- [ ] Lists use FlatList (not ScrollView)
- [ ] Images optimized and lazy-loaded
- [ ] Heavy computations memoized
- [ ] No inline object/array literals in JSX
- [ ] React.memo used appropriately

---

## Database Code Quality

### SQL Quality
- [ ] Queries are readable (formatted, indented)
- [ ] Queries use consistent naming (snake_case)
- [ ] Queries parameterized (no string concatenation)
- [ ] No SELECT * (explicit column names)
- [ ] Proper JOIN types (INNER, LEFT, etc.)
- [ ] WHERE clauses use indexed columns
- [ ] Subqueries avoided when JOIN possible

**Example:**
```sql
-- Bad
SELECT * FROM contacts WHERE user_id = 'hardcoded-uuid';

-- Good
SELECT
  id,
  name,
  email,
  phone,
  created_at
FROM contacts
WHERE user_id = $1
  AND deleted_at IS NULL
ORDER BY name ASC
LIMIT 20;
```

---

### Migration Quality
- [ ] Migration is idempotent
- [ ] Migration has down/rollback script
- [ ] Migration tested locally
- [ ] No data loss
- [ ] Backwards compatible
- [ ] Migration completes quickly (<5 min)

---

### RLS Policies
- [ ] RLS enabled on user tables
- [ ] Policies are restrictive
- [ ] Policies tested with multiple users
- [ ] No security holes

---

## Testing Quality

### Test Coverage
- [ ] Unit tests for new code
- [ ] Integration tests for features
- [ ] E2E tests for critical flows
- [ ] Coverage >80%
- [ ] Edge cases covered
- [ ] Error cases covered

---

### Test Quality
- [ ] Tests follow AAA pattern
- [ ] Test names descriptive
- [ ] One assertion per test
- [ ] No flaky tests
- [ ] Tests isolated (no shared state)
- [ ] Mocks used appropriately

**Example:**
```typescript
describe('NotificationCard', () => {
  it('should call onMarkRead when tapped', () => {
    // Arrange
    const mockOnMarkRead = jest.fn();
    const notification = createMockNotification({ read: false });

    // Act
    const { getByLabelText } = render(
      <NotificationCard notification={notification} onMarkRead={mockOnMarkRead} />
    );
    fireEvent.press(getByLabelText('Mark as read'));

    // Assert
    expect(mockOnMarkRead).toHaveBeenCalledWith(notification.id);
  });
});
```

---

## Security Review

### Authentication & Authorization
- [ ] Authentication required for protected routes
- [ ] Authorization checks implemented
- [ ] User can only access own data
- [ ] Tokens stored securely
- [ ] Sessions expire correctly

---

### Input Validation
- [ ] All user input validated
- [ ] SQL injection prevented
- [ ] XSS prevented
- [ ] CSRF protection (if web)
- [ ] File uploads validated
- [ ] Rate limiting implemented

---

### Data Privacy
- [ ] Sensitive data encrypted
- [ ] Passwords never logged
- [ ] PII handled correctly
- [ ] GDPR compliance (if EU users)
- [ ] No hardcoded secrets

**Check:**
- Are API keys in environment variables?
- Are secrets in `.gitignore`?
- Is sensitive data masked in logs?

---

## Error Handling

### Error Coverage
- [ ] All async operations have error handling
- [ ] Network errors caught
- [ ] Database errors caught
- [ ] Validation errors caught
- [ ] Edge cases handled

---

### Error Messages
- [ ] Error messages user-friendly
- [ ] Error messages actionable
- [ ] Technical details not exposed to users
- [ ] Errors logged for debugging
- [ ] Stack traces only in development

**Example:**
```typescript
// Bad
catch (error) {
  alert(error.stack); // Exposes internal details
}

// Good
catch (error) {
  console.error('Failed to load notifications:', error); // Log for devs
  showErrorToast('Unable to load notifications. Please try again.'); // User-friendly
}
```

---

## Accessibility Review

### Semantic HTML/Components
- [ ] Correct accessibility roles
- [ ] Headings in logical order
- [ ] Form labels present
- [ ] Links vs buttons used correctly

---

### Screen Reader Support
- [ ] accessibilityLabel on interactive elements
- [ ] accessibilityHint where needed
- [ ] State changes announced
- [ ] Dynamic content announced

---

### Visual Accessibility
- [ ] Color contrast sufficient (≥4.5:1)
- [ ] Tap targets large enough (≥44x44)
- [ ] No color-only information
- [ ] Focus indicators visible

---

## Performance Review

### Code Performance
- [ ] No performance regressions
- [ ] Algorithms efficient (no O(n²) for large n)
- [ ] Database queries optimized
- [ ] N+1 queries avoided
- [ ] Caching used appropriately

---

### Bundle Size
- [ ] Bundle size impact <500KB
- [ ] Tree shaking working
- [ ] Lazy loading used
- [ ] No unnecessary dependencies

---

## Documentation Review

### Code Comments
- [ ] Public functions have JSDoc
- [ ] Complex logic explained
- [ ] TODOs have ticket numbers
- [ ] No commented-out code (without reason)

**Example:**
```typescript
/**
 * Calculates relationship health score based on interaction frequency
 *
 * @param contactId - UUID of the contact
 * @returns Health score (0-100) and temperature classification
 * @throws {Error} If contact not found
 */
export async function calculateRelationshipHealth(
  contactId: string
): Promise<HealthScore> {
  // Implementation...
}
```

---

### README Updates
- [ ] README updated if setup changed
- [ ] New environment variables documented
- [ ] New npm scripts documented
- [ ] Breaking changes highlighted

---

## Contract Compliance

### Contract Updates
- [ ] Component contracts updated
- [ ] Data contracts updated
- [ ] API contracts updated
- [ ] Database contracts updated

---

### Breaking Changes
- [ ] Breaking changes documented
- [ ] Migration guide provided
- [ ] Dependent code updated
- [ ] Backwards compatibility considered

---

## Git & Version Control

### Commit Quality
- [ ] Commit messages descriptive
- [ ] Commits atomic (single purpose)
- [ ] No "WIP" or "fix" commits (squash first)
- [ ] No merge commits (rebase instead)

**Good Commit Messages:**
- `feat: Add notification list screen with mark-as-read`
- `fix: Prevent infinite re-render in NotificationCard`
- `refactor: Extract notification logic to custom hook`
- `test: Add unit tests for notification selectors`

---

### Branch Management
- [ ] Branch named descriptively (feature/*, bugfix/*)
- [ ] No merge conflicts
- [ ] Branch up to date with main
- [ ] No uncommitted changes

---

### Pull Request
- [ ] PR title descriptive
- [ ] PR description complete
- [ ] Handoff document linked
- [ ] Related issues linked
- [ ] Screenshots provided (if UI changes)

---

## Review Checklist Summary

### Must Have (Blocking)
- [ ] No bugs introduced
- [ ] No security vulnerabilities
- [ ] Tests written and passing
- [ ] TypeScript compiles with no errors
- [ ] Linter passes with no errors
- [ ] Contracts updated

### Should Have (Non-Blocking, but important)
- [ ] Code is readable and maintainable
- [ ] Performance is acceptable
- [ ] Accessibility requirements met
- [ ] Documentation updated
- [ ] No code smells

### Nice to Have
- [ ] Code is exemplary
- [ ] Tests are comprehensive
- [ ] Performance is excellent
- [ ] Documentation is thorough

---

## Review Outcomes

### Approve ✅
**When to use:**
- All "Must Have" items checked
- All "Should Have" items checked or have plan to address
- Code is ready to merge

**Action:** Approve PR, author can merge

---

### Request Changes 🔴
**When to use:**
- "Must Have" items not met
- Security vulnerabilities found
- Bugs found
- Breaking changes without migration

**Action:** Author must address before re-review

---

### Comment 💬
**When to use:**
- Minor suggestions
- Questions for clarification
- Nice-to-have improvements
- Sharing knowledge

**Action:** Author can address or discuss

---

## Reviewer Tips

### Be Constructive
- ✅ "Consider extracting this to a utility function for reusability"
- ❌ "This code is terrible"

### Ask Questions
- ✅ "Why did you choose approach X over Y?"
- ❌ "This is wrong"

### Praise Good Code
- ✅ "Great use of TypeScript generics here!"
- ✅ "I like how you handled this edge case"

### Focus on Important Issues
- Don't nitpick formatting (linter should catch)
- Focus on logic, security, performance
- Balance thoroughness with pragmatism

---

## Author Tips

### Respond to All Comments
- Address or acknowledge every comment
- Explain your reasoning
- Ask for clarification if needed

### Don't Take it Personally
- Code review is about the code, not you
- Reviewers want to help
- Everyone learns from reviews

### Self-Review First
- Review your own PR before requesting review
- Complete quality gate checklist
- Test manually one more time

---

**Remember:** Code review is a collaboration, not a confrontation. The goal is to ship high-quality code together!
