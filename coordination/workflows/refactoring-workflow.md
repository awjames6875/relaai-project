# Refactoring Workflow

This workflow defines the complete process for safely refactoring code in the RelaAI project using the multi-agent system.

**Agents Involved:** Database Agent, Backend Agent (future), UI Designer Agent, QA Agent

---

## Workflow Overview

```
Assess → Plan → Test → Refactor → Verify → Deploy → Monitor
  ↓       ↓      ↓       ↓         ↓        ↓        ↓
Identify Goal  Safety  Small    Tests   Merge   Metrics
Technical      Set     Net     Steps    Pass    Stable
Debt        Baseline
```

**Refactoring Types:**
- **Code Refactoring:** Improve code structure without changing behavior
- **Database Refactoring:** Improve schema design while maintaining data
- **Architecture Refactoring:** Improve system design and component boundaries
- **Performance Refactoring:** Optimize for speed/memory without changing functionality

**Typical Timeline:**
- **Small Refactoring:** 1-3 days
- **Medium Refactoring:** 1-2 weeks
- **Large Refactoring:** 2-4 weeks
- **Architecture Refactoring:** 1-3 months

---

## When to Refactor vs. Rebuild

### Refactor When:
- [ ] Core functionality is sound
- [ ] Technical debt is manageable
- [ ] Tests exist
- [ ] Changes can be incremental
- [ ] Risk is low
- [ ] Timeline is flexible

### Rebuild When:
- [ ] Architecture is fundamentally flawed
- [ ] Technical debt is overwhelming
- [ ] No tests exist
- [ ] Incremental changes impossible
- [ ] Complete reimagining needed
- [ ] Long-term investment justified

---

## Phase 1: Assessment & Planning

### Objective
Identify what needs refactoring and why.

### Responsible Agent
**Any agent (varies by component)**

### Steps

#### 1.1 Identify Refactoring Need

**Code Smells to Look For:**

**Frontend (React Native):**
- Component >300 lines
- Deeply nested conditionals (>3 levels)
- Duplicate code (copy-paste)
- Props drilling (passing props through 3+ levels)
- God component (does too much)
- Tight coupling
- Hardcoded values
- Complex state management
- Poor naming

**Backend (Node.js):**
- Function >50 lines
- File >500 lines
- Circular dependencies
- Duplicate logic
- Poor error handling
- No input validation
- Tight coupling
- Mixed concerns

**Database:**
- Missing indexes on foreign keys
- Poorly normalized schema
- N+1 query patterns
- Redundant data
- Slow queries (>100ms)
- Complex query logic
- Missing constraints

**Example - Identifying a Smell:**
```typescript
// SMELL: God component - ContactDetailScreen does too much
export const ContactDetailScreen = () => {
  // 500 lines of code
  // - Fetching data
  // - Business logic
  // - UI rendering
  // - Form handling
  // - Navigation
  // - Error handling
  // - Analytics
};
```

**Deliverables:**
- [ ] Code smell identified
- [ ] Location documented
- [ ] Impact assessed

---

#### 1.2 Define Refactoring Goal

**SMART Goal:**
- **Specific:** What exactly needs to change?
- **Measurable:** How will success be measured?
- **Achievable:** Is this realistic?
- **Relevant:** Does this provide value?
- **Time-bound:** How long will it take?

**Example Goals:**
```markdown
Goal: Refactor ContactDetailScreen for better maintainability

Specific:
- Extract data fetching to custom hook
- Extract business logic to service layer
- Split UI into smaller components
- Separate concerns (data, logic, presentation)

Measurable:
- Reduce component size from 500 to <200 lines
- Improve test coverage from 40% to >80%
- Reduce complexity from cyclomatic 25 to <10

Achievable:
- Can be done incrementally over 1 week
- No breaking changes required
- Existing tests provide safety net

Relevant:
- Easier to maintain and extend
- Easier to test
- Better code reusability

Time-bound:
- 5 days (1 sprint)
```

**Deliverables:**
- [ ] Refactoring goal defined
- [ ] Success metrics identified
- [ ] Value proposition clear

---

#### 1.3 Assess Risk & Impact

**Risk Assessment:**

**Low Risk:**
- Isolated component/function
- Good test coverage
- No breaking changes
- Easy to rollback

**Medium Risk:**
- Multiple components affected
- Some test coverage
- Potential breaking changes
- Requires coordination

