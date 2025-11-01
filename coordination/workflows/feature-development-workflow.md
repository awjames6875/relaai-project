# Feature Development Workflow

This workflow defines the complete process for developing a new feature in the RelaAI project using the multi-agent system.

**Agents Involved:** Database Agent, UI Designer Agent, QA Agent

---

## Workflow Overview

```
Planning → Database → Backend → Frontend → Testing → Release
   ↓         ↓          ↓          ↓          ↓         ↓
  Epic   → Schema  → API    → Components → QA    → Deploy
```

**Typical Timeline:** 2-4 weeks depending on complexity

---

## Phase 1: Planning & Design

### Objective
Define feature requirements, create contracts, and break down into tasks.

### Responsible Agent
**Product Owner / Tech Lead**

### Steps

#### 1.1 Create Feature Epic
- Use [feature-task-epic.md](coordination/task-template/feature-task-epic.md) template
- Define user stories with acceptance criteria
- Estimate effort and timeline
- Identify dependencies and risks

**Deliverables:**
- [ ] Epic document completed
- [ ] User stories defined
- [ ] Success metrics identified

---

#### 1.2 Define Contracts
Create or update contracts before implementation:

**Database Contracts:**
- [ ] Update [schema.sql](contracts/database-contracts/schema.sql) with new tables
- [ ] Define indexes in [indexes.sql](contracts/database-contracts/indexes.sql)
- [ ] Document functions in [functions.sql](contracts/database-contracts/functions.sql)

**Data Contracts:**
- [ ] Define DTOs in [dto-definitions.ts](contracts/data-contracts/dto-definitions.ts)
- [ ] Add validation schemas in [validation-schemas.ts](contracts/data-contracts/validation-schemas.ts)
- [ ] Define error types in [error-types.ts](contracts/data-contracts/error-types.ts)

**API Contracts:**
- [ ] Create OpenAPI spec in `contracts/api-contracts/[feature]-endpoints.yaml`
- [ ] Define request/response structures
- [ ] Document all endpoints and parameters

**Component Contracts:**
- [ ] Define component interfaces in [component-interfaces.ts](contracts/component-contracts/component-interfaces.ts)
- [ ] Update navigation types in [navigation-types.ts](contracts/component-contracts/navigation-types.ts)
- [ ] Define Redux state in [redux-types.ts](contracts/component-contracts/redux-types.ts)

**Deliverables:**
- [ ] All contracts defined and reviewed
- [ ] Contracts committed to repository
- [ ] Team aligned on contracts

---

#### 1.3 Break Down Into Tasks
Create individual tasks for each agent:

- [ ] Database migration tasks
- [ ] Backend API tasks
- [ ] Frontend component tasks
- [ ] Testing tasks
- [ ] DevOps/infrastructure tasks

Use appropriate task templates:
- [component-implementation-task.md](coordination/task-template/component-implementation-task.md)
- [database-migration-task.md](coordination/task-template/database-migration-task.md)
- [test-suite-task.md](coordination/task-template/test-suite-task.md)

**Deliverables:**
- [ ] All tasks created and assigned
- [ ] Dependencies identified
- [ ] Timeline agreed upon

---

## Phase 2: Database Implementation

### Objective
Implement database schema, migrations, and functions.

### Responsible Agent
**Database Agent**

### Steps

#### 2.1 Create Database Migration
- Use [database-migration-task.md](coordination/task-template/database-migration-task.md)
- Write idempotent up migration
- Write rollback down migration
- Create indexes for performance
- Implement RLS policies

**Quality Gate:** [database-agent-quality-gate.md](coordination/review-gates/database-agent-quality-gate.md)

**Deliverables:**
- [ ] Migration files created (`V###_description.sql`)
- [ ] Tested on local database
- [ ] RLS policies verified
- [ ] Performance benchmarks met

---

#### 2.2 Test Database Changes
```bash
# Apply migration
supabase migration up

# Verify schema
psql -d postgres -c "\d+ table_name"

# Test RLS policies
npm run test:rls

# Benchmark performance
EXPLAIN ANALYZE SELECT * FROM table_name WHERE user_id = $1;
```

**Deliverables:**
- [ ] Migration tested locally
- [ ] RLS tests passing
- [ ] Query performance <100ms

---

#### 2.3 Handoff to Backend/Frontend
- Complete [database-to-ui-handoff-template.md](coordination/handoff-protocols/database-to-ui-handoff-template.md)
- Complete [database-to-backend-handoff-template.md](coordination/handoff-protocols/database-to-backend-handoff-template.md)
- Provide sample data
- Document query patterns