**High Risk:**
- Core functionality
- Little/no test coverage
- Definite breaking changes
- Affects multiple agents

**Impact Assessment:**
```bash
# Find all usages
grep -r "ContactDetailScreen" mobile/src/

# Check dependencies
npm run analyze-deps -- --component ContactDetailScreen

# Check contract impact
grep -r "ContactDetail" contracts/
```

**Questions to Answer:**
- How many files will change?
- How many agents are affected?
- Are there contracts to update?
- Will this break anything?
- Is there a rollback plan?

**Deliverables:**
- [ ] Risk level assessed
- [ ] Impact scope documented
- [ ] Affected agents identified

---

#### 1.4 Create Refactoring Plan

**Break down into small, safe steps:**

**Example Plan: ContactDetailScreen Refactoring**

**Step 1: Add Tests (Safety Net)**
- [ ] Write tests for current behavior
- [ ] Achieve >80% coverage
- [ ] Document expected behavior

**Step 2: Extract Custom Hook**
- [ ] Create useContactDetail hook
- [ ] Move data fetching logic
- [ ] Test hook in isolation
- [ ] Update component to use hook

**Step 3: Extract Service Layer**
- [ ] Create ContactService
- [ ] Move business logic
- [ ] Add service tests
- [ ] Update hook to use service

**Step 4: Split UI Components**
- [ ] Create ContactHeader component
- [ ] Create ContactActions component
- [ ] Create ContactMessages component
- [ ] Create ContactNotes component
- [ ] Update screen to compose components

**Step 5: Cleanup & Optimization**
- [ ] Remove duplicate code
- [ ] Optimize performance
- [ ] Update documentation
- [ ] Final testing

**Deliverables:**
- [ ] Step-by-step plan created
- [ ] Each step is small and safe
- [ ] Dependencies identified
- [ ] Timeline estimated

---

## Phase 2: Establish Safety Net

### Objective
Create comprehensive tests before refactoring.

### Responsible Agent
**QA Agent + Component Owner**

### Steps

#### 2.1 Document Current Behavior

**Create characterization tests:**
```typescript
// ContactDetailScreen.characterization.test.tsx
describe('ContactDetailScreen - Current Behavior', () => {
  it('should fetch contact data on mount', () => {
    const { getByTestId } = render(<ContactDetailScreen contactId="123" />);
    expect(mockFetchContact).toHaveBeenCalledWith('123');
  });

  it('should display contact name and details', async () => {
    const { getByText } = render(<ContactDetailScreen contactId="123" />);
    await waitFor(() => {
      expect(getByText('John Doe')).toBeVisible();
      expect(getByText('john@example.com')).toBeVisible();
    });
  });

  it('should show scheduled messages count', async () => {
    const { getByText } = render(<ContactDetailScreen contactId="123" />);
    await waitFor(() => {
      expect(getByText('3 scheduled messages')).toBeVisible();
    });
  });

  it('should handle delete button press', () => {
    const { getByText } = render(<ContactDetailScreen contactId="123" />);
    fireEvent.press(getByText('Delete Contact'));
    expect(mockNavigate).toHaveBeenCalledWith('Contacts');
  });

  // ... document all current behaviors
});
```

**Deliverables:**
- [ ] All current behaviors documented in tests
- [ ] Tests pass with current implementation
- [ ] Edge cases covered
- [ ] Error cases covered

---

#### 2.2 Achieve Minimum Test Coverage

**Coverage Target: >80% before refactoring**

```bash
# Run coverage report
npm run test:coverage

# Review coverage
open coverage/lcov-report/index.html

# Identify gaps
# Add tests for uncovered code
```

**What to Test:**
- [ ] Happy path (normal usage)
- [ ] Edge cases (empty data, null values)
- [ ] Error cases (network failures, invalid data)
- [ ] User interactions (button clicks, form inputs)
- [ ] State changes (loading, success, error)

**Deliverables:**
- [ ] Test coverage >80%
- [ ] All critical paths tested
- [ ] Tests are fast (<1s each)
- [ ] Tests are reliable (no flakiness)

---

#### 2.3 Baseline Performance Metrics