**Deliverables:**
- [ ] Handoff documents completed
- [ ] Sample data provided
- [ ] Next agents notified

---

## Phase 3: Backend Implementation

### Objective
Implement API endpoints following contracts.

### Responsible Agent
**Backend Agent** (Note: Not yet implemented in current system)

### Steps

#### 3.1 Implement API Endpoints
- Follow OpenAPI spec in `contracts/api-contracts/`
- Implement request validation
- Implement business logic
- Handle errors gracefully
- Return responses matching DTOs

**Example:**
```typescript
// POST /api/notifications
router.post('/notifications', async (req, res) => {
  try {
    // Validate request
    const validated = NotificationSchema.parse(req.body);

    // Create notification
    const notification = await notificationService.create(validated);

    // Return response matching DTO
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

**Deliverables:**
- [ ] All endpoints implemented
- [ ] Request validation added
- [ ] Error handling implemented
- [ ] Unit tests written

---

#### 3.2 Test API Endpoints
```bash
# Run API tests
npm run test:api

# Test with Postman/Insomnia
# Verify all endpoints work as specified
```

**Deliverables:**
- [ ] API tests passing (>85% coverage)
- [ ] Manual testing completed
- [ ] Performance benchmarks met (<200ms p95)

---

#### 3.3 Handoff to Frontend
- Document endpoint usage
- Provide example requests/responses
- Share Postman collection
- Update API documentation

**Deliverables:**
- [ ] API documentation updated
- [ ] Example requests provided
- [ ] Frontend team notified

---

## Phase 4: Frontend Implementation

### Objective
Implement UI components and screens.

### Responsible Agent
**UI Designer Agent**

### Steps

#### 4.1 Implement Components
Following atomic design pattern:

**Atoms:**
```typescript
// Button, Input, Avatar, Badge, etc.
export const Button: React.FC<ButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};
```

**Molecules:**
```typescript
// NotificationCard, SearchBar, etc.
export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  onDelete
}) => {
  return (
    <Card>
      <Title>{notification.title}</Title>
      <Message>{notification.message}</Message>
      <Actions>
        <Button label="Mark Read" onPress={() => onMarkRead(notification.id)} />
        <Button label="Delete" onPress={() => onDelete(notification.id)} />
      </Actions>
    </Card>
  );
};
```

**Organisms:**
```typescript
// NotificationList, Dashboard, etc.
export const NotificationList: React.FC = () => {
  const notifications = useAppSelector(selectNotifications);

  return (
    <FlatList
      data={notifications}
      renderItem={({ item }) => <NotificationCard notification={item} />}
      keyExtractor={item => item.id}
    />
  );
};
```

**Screens:**
```typescript
// Full page components
export const NotificationListScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);

  return (
    <SafeAreaView>
      <NotificationList />
    </SafeAreaView>
  );
};
```

**Quality Gate:** [ui-designer-quality-gate.md](coordination/review-gates/ui-designer-quality-gate.md)

**Deliverables:**
- [ ] All components implemented
- [ ] Styling with theme
- [ ] Accessibility labels added
- [ ] Props in component contracts

---

#### 4.2 Implement Redux State Management
```typescript
// notificationsSlice.ts
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      });
  }
});
```

**Deliverables:**
- [ ] Redux slice created
- [ ] Selectors defined
- [ ] Thunks for async operations
- [ ] State shape in contracts

---

#### 4.3 Integrate with API
```typescript
// notificationService.ts
export const notificationService = {
  async getNotifications() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
```

**Deliverables:**
- [ ] API integration working
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Optimistic updates implemented

---

#### 4.4 Manual Testing
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on physical devices
- [ ] Test all screen sizes
- [ ] Test dark mode
- [ ] Test accessibility (VoiceOver/TalkBack)

**Deliverables:**
- [ ] Manual testing completed
- [ ] Screenshots captured
- [ ] No visual bugs found

---

#### 4.5 Handoff to QA
- Complete [ui-to-qa-handoff-template.md](coordination/handoff-protocols/ui-to-qa-handoff-template.md)
- Provide test scenarios
- Document known issues
- Share test data

**Deliverables:**
- [ ] Handoff document completed
- [ ] Test scenarios documented
- [ ] QA agent notified

---

## Phase 5: Testing & QA

### Objective
Comprehensive testing of feature.

### Responsible Agent
**QA Agent**

### Steps

#### 5.1 Write Unit Tests
```typescript
describe('NotificationCard', () => {
  it('should render notification correctly', () => {
    const notification = createMockNotification();
    const { getByText } = render(<NotificationCard notification={notification} />);
    expect(getByText(notification.title)).toBeVisible();
  });
});
```

**Deliverables:**
- [ ] Unit tests written (>80% coverage)
- [ ] All tests passing
- [ ] Edge cases covered

---

#### 5.2 Write Integration Tests
```typescript
describe('Notification Integration', () => {
  it('should fetch and display notifications', async () => {
    const { getByTestId } = render(<NotificationListScreen />);
    await waitFor(() => {
      expect(getByTestId('notification-list')).toBeVisible();
    });
  });
});
```

**Deliverables:**
- [ ] Integration tests written (>85% coverage)
- [ ] Redux integration tested
- [ ] API integration tested

---

#### 5.3 Write E2E Tests
```typescript
describe('Notification E2E', () => {
  it('should complete notification flow', async () => {
    await element(by.id('tab-notifications')).tap();
    await expect(element(by.id('notification-list'))).toBeVisible();
    await element(by.id('notification-1')).tap();
    await expect(element(by.id('unread-indicator'))).not.toBeVisible();
  });
});
```

**Deliverables:**
- [ ] E2E tests written
- [ ] Critical flows tested
- [ ] Tests passing on iOS and Android

---

#### 5.4 Perform Manual Testing
Use [qa-agent-quality-gate.md](coordination/review-gates/qa-agent-quality-gate.md)

- [ ] Functional testing
- [ ] Accessibility testing
- [ ] Performance testing
- [ ] Regression testing
- [ ] Cross-platform testing

**Deliverables:**
- [ ] All quality gates passed
- [ ] Bugs filed using [qa-bug-report-template.md](coordination/handoff-protocols/qa-bug-report-template.md)
- [ ] Test report generated

---

#### 5.5 Sign-Off
- [ ] All acceptance criteria met
- [ ] All tests passing
- [ ] No P0/P1 bugs
- [ ] Performance benchmarks met
- [ ] Accessibility requirements met

**Deliverables:**
- [ ] QA sign-off obtained
- [ ] Feature approved for release

---

## Phase 6: Code Review & Merge

### Objective
Peer review and merge to main branch.

### Responsible Agent
**Tech Lead / Senior Developer**

### Steps

#### 6.1 Code Review
Use [code-review-checklist.md](coordination/review-gates/code-review-checklist.md)

Reviewer checks:
- [ ] Code quality
- [ ] TypeScript compliance
- [ ] Test coverage
- [ ] Performance
- [ ] Security
- [ ] Accessibility
- [ ] Documentation

**Deliverables:**
- [ ] Code review completed
- [ ] All comments addressed
- [ ] Approval obtained

---

#### 6.2 Merge to Main
```bash
# Ensure branch is up to date
git checkout main
git pull origin main

# Merge feature branch
git checkout feature/notifications
git rebase main
git push origin feature/notifications

# Create PR and merge
gh pr create --title "Feature: Notification System" --body "..."
gh pr merge --squash
```

**Deliverables:**
- [ ] PR created and reviewed
- [ ] CI/CD pipeline passing
- [ ] Merged to main branch

---

## Phase 7: Deployment

### Objective
Deploy feature to production.

### Responsible Agent
**DevOps / Tech Lead**

### Steps

#### 7.1 Deploy to Staging
```bash
# Deploy backend
git push staging main

# Run migrations
supabase migration up --env staging

# Deploy mobile app to TestFlight/Internal Track
eas build --platform all --profile staging
eas submit --platform all --profile staging
```

**Deliverables:**
- [ ] Deployed to staging
- [ ] Smoke tests passing
- [ ] No critical errors

---

#### 7.2 Staging Validation
- [ ] Feature works in staging
- [ ] Migrations successful
- [ ] API endpoints functional
- [ ] Mobile app loads correctly
- [ ] No errors in logs

**Deliverables:**
- [ ] Staging validation complete
- [ ] Ready for production

---

#### 7.3 Deploy to Production
Use [release-workflow.md](coordination/workflows/release-workflow.md)

```bash
# Tag release
git tag -a v1.2.0 -m "Release v1.2.0: Notification System"
git push origin v1.2.0

# Deploy backend
git push production main

# Run migrations (with backup!)
pg_dump production > backup.sql
supabase migration up --env production

# Deploy mobile app
eas build --platform all --profile production
eas submit --platform all --profile production
```

**Gradual Rollout:**
- [ ] 10% of users (monitor for 24 hours)
- [ ] 50% of users (monitor for 24 hours)
- [ ] 100% of users

**Deliverables:**
- [ ] Deployed to production
- [ ] Monitoring active
- [ ] Rollback plan ready

---

#### 7.4 Post-Deployment Monitoring
Monitor for first 48 hours:
- [ ] Error rates (<1%)
- [ ] API response times (<200ms p95)
- [ ] Crash rates (<0.5%)
- [ ] User feedback
- [ ] Performance metrics

**Deliverables:**
- [ ] Metrics within acceptable range
- [ ] No critical issues
- [ ] Feature stable

---

## Phase 8: Post-Launch

### Objective
Monitor, iterate, and improve.

### Steps

#### 8.1 Gather User Feedback
- Monitor app store reviews
- Track in-app feedback
- Analyze usage analytics
- Monitor support tickets

**Deliverables:**
- [ ] Feedback collected
- [ ] Issues logged
- [ ] Improvement opportunities identified

---

#### 8.2 Measure Success Metrics
Compare against targets in epic:
- [ ] User adoption rate
- [ ] Engagement metrics
- [ ] Performance metrics
- [ ] Business metrics

**Deliverables:**
- [ ] Metrics report generated
- [ ] Success criteria evaluated

---

#### 8.3 Plan Iterations
Based on feedback and metrics:
- [ ] Bug fixes prioritized
- [ ] UX improvements identified
- [ ] New features requested
- [ ] Performance optimizations needed

**Deliverables:**
- [ ] Iteration plan created
- [ ] Backlog updated

---

## Checkpoints & Decision Gates

### Checkpoint 1: Contracts Review
**When:** After Phase 1
**Criteria:** All contracts defined and approved
**Decision:** Proceed to implementation or revise contracts

---

### Checkpoint 2: Database Review
**When:** After Phase 2
**Criteria:** Schema tested, RLS verified, performance benchmarks met
**Decision:** Proceed to backend or fix database issues

---

### Checkpoint 3: API Review
**When:** After Phase 3
**Criteria:** All endpoints functional, tests passing
**Decision:** Proceed to frontend or fix API issues

---

### Checkpoint 4: Frontend Review
**When:** After Phase 4
**Criteria:** Components functional, quality gate passed
**Decision:** Proceed to QA or fix frontend issues

---

### Checkpoint 5: QA Sign-Off
**When:** After Phase 5
**Criteria:** All tests passing, no P0/P1 bugs, acceptance criteria met
**Decision:** Proceed to code review or fix bugs

---

### Checkpoint 6: Production Ready
**When:** After Phase 6
**Criteria:** Code reviewed, merged, CI/CD passing
**Decision:** Proceed to deployment or address review comments

---

## Rollback Procedures

### When to Rollback
- Critical bugs discovered in production
- Performance degradation >25%
- Crash rate >1%
- Data integrity issues
- Security vulnerabilities

### Rollback Steps
```bash
# 1. Revert code deploy
git revert <commit-hash>
git push origin main

# 2. Rollback database migration
supabase migration down --env production

# 3. Deploy previous version
git checkout v1.1.0
git push production main

# 4. Notify team and users
```

---

## Communication Plan

### Daily Standups
- Progress updates
- Blockers identified
- Dependencies coordinated

### Weekly Status Reports
- Completed tasks
- Upcoming tasks
- Risks and issues
- Timeline updates

### Handoff Notifications
- Use handoff templates
- Notify next agent
- Provide all necessary context

### Launch Communication
- Internal announcement
- User communication (release notes, blog post)
- Support team briefing

---

## Example: Notification Feature

**Epic:** Notification System
**Timeline:** 3 weeks
**Agents:** Database, Backend, UI Designer, QA

### Week 1: Foundation
- Database: Created notifications table, RLS policies, indexes
- Backend: Implemented CRUD endpoints, push notification service
- Deliverable: Database and API ready

### Week 2: Frontend
- UI Designer: Built NotificationListScreen, NotificationCard, settings
- UI Designer: Integrated Redux, API, push notifications
- Deliverable: UI functional

### Week 3: Testing & Launch
- QA: Wrote tests, performed manual testing, filed bugs
- UI Designer: Fixed P0/P1 bugs
- Team: Code review, merge, deploy
- Deliverable: Feature live in production

---

## Success Indicators

- [ ] Feature delivered on time
- [ ] All quality gates passed
- [ ] Zero critical bugs in production
- [ ] User adoption >60%
- [ ] Performance targets met
- [ ] Team collaboration smooth
- [ ] Handoffs efficient
- [ ] Documentation complete

---

## Lessons Learned Template

After feature launch, document:
- **What went well?**
- **What didn't go well?**
- **What would we do differently?**
- **Action items for next feature**

---

**Remember:** This workflow is a guideline. Adapt to your feature's specific needs while maintaining quality standards.