**Measure current performance:**
```typescript
// Baseline performance test
describe('ContactDetailScreen - Performance Baseline', () => {
  it('should render in <500ms', async () => {
    const start = performance.now();

    render(<ContactDetailScreen contactId="123" />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeVisible();
    });

    const end = performance.now();
    const renderTime = end - start;

    console.log(`Render time: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(500);
  });

  it('should not cause memory leaks', async () => {
    const { unmount } = render(<ContactDetailScreen contactId="123" />);

    // Check for cleanup
    unmount();

    // Verify no listeners remain
    expect(mockEventListeners).toHaveLength(0);
  });
});
```

**Metrics to Baseline:**
- Render time
- Memory usage
- Bundle size impact
- Number of re-renders

**Deliverables:**
- [ ] Baseline metrics recorded
- [ ] Performance tests created
- [ ] Regression thresholds defined

---

## Phase 3: Incremental Refactoring

### Objective
Refactor in small, verifiable steps.

### Responsible Agent
**Component Owner (Database, Backend, or UI Designer Agent)**

### Steps

#### 3.1 Small Step Refactoring

**RULE: Never refactor and add features simultaneously**

**Example: Extract Custom Hook**

**BEFORE:**
```typescript
// ContactDetailScreen.tsx (500 lines)
export const ContactDetailScreen: React.FC<Props> = ({ route }) => {
  const { contactId } = route.params;
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const data = await contactService.getContact(contactId);
        setContact(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [contactId]);

  // ... 400+ more lines
};
```

**AFTER - Step 1: Extract Hook**
```typescript
// hooks/useContactDetail.ts (NEW FILE)
export const useContactDetail = (contactId: string) => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const data = await contactService.getContact(contactId);
        setContact(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [contactId]);

  return { contact, loading, error };
};

// ContactDetailScreen.tsx (NOW 450 lines)
export const ContactDetailScreen: React.FC<Props> = ({ route }) => {
  const { contactId } = route.params;
  const { contact, loading, error } = useContactDetail(contactId);

  // ... rest of component
};
```

**Test After Each Step:**
```bash
# Run all tests
npm test

# Verify behavior unchanged
npm run test:e2e

# Check coverage maintained
npm run test:coverage
```

**Deliverables:**
- [ ] One small refactoring complete
- [ ] All tests still passing
- [ ] Behavior unchanged
- [ ] Code committed

---

#### 3.2 Extract Service Layer

**BEFORE:**
```typescript
// useContactDetail.ts
const data = await contactService.getContact(contactId);
```

**AFTER - Step 2: Move Business Logic**
```typescript
// services/ContactService.ts (ENHANCED)
export class ContactService {
  async getContactWithDetails(contactId: string): Promise<ContactDetail> {
    // Fetch contact
    const contact = await this.getContact(contactId);

    // Fetch related data in parallel
    const [messages, scheduledCount, lastInteraction] = await Promise.all([
      this.getRecentMessages(contactId),
      this.getScheduledMessageCount(contactId),
      this.getLastInteraction(contactId),
    ]);

    // Compute contact health
    const health = this.calculateContactHealth(contact, lastInteraction);

    return {
      ...contact,
      messages,
      scheduledCount,
      lastInteraction,
      health,
    };
  }

  private calculateContactHealth(
    contact: Contact,
    lastInteraction: Date | null
  ): 'good' | 'fair' | 'poor' {
    if (!lastInteraction) return 'poor';

    const daysSinceContact = differenceInDays(new Date(), lastInteraction);

    if (daysSinceContact < 7) return 'good';
    if (daysSinceContact < 30) return 'fair';
    return 'poor';
  }
}

// hooks/useContactDetail.ts
export const useContactDetail = (contactId: string) => {
  const [contactDetail, setContactDetail] = useState<ContactDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactDetail = async () => {
      try {
        setLoading(true);
        const data = await contactService.getContactWithDetails(contactId);
        setContactDetail(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContactDetail();
  }, [contactId]);

  return { contactDetail, loading, error };
};
```

**Test Service Independently:**
```typescript
// ContactService.test.ts
describe('ContactService', () => {
  describe('calculateContactHealth', () => {
    it('should return "good" for recent contact (<7 days)', () => {
      const contact = createMockContact();
      const lastInteraction = subDays(new Date(), 3);

      const health = service.calculateContactHealth(contact, lastInteraction);

      expect(health).toBe('good');
    });

    it('should return "fair" for contact 7-30 days ago', () => {
      const contact = createMockContact();
      const lastInteraction = subDays(new Date(), 15);

      const health = service.calculateContactHealth(contact, lastInteraction);

      expect(health).toBe('fair');
    });

    it('should return "poor" for contact >30 days ago', () => {
      const contact = createMockContact();
      const lastInteraction = subDays(new Date(), 60);

      const health = service.calculateContactHealth(contact, lastInteraction);

      expect(health).toBe('poor');
    });
  });
});
```

**Deliverables:**
- [ ] Business logic extracted to service
- [ ] Service fully tested
- [ ] Hook simplified
- [ ] All tests passing

---

#### 3.3 Split into Smaller Components

**BEFORE:**
```typescript
// ContactDetailScreen.tsx (450 lines)
export const ContactDetailScreen: React.FC<Props> = ({ route }) => {
  const { contactId } = route.params;
  const { contactDetail, loading, error } = useContactDetail(contactId);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!contactDetail) return <NotFound />;

  return (
    <ScrollView>
      {/* 100 lines of header UI */}
      <View>
        <Avatar uri={contactDetail.avatarUrl} />
        <Text>{contactDetail.name}</Text>
        <Text>{contactDetail.email}</Text>
        <Badge health={contactDetail.health} />
      </View>

      {/* 100 lines of actions UI */}
      <View>
        <Button onPress={handleMessage}>Send Message</Button>
        <Button onPress={handleSchedule}>Schedule Message</Button>
        <Button onPress={handleDelete}>Delete Contact</Button>
      </View>

      {/* 100 lines of messages UI */}
      <View>
        <Text>Recent Messages</Text>
        {contactDetail.messages.map(msg => (
          <MessageCard key={msg.id} message={msg} />
        ))}
      </View>

      {/* 100 lines of notes UI */}
      <View>
        <Text>Notes</Text>
        <TextInput value={notes} onChangeText={setNotes} />
        <Button onPress={handleSaveNotes}>Save</Button>
      </View>
    </ScrollView>
  );
};
```

**AFTER - Step 3: Extract Components**
```typescript
// components/molecules/ContactHeader.tsx
export const ContactHeader: React.FC<ContactHeaderProps> = ({ contact }) => {
  return (
    <View>
      <Avatar uri={contact.avatarUrl} />
      <Text>{contact.name}</Text>
      <Text>{contact.email}</Text>
      <HealthBadge health={contact.health} />
    </View>
  );
};

// components/molecules/ContactActions.tsx
export const ContactActions: React.FC<ContactActionsProps> = ({
  contact,
  onMessage,
  onSchedule,
  onDelete,
}) => {
  return (
    <View>
      <Button onPress={() => onMessage(contact.id)}>Send Message</Button>
      <Button onPress={() => onSchedule(contact.id)}>Schedule Message</Button>
      <Button onPress={() => onDelete(contact.id)}>Delete Contact</Button>
    </View>
  );
};

// components/organisms/ContactMessages.tsx
export const ContactMessages: React.FC<ContactMessagesProps> = ({ messages }) => {
  return (
    <View>
      <Text>Recent Messages</Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageCard message={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

// components/organisms/ContactNotes.tsx
export const ContactNotes: React.FC<ContactNotesProps> = ({
  contactId,
  initialNotes,
  onSave,
}) => {
  const [notes, setNotes] = useState(initialNotes);

  const handleSave = async () => {
    await onSave(contactId, notes);
  };

  return (
    <View>
      <Text>Notes</Text>
      <TextInput value={notes} onChangeText={setNotes} />
      <Button onPress={handleSave}>Save</Button>
    </View>
  );
};

// ContactDetailScreen.tsx (NOW <100 lines!)
export const ContactDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { contactId } = route.params;
  const { contactDetail, loading, error } = useContactDetail(contactId);

  const handleMessage = (id: string) => {
    navigation.navigate('NewMessage', { contactId: id });
  };

  const handleSchedule = (id: string) => {
    navigation.navigate('ScheduleMessage', { contactId: id });
  };

  const handleDelete = async (id: string) => {
    await contactService.deleteContact(id);
    navigation.goBack();
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    await contactService.updateNotes(id, notes);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!contactDetail) return <NotFound />;

  return (
    <ScrollView>
      <ContactHeader contact={contactDetail} />
      <ContactActions
        contact={contactDetail}
        onMessage={handleMessage}
        onSchedule={handleSchedule}
        onDelete={handleDelete}
      />
      <ContactMessages messages={contactDetail.messages} />
      <ContactNotes
        contactId={contactDetail.id}
        initialNotes={contactDetail.notes}
        onSave={handleSaveNotes}
      />
    </ScrollView>
  );
};
```

**Test Each Component:**
```typescript
// ContactHeader.test.tsx
describe('ContactHeader', () => {
  it('should render contact information', () => {
    const contact = createMockContact();
    const { getByText } = render(<ContactHeader contact={contact} />);

    expect(getByText(contact.name)).toBeVisible();
    expect(getByText(contact.email)).toBeVisible();
  });
});

// ContactActions.test.tsx
describe('ContactActions', () => {
  it('should call onMessage when Send Message pressed', () => {
    const mockOnMessage = jest.fn();
    const contact = createMockContact();

    const { getByText } = render(
      <ContactActions contact={contact} onMessage={mockOnMessage} />
    );

    fireEvent.press(getByText('Send Message'));

    expect(mockOnMessage).toHaveBeenCalledWith(contact.id);
  });
});
```

**Deliverables:**
- [ ] UI split into reusable components
- [ ] Each component <200 lines
- [ ] Each component tested
- [ ] Screen simplified significantly

---

#### 3.4 Database Refactoring

**Example: Normalize denormalized data**

**BEFORE - Denormalized:**
```sql
-- contacts table with duplicated tag data
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  email TEXT,
  tags TEXT[], -- Denormalized - tags stored as array
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**AFTER - Normalized (Multi-step migration):**

**Step 1: Create new tags table**
```sql
-- V021_create_tags_table.sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE TABLE contact_tags (
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (contact_id, tag_id)
);

-- Migrate existing data
INSERT INTO tags (user_id, name)
SELECT DISTINCT c.user_id, unnest(c.tags)
FROM contacts c
WHERE c.tags IS NOT NULL AND array_length(c.tags, 1) > 0;

INSERT INTO contact_tags (contact_id, tag_id)
SELECT c.id, t.id
FROM contacts c
CROSS JOIN unnest(c.tags) AS tag_name
JOIN tags t ON t.name = tag_name AND t.user_id = c.user_id
WHERE c.tags IS NOT NULL;
```

**Step 2: Update application code to use new tables**
```typescript
// Update ContactService to use normalized schema
async getContactTags(contactId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('contact_tags')
    .select('tag:tags(*)')
    .eq('contact_id', contactId);

  if (error) throw error;
  return data.map(ct => ct.tag);
}
```

**Step 3: Remove old tags column (after verification)**
```sql
-- V022_remove_tags_column.sql
-- Only run after confirming new schema works
ALTER TABLE contacts DROP COLUMN tags;
```

**Deliverables:**
- [ ] Schema normalized
- [ ] Data migrated successfully
- [ ] Application updated
- [ ] Old schema removed (after verification)

---

## Phase 4: Verification & Testing

### Objective
Ensure refactoring didn't break anything.

### Responsible Agent
**QA Agent**

### Steps

#### 4.1 Run Full Test Suite

```bash
# Run all tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Check coverage (should be maintained or improved)
npm run test:coverage
```

**Test Results Should Show:**
- [ ] All tests passing
- [ ] Coverage ≥ baseline (ideally improved)
- [ ] No new warnings or errors
- [ ] Test execution time similar

**Deliverables:**
- [ ] All automated tests passing
- [ ] Coverage maintained/improved
- [ ] No regressions detected

---

#### 4.2 Performance Comparison

**Compare against baseline:**
```typescript
// Performance comparison
describe('ContactDetailScreen - After Refactoring', () => {
  it('should render in <500ms (baseline: 450ms)', async () => {
    const start = performance.now();

    render(<ContactDetailScreen contactId="123" />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeVisible();
    });

    const end = performance.now();
    const renderTime = end - start;

    console.log(`Render time: ${renderTime}ms (baseline: 450ms)`);
    expect(renderTime).toBeLessThan(500);
  });
});
```

**Metrics to Compare:**
- [ ] Render time: same or better
- [ ] Memory usage: same or better
- [ ] Bundle size: similar (±5%)
- [ ] Re-renders: same or fewer

**If performance regressed:**
- Identify bottleneck
- Optimize hot paths
- Use React.memo, useCallback, useMemo
- Profile with React DevTools

**Deliverables:**
- [ ] Performance maintained or improved
- [ ] No significant regressions
- [ ] Optimizations applied if needed

---

#### 4.3 Manual Testing

**Test all affected features:**
- [ ] Happy path works
- [ ] Edge cases work
- [ ] Error handling works
- [ ] UI looks correct
- [ ] Interactions feel smooth
- [ ] No console errors
- [ ] Accessibility maintained

**Deliverables:**
- [ ] Manual testing complete
- [ ] No functional regressions
- [ ] UX maintained or improved

---

## Phase 5: Code Review & Deployment

### Objective
Get peer review and deploy refactored code.

### Steps

#### 5.1 Create Pull Request

**PR Title:**
```
Refactor: Simplify ContactDetailScreen into composable components
```

**PR Description:**
```markdown
## Objective
Refactor ContactDetailScreen to improve maintainability and testability.

## Changes
- Extracted `useContactDetail` custom hook for data fetching
- Moved business logic to `ContactService`
- Split UI into smaller components:
  - `ContactHeader` (contact info display)
  - `ContactActions` (action buttons)
  - `ContactMessages` (message list)
  - `ContactNotes` (notes editor)
- Reduced ContactDetailScreen from 500 to 87 lines

## Testing
- All existing tests passing
- Added tests for new hook and service
- Added tests for new components
- Coverage improved from 40% to 85%
- Manual testing complete on iOS and Android

## Performance
- Render time: 420ms (baseline: 450ms) ✅
- Bundle size: +2KB (acceptable) ✅
- Memory usage: unchanged ✅

## Breaking Changes
None - this is purely internal refactoring

## Checklist
- [x] Tests added/updated
- [x] All tests passing
- [x] Performance maintained
- [x] Documentation updated
- [x] Manual testing complete
- [x] No breaking changes
```

**Deliverables:**
- [ ] PR created with detailed description
- [ ] All changes explained
- [ ] Testing evidence provided

---

#### 5.2 Code Review Checklist

**Reviewer should verify:**
- [ ] Refactoring follows plan
- [ ] Tests comprehensive
- [ ] No behavior changes (unless documented)
- [ ] Performance maintained
- [ ] Code quality improved
- [ ] Documentation updated
- [ ] No over-engineering
- [ ] SOLID principles followed

**Common Review Comments:**
- "Can this be simplified further?"
- "Is this component too complex still?"
- "Should we extract this logic?"
- "Do we need this abstraction?"

**Deliverables:**
- [ ] Code review completed
- [ ] Feedback addressed
- [ ] Approval obtained

---

#### 5.3 Merge & Deploy

```bash
# Merge to main
gh pr merge --squash

# Deploy to staging first
git push staging main

# Test in staging
npm run test:smoke:staging

# Deploy to production (with gradual rollout if possible)
git push production main

# Monitor for issues
```

**Post-Deployment Monitoring:**
- [ ] Error rate unchanged
- [ ] Performance metrics stable
- [ ] No user complaints
- [ ] Functionality working

**Deliverables:**
- [ ] Refactored code merged
- [ ] Deployed to production
- [ ] Monitoring confirms stability

---

## Phase 6: Documentation & Knowledge Sharing

### Objective
Document refactoring and share learnings.

### Steps

#### 6.1 Update Documentation

**Code Comments:**
```typescript
/**
 * useContactDetail - Custom hook for fetching contact details
 *
 * Fetches a contact along with related data (messages, scheduled count,
 * last interaction) and computes contact health.
 *
 * @param contactId - UUID of contact to fetch
 * @returns Contact detail with loading and error states
 *
 * @example
 * ```tsx
 * const { contactDetail, loading, error } = useContactDetail('contact-123');
 * ```
 */
export const useContactDetail = (contactId: string) => {
  // ...
};
```

**Architecture Documentation:**
```markdown
# Contact Detail Architecture

## Component Structure (After Refactoring)

```
ContactDetailScreen (orchestrator)
├── useContactDetail (data fetching hook)
│   └── ContactService (business logic)
│       └── Supabase (data layer)
├── ContactHeader (presentation)
├── ContactActions (presentation)
├── ContactMessages (presentation)
└── ContactNotes (presentation + local state)
```

## Design Decisions
- **Separation of Concerns:** Data, logic, and presentation are separated
- **Composability:** Screen composes smaller, reusable components
- **Testability:** Each layer can be tested independently
- **Maintainability:** Changes localized to single component

## Performance Characteristics
- Initial render: ~420ms
- Re-render on data update: ~50ms
- Memory footprint: ~12MB
```

**Deliverables:**
- [ ] Code comments added
- [ ] Architecture documented
- [ ] Design decisions explained

---

#### 6.2 Share Knowledge with Team

**Team Announcement:**
```
#engineering channel:

"🔧 Refactoring Complete: ContactDetailScreen

We've refactored ContactDetailScreen to improve maintainability:

Before:
- 500 lines in one file
- Complex, hard to test
- 40% test coverage

After:
- 87 line orchestrator + 4 small components
- Each component <150 lines
- 85% test coverage

Benefits:
✅ Easier to maintain and extend
✅ Better testability
✅ Reusable components
✅ Same performance

Pattern can be applied to other God components. Let me know if you
have questions!

PR: #456
Docs: docs/architecture/contact-detail.md"
```

**Deliverables:**
- [ ] Team notified
- [ ] Knowledge shared
- [ ] Questions answered

---

## Refactoring Patterns & Techniques

### Extract Method
**Before:**
```typescript
const handleSubmit = () => {
  // 50 lines of validation
  // 30 lines of API call
  // 20 lines of state update
};
```

**After:**
```typescript
const handleSubmit = async () => {
  const isValid = validateForm(formData);
  if (!isValid) return;

  const result = await submitToAPI(formData);
  updateState(result);
};

const validateForm = (data) => { /* ... */ };
const submitToAPI = (data) => { /* ... */ };
const updateState = (result) => { /* ... */ };
```

---

### Replace Conditional with Polymorphism
**Before:**
```typescript
const MessageCard = ({ message }) => {
  if (message.type === 'text') {
    return <TextMessage message={message} />;
  } else if (message.type === 'image') {
    return <ImageMessage message={message} />;
  } else if (message.type === 'scheduled') {
    return <ScheduledMessage message={message} />;
  }
};
```

**After:**
```typescript
const messageComponents = {
  text: TextMessage,
  image: ImageMessage,
  scheduled: ScheduledMessage,
};

const MessageCard = ({ message }) => {
  const Component = messageComponents[message.type];
  return <Component message={message} />;
};
```

---

### Introduce Parameter Object
**Before:**
```typescript
function createContact(
  name: string,
  email: string,
  phone: string,
  address: string,
  notes: string
) {
  // ...
}
```

**After:**
```typescript
interface CreateContactParams {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

function createContact(params: CreateContactParams) {
  // ...
}
```

---

### Replace Magic Numbers with Named Constants
**Before:**
```typescript
if (daysSinceContact < 7) return 'good';
if (daysSinceContact < 30) return 'fair';
return 'poor';
```

**After:**
```typescript
const CONTACT_HEALTH_THRESHOLDS = {
  GOOD: 7,
  FAIR: 30,
} as const;

if (daysSinceContact < CONTACT_HEALTH_THRESHOLDS.GOOD) return 'good';
if (daysSinceContact < CONTACT_HEALTH_THRESHOLDS.FAIR) return 'fair';
return 'poor';
```

---

## Common Pitfalls & How to Avoid

### Pitfall 1: Refactoring Too Much at Once
**Problem:** Large refactoring introduces many changes, hard to review, high risk

**Solution:** Break into small PRs (1-3 days each)

---

### Pitfall 2: Refactoring Without Tests
**Problem:** No safety net, regressions go undetected

**Solution:** Always write tests first (characterization tests)

---

### Pitfall 3: Over-Engineering
**Problem:** Creating unnecessary abstractions, making code more complex

**Solution:** Follow YAGNI (You Aren't Gonna Need It), refactor when needed

---

### Pitfall 4: Ignoring Performance
**Problem:** Refactoring introduces performance regressions

**Solution:** Baseline metrics before, compare after

---

### Pitfall 5: Breaking Contracts
**Problem:** Refactoring changes APIs, breaks other agents' code

**Solution:** Update contracts first, maintain backwards compatibility

---

## Success Indicators

- [ ] Code quality improved (complexity, duplication, size)
- [ ] Test coverage improved
- [ ] Performance maintained or improved
- [ ] No bugs introduced
- [ ] Team understanding improved
- [ ] Future development easier
- [ ] Technical debt reduced
- [ ] All tests passing

---

**Remember:** The goal of refactoring is to make code easier to understand and modify. If you're not achieving that, reconsider your approach!
