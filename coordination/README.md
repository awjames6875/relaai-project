# Coordination System

> Multi-agent coordination framework for the RelaAI project

## Overview

This directory contains the complete coordination framework for RelaAI's multi-agent development system. It enables three specialized AI agents (UI Designer, Database, and QA) to work independently while maintaining alignment through structured workflows, handoff protocols, and quality gates.

**Key Principle:** Contract-first development where agents work asynchronously using shared specifications as the source of truth.

---

## Table of Contents

- [Directory Structure](#directory-structure)
- [Quick Start Guide](#quick-start-guide)
- [Subdirectories Explained](#subdirectories-explained)
- [When to Use Each Template](#when-to-use-each-template)
- [Coordination Flow Examples](#coordination-flow-examples)
- [Agent Responsibilities](#agent-responsibilities)
- [Best Practices](#best-practices)
- [Template Reference](#template-reference)
- [Common Scenarios](#common-scenarios)

---

## Directory Structure

```
coordination/
├── handoff-protocols/     # Agent-to-agent handoff templates
│   ├── database-to-ui-handoff-template.md
│   ├── database-to-backend-handoff-template.md
│   ├── ui-to-qa-handoff-template.md
│   ├── qa-bug-report-template.md
│   └── agent-task-completion-checklist.md
├── review-gates/          # Quality gate checklists
│   ├── ui-designer-quality-gate.md
│   ├── database-agent-quality-gate.md
│   ├── qa-agent-quality-gate.md
│   ├── code-review-checklist.md
│   └── performance-benchmarks.md
├── task-template/         # Task definition templates
│   ├── feature-task-epic.md
│   ├── component-implementation-task.md
│   ├── database-migration-task.md
│   ├── test-suite-task.md
│   └── bug-fix-task.md
└── workflows/             # End-to-end workflows
    └── feature-development-workflow.md
```

---

## Quick Start Guide

### For New Agents

1. **Read the Overview**
   - Understand the [multi-agent architecture](../CLAUDE.md#multi-agent-coordination-system)
   - Review [agent responsibilities](#agent-responsibilities)
   - Familiarize yourself with [contracts](../contracts/)

2. **Identify Your Role**
   - **UI Designer Agent**: Implements React Native components
   - **Database Agent**: Manages Supabase schema and migrations
   - **QA Agent**: Tests and validates features

3. **Follow the Workflow**
   - Start with [feature-development-workflow.md](workflows/feature-development-workflow.md)
   - Use appropriate task template from `task-template/`
   - Complete quality gate checklist from `review-gates/`
   - Create handoff document from `handoff-protocols/`

4. **Use Templates Correctly**
   - Copy template content (don't modify original)
   - Fill in all sections marked with `[PLACEHOLDER]`
   - Check all checkboxes as you complete items
   - Link to relevant contract files

---

## Subdirectories Explained

### 1. handoff-protocols/

**Purpose:** Formal handoff documents for passing work between agents.

**When to use:** After completing a major milestone that affects another agent's work.

**Templates:**
- **database-to-ui-handoff-template.md** - Database Agent → UI Designer
- **database-to-backend-handoff-template.md** - Database Agent → Backend Agent
- **ui-to-qa-handoff-template.md** - UI Designer → QA Agent
- **qa-bug-report-template.md** - QA Agent → Any Agent (bug reports)
- **agent-task-completion-checklist.md** - General task completion verification

**Key Features:**
- Structured schema change documentation
- Sample data for testing
- Contract update tracking
- Performance considerations
- Security and RLS documentation
- Clear acceptance criteria

**Example Flow:**
```
Database Agent completes migration
    ↓
Creates handoff using database-to-ui-handoff-template.md
    ↓
Provides sample data and schema documentation
    ↓
UI Designer reviews handoff and asks clarifying questions
    ↓
UI Designer accepts handoff and begins implementation
```

---

### 2. review-gates/

**Purpose:** Quality checklists that must be completed before handoffs or merges.

**When to use:** Before completing any major milestone, handoff, or code merge.

**Gates:**
- **ui-designer-quality-gate.md** - 150+ checks for frontend quality
- **database-agent-quality-gate.md** - Database schema and performance checks
- **qa-agent-quality-gate.md** - Testing completeness verification
- **code-review-checklist.md** - Peer review checklist
- **performance-benchmarks.md** - Performance standards

**Key Standards:**
- TypeScript/ESLint compliance
- Test coverage targets (>80%)
- Accessibility requirements (WCAG AA)
- Performance benchmarks (<200ms API, 60 FPS UI)
- Security requirements (RLS policies, input validation)

**Example Usage:**
```typescript
// Before handing off to QA Agent
- [x] Run: npm run typecheck (0 errors)
- [x] Run: npm run lint (0 warnings)
- [x] Run: npm run test:coverage (>80%)
- [x] All accessibility labels added
- [x] Tested on iOS and Android
- [x] Components added to contracts
- [x] Handoff document completed
✓ Ready to hand off
```

---

### 3. task-template/

**Purpose:** Templates for defining and tracking work items.

**When to use:** At the start of any new feature, bug fix, or migration.

**Templates:**
- **feature-task-epic.md** - Large features spanning multiple agents
- **component-implementation-task.md** - Single component development
- **database-migration-task.md** - Database schema changes
- **test-suite-task.md** - Test creation/updates
- **bug-fix-task.md** - Bug fixes with root cause analysis

**Structure:**
Each template includes:
- Clear objective and scope
- Acceptance criteria
- Dependencies and blockers
- Agent assignment
- Timeline estimates
- Success metrics
- Contract references

**Example:**
```markdown
## Task: Implement Notification Card Component

**Agent:** UI Designer
**Type:** Component Implementation
**Priority:** High
**Estimated Effort:** 4 hours

### Acceptance Criteria
- [x] Component renders notification data
- [x] Swipe-to-delete gesture works
- [x] Mark as read interaction works
- [x] Accessibility labels present
- [x] Tests achieve >80% coverage
```

---

### 4. workflows/

**Purpose:** End-to-end workflows spanning multiple agents and phases.

**When to use:** Reference for understanding the complete development lifecycle.

**Current Workflows:**
- **feature-development-workflow.md** - Complete feature development lifecycle (8 phases)

**Workflow Phases:**
1. **Planning & Design** - Define contracts and break down tasks
2. **Database Implementation** - Schema, migrations, RLS policies
3. **Backend Implementation** - API endpoints (when implemented)
4. **Frontend Implementation** - Components, Redux, screens
5. **Testing & QA** - Unit, integration, E2E testing
6. **Code Review & Merge** - Peer review and merge
7. **Deployment** - Staging → Production rollout
8. **Post-Launch** - Monitoring, iteration, feedback

**Key Checkpoints:**
- Contracts review
- Database review
- API review
- Frontend review
- QA sign-off
- Production ready

---

## When to Use Each Template

### Starting New Work

| Situation | Template to Use |
|-----------|----------------|
| Large feature (3+ weeks) | `task-template/feature-task-epic.md` |
| Single React Native component | `task-template/component-implementation-task.md` |
| Database schema change | `task-template/database-migration-task.md` |
| Adding/updating tests | `task-template/test-suite-task.md` |
| Fixing a bug | `task-template/bug-fix-task.md` |

### During Development

| Situation | Template to Use |
|-----------|----------------|
| Ready to hand off work | Appropriate `handoff-protocols/*-handoff-template.md` |
| Before committing code | `review-gates/[agent]-quality-gate.md` |
| Found a bug during testing | `handoff-protocols/qa-bug-report-template.md` |
| Need to verify task completion | `handoff-protocols/agent-task-completion-checklist.md` |

### Before Handoffs

| From → To | Template to Use |
|-----------|----------------|
| Database → UI Designer | `database-to-ui-handoff-template.md` |
| Database → Backend | `database-to-backend-handoff-template.md` |
| UI Designer → QA | `ui-to-qa-handoff-template.md` |
| QA → Any Agent | `qa-bug-report-template.md` |

### Quality Verification

| Agent Role | Quality Gate to Use |
|-----------|-------------------|
| UI Designer | `review-gates/ui-designer-quality-gate.md` |
| Database Agent | `review-gates/database-agent-quality-gate.md` |
| QA Agent | `review-gates/qa-agent-quality-gate.md` |
| Any (peer review) | `review-gates/code-review-checklist.md` |
| Performance check | `review-gates/performance-benchmarks.md` |

---

## Coordination Flow Examples

### Example 1: New Feature Implementation

**Feature:** Add push notifications

**Flow:**
```
1. Tech Lead creates feature-task-epic.md
   └─> Defines contracts in contracts/ directory

2. Database Agent picks up database-migration-task.md
   ├─> Creates notifications table
   ├─> Adds RLS policies
   ├─> Tests migration locally
   └─> Completes database-agent-quality-gate.md
   └─> Creates database-to-ui-handoff-template.md

3. UI Designer picks up component-implementation-task.md
   ├─> Reviews handoff document
   ├─> Implements NotificationCard, NotificationList
   ├─> Integrates Redux state management
   ├─> Tests on iOS and Android
   └─> Completes ui-designer-quality-gate.md
   └─> Creates ui-to-qa-handoff-template.md

4. QA Agent picks up test-suite-task.md
   ├─> Reviews handoff document
   ├─> Writes unit tests
   ├─> Writes integration tests
   ├─> Performs manual testing
   └─> Completes qa-agent-quality-gate.md
   └─> Signs off on feature

5. Code Review & Merge
   ├─> Peer review using code-review-checklist.md
   └─> Merge to main branch

6. Deployment
   └─> Deploy to staging → production
```

### Example 2: Bug Fix Workflow

**Bug:** Contact list not loading on slow networks

**Flow:**
```
1. QA Agent discovers bug during testing
   └─> Creates qa-bug-report-template.md
       ├─> Severity: P1 (high)
       ├─> Steps to reproduce
       ├─> Expected vs actual behavior
       └─> Screenshots/logs attached

2. UI Designer picks up bug-fix-task.md
   ├─> Root cause: Missing loading state
   ├─> Implements fix with loading indicator
   ├─> Adds timeout handling
   └─> Completes ui-designer-quality-gate.md

3. QA Agent verifies fix
   ├─> Tests on slow network (3G, 2G)
   ├─> Confirms loading indicator appears
   └─> Marks bug as resolved

4. Deploy fix to production
```

### Example 3: Database Schema Update

**Change:** Add relationship health tracking

**Flow:**
```
1. Database Agent creates database-migration-task.md
   ├─> Defines relationships table in contracts/database-contracts/
   ├─> Creates migration V008_add_relationships_table.sql
   ├─> Implements RLS policies
   ├─> Adds indexes for performance
   └─> Tests migration locally

2. Database Agent completes quality gate
   ├─> Runs: supabase migration up
   ├─> Verifies RLS policies work
   ├─> Benchmarks query performance (<100ms)
   └─> Completes database-agent-quality-gate.md

3. Database Agent creates handoffs
   ├─> database-to-backend-handoff-template.md (API endpoints needed)
   └─> database-to-ui-handoff-template.md (UI components needed)

4. UI Designer and Backend Agent work in parallel
   ├─> UI: Build RelationshipHealthCard component
   └─> Backend: Implement /relationships endpoints

5. QA Agent tests end-to-end
```

---

## Agent Responsibilities

### UI Designer Agent

**Primary Focus:** React Native frontend implementation

**Workflow:**
1. Receive handoff from Database/Backend Agent
2. Review contracts in `contracts/component-contracts/`
3. Implement components following atomic design
4. Use code templates from `code-templates/react-native-components/`
5. Complete `ui-designer-quality-gate.md` before handoff
6. Create `ui-to-qa-handoff-template.md`

**Key Deliverables:**
- React Native components (TypeScript)
- Redux state management (slices, selectors, thunks)
- Navigation setup
- Accessibility labels
- Unit tests (>80% coverage)
- Updated component contracts

**Quality Standards:**
- TypeScript with zero errors
- ESLint with zero warnings
- All interactive elements have accessibility labels
- Tested on iOS and Android
- 60 FPS performance maintained

---

### Database Agent

**Primary Focus:** Supabase/PostgreSQL schema management

**Workflow:**
1. Receive requirements from feature epic
2. Define schema in `contracts/database-contracts/`
3. Create SQL migrations (up and down)
4. Implement RLS policies
5. Add indexes for performance
6. Complete `database-agent-quality-gate.md`
7. Create handoff to UI/Backend agents

**Key Deliverables:**
- SQL migration files
- RLS policies
- Indexes and functions
- Sample/seed data
- Updated database contracts

**Quality Standards:**
- All tables have primary keys
- Foreign keys properly defined
- RLS enabled on all user tables
- Query performance <100ms (p95)
- Migrations are idempotent and reversible

---

### QA Agent

**Primary Focus:** Testing and quality assurance

**Workflow:**
1. Receive handoff from UI Designer Agent
2. Review test scenarios in handoff document
3. Write unit tests (>80% coverage)
4. Write integration tests
5. Write E2E tests for critical paths
6. Perform manual testing
7. Complete `qa-agent-quality-gate.md`
8. Sign off on feature or file bugs

**Key Deliverables:**
- Unit tests (Jest, React Native Testing Library)
- Integration tests
- E2E tests (Detox)
- Bug reports (if issues found)
- Test coverage report
- QA sign-off document

**Quality Standards:**
- Overall coverage >80%
- Critical paths 100% covered
- All tests pass consistently
- Performance benchmarks met
- Accessibility requirements verified

---

## Best Practices

### 1. Contract-First Development

Always define contracts before implementation:

```markdown
# WRONG: Implement first, contracts later
1. Build component
2. Create API endpoint
3. Oh, they don't match - refactor
4. Finally update contracts

# RIGHT: Contracts first
1. Define component interface in contracts/component-contracts/
2. Define API spec in contracts/api-contracts/
3. Database Agent implements schema
4. UI Designer implements component
5. Everything integrates seamlessly
```

### 2. Complete Quality Gates

Never skip quality gate checklists:

```markdown
# Each quality gate item exists for a reason
- [ ] TypeScript compiles with zero errors
      ↑ Prevents runtime type errors

- [ ] Accessibility labels on all elements
      ↑ Ensures app is usable by everyone

- [ ] Test coverage >80%
      ↑ Prevents regressions
```

### 3. Thorough Handoff Documents

Provide everything the next agent needs:

```markdown
# WRONG: Minimal handoff
"Added notifications table. Check the migration file."

# RIGHT: Complete handoff
- Schema changes documented
- Sample data provided
- Test scenarios listed
- Performance considerations noted
- RLS policies explained
- Components needed specified
- Redux state shape defined
```

### 4. Ask Questions Early

Use the Questions section in handoff templates:

```markdown
## Questions & Clarifications

**UI Designer - Add questions here before starting:**

1. Question: Should notifications auto-delete after 30 days?
   - Answer: Yes, add deleted_at timestamp after 30 days

2. Question: Do we need push notification permissions?
   - Answer: Yes, add to onboarding flow
```

### 5. Track Dependencies

Document blockers and dependencies:

```markdown
## Dependencies & Blockers

### Prerequisites
- [x] User authentication implemented
- [x] Supabase project configured
- [ ] Push notification service set up (BLOCKER)

### Known Issues
- Push notifications don't work on Android emulator (expected)
```

### 6. Update Contracts Promptly

Keep contracts in sync with implementation:

```markdown
# After implementing NotificationCard component:

1. Update contracts/component-contracts/component-interfaces.ts
   └─> Add NotificationCardProps interface

2. Update contracts/component-contracts/redux-types.ts
   └─> Add NotificationsState type

3. Update contracts/data-contracts/dto-definitions.ts
   └─> Ensure Notification DTO matches database
```

### 7. Use Checklists Religiously

Check off items as you complete them:

```markdown
## Pre-Handoff Checklist

- [x] Schema migration tested locally
- [x] RLS policies verified
- [x] Sample data provided
- [x] Performance benchmarks met
- [x] All contracts updated
- [x] Handoff document completed
- [ ] UI Designer notified (TODO: Send Slack message)
```

### 8. Communicate Proactively

Don't wait for others to discover your work:

```markdown
# After completing handoff:
1. Post in #dev-coordination Slack channel
2. Tag the next agent
3. Link to handoff document
4. Mention any urgent items
5. Offer to answer questions
```

---

## Template Reference

### Handoff Protocols

| Template | Purpose | When to Use | Key Sections |
|----------|---------|-------------|--------------|
| [database-to-ui-handoff-template.md](handoff-protocols/database-to-ui-handoff-template.md) | Database → Frontend handoff | After DB migration complete | Schema changes, DTOs, sample data, UI impact |
| [database-to-backend-handoff-template.md](handoff-protocols/database-to-backend-handoff-template.md) | Database → Backend handoff | After DB migration complete | Schema changes, endpoints needed, query patterns |
| [ui-to-qa-handoff-template.md](handoff-protocols/ui-to-qa-handoff-template.md) | Frontend → QA handoff | After components implemented | Components list, test scenarios, known issues |
| [qa-bug-report-template.md](handoff-protocols/qa-bug-report-template.md) | Bug reporting | When bugs found | Reproduction steps, severity, logs, screenshots |
| [agent-task-completion-checklist.md](handoff-protocols/agent-task-completion-checklist.md) | Task completion | Before marking task done | Quality checks, handoff prep, documentation |

### Review Gates

| Template | Agent | When to Use | Key Checks |
|----------|-------|-------------|------------|
| [ui-designer-quality-gate.md](review-gates/ui-designer-quality-gate.md) | UI Designer | Before every handoff/commit | TypeScript, ESLint, accessibility, tests, performance |
| [database-agent-quality-gate.md](review-gates/database-agent-quality-gate.md) | Database | Before migration handoff | Schema valid, RLS enabled, indexes added, performance |
| [qa-agent-quality-gate.md](review-gates/qa-agent-quality-gate.md) | QA | Before sign-off | Test coverage, manual testing, accessibility, performance |
| [code-review-checklist.md](review-gates/code-review-checklist.md) | Any (peer review) | During PR review | Code quality, best practices, security, documentation |
| [performance-benchmarks.md](review-gates/performance-benchmarks.md) | Any | Before release | API latency, UI render speed, database query time |

### Task Templates

| Template | Scope | Typical Duration | Agent |
|----------|-------|------------------|-------|
| [feature-task-epic.md](task-template/feature-task-epic.md) | Large feature | 2-4 weeks | Multiple agents |
| [component-implementation-task.md](task-template/component-implementation-task.md) | Single component | 2-8 hours | UI Designer |
| [database-migration-task.md](task-template/database-migration-task.md) | Schema change | 4-16 hours | Database |
| [test-suite-task.md](task-template/test-suite-task.md) | Test creation | 4-12 hours | QA |
| [bug-fix-task.md](task-template/bug-fix-task.md) | Bug fix | 1-8 hours | Varies |

### Workflows

| Template | Purpose | Phases | Timeline |
|----------|---------|--------|----------|
| [feature-development-workflow.md](workflows/feature-development-workflow.md) | Complete feature lifecycle | 8 phases (Planning → Post-Launch) | 2-4 weeks |

---

## Common Scenarios

### Scenario 1: "I'm starting a new feature"

**Steps:**
1. Review [feature-development-workflow.md](workflows/feature-development-workflow.md)
2. Create `feature-task-epic.md` with requirements
3. Define all contracts in `contracts/` directory
4. Break down into agent-specific tasks
5. Each agent follows their workflow
6. Use handoffs to pass work between agents

**Example:**
```markdown
Feature: Message Scheduling
├─> Define contracts (API, DB, Component)
├─> Database: Create scheduled_messages table
├─> UI Designer: Build ScheduleMessageScreen
├─> QA: Test scheduling functionality
└─> Deploy to production
```

---

### Scenario 2: "I'm ready to hand off my work"

**Steps:**
1. Complete your agent's quality gate checklist
2. Verify all contract files are updated
3. Choose appropriate handoff template
4. Fill in all sections (especially sample data and test scenarios)
5. Notify next agent
6. Be available to answer questions

**Checklist:**
```markdown
Before handoff:
- [ ] Quality gate completed
- [ ] All contracts updated
- [ ] Handoff document completed with all sections
- [ ] Sample data provided
- [ ] Test scenarios documented
- [ ] Known issues listed
- [ ] Next agent notified
```

---

### Scenario 3: "I found a bug"

**Steps:**
1. Use [qa-bug-report-template.md](handoff-protocols/qa-bug-report-template.md)
2. Assign severity (P0=Critical, P1=High, P2=Medium, P3=Low)
3. Document reproduction steps clearly
4. Include logs, screenshots, or screen recordings
5. Tag the responsible agent
6. Link to related code/components

**Example:**
```markdown
## Bug: Contact list crashes on scroll

**Severity:** P1 (High)
**Component:** ContactListScreen.tsx
**Assigned to:** UI Designer Agent

**Steps to Reproduce:**
1. Open app with 100+ contacts
2. Scroll rapidly down the list
3. App crashes after ~50 items

**Root Cause:** FlatList not using keyExtractor
**Fix:** Add keyExtractor={(item) => item.id}
```

---

### Scenario 4: "I'm blocked by another agent"

**Steps:**
1. Document the blocker in your task file
2. Update the Dependencies section
3. Communicate with the blocking agent
4. Work on non-blocked tasks in parallel
5. Re-evaluate when blocker is resolved

**Example:**
```markdown
## Blocker

**Blocked By:** Database Agent
**Reason:** Notifications table not yet created
**Impact:** Cannot implement NotificationList component

**Workaround:** Working on NotificationSettings screen (doesn't need table)

**Resolution:** Database Agent estimated completion: Tomorrow 2pm
```

---

### Scenario 5: "Requirements changed mid-implementation"

**Steps:**
1. Pause current work
2. Update contracts to reflect new requirements
3. Assess impact on existing work
4. Update task acceptance criteria
5. Communicate changes to other agents
6. Resume implementation with new requirements

**Example:**
```markdown
## Requirements Change

**Original:** Notifications expire after 30 days
**New:** Notifications never expire, user must manually delete

**Impact:**
- Database: Remove auto-delete trigger
- UI: Add "Delete All" button
- Contracts: Update Notification interface

**Action Items:**
- [ ] Update database contracts
- [ ] Create new migration for trigger removal
- [ ] Update UI designs
- [ ] Update test scenarios
```

---

## Success Metrics

Track coordination effectiveness:

### Handoff Quality
- [ ] All handoffs include complete documentation
- [ ] Average time from handoff to acceptance: <24 hours
- [ ] Questions asked during handoff: <3 per handoff
- [ ] Rework required after handoff: <10%

### Quality Gates
- [ ] All quality gates completed before handoffs: 100%
- [ ] Quality gate items passed on first attempt: >90%
- [ ] Defects caught before QA handoff: >80%

### Communication
- [ ] Blockers communicated within 1 hour
- [ ] Questions answered within 4 hours
- [ ] Daily progress updates provided
- [ ] All agents aligned on priorities

### Velocity
- [ ] Tasks completed on estimated timeline: >80%
- [ ] Parallel work enabled by good contracts: Yes
- [ ] Rework due to misalignment: <10%

---

## Additional Resources

### Internal Documentation
- [Project Overview (CLAUDE.md)](../CLAUDE.md)
- [Agent Configurations](../agents/)
- [Contracts Directory](../contracts/)
- [Code Templates](../code-templates/)

### External Resources
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Native Best Practices](https://reactnative.dev/docs/performance)
- [Supabase Documentation](https://supabase.com/docs)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Getting Help

### Questions About Coordination
- Review [feature-development-workflow.md](workflows/feature-development-workflow.md)
- Check template examples in handoff protocols
- Ask in #dev-coordination Slack channel

### Questions About Contracts
- Review [contracts/README.md](../contracts/README.md)
- Check existing contract files for examples
- Refer to agent-specific documentation in `agents/`

### Questions About Quality Standards
- Review your agent's quality gate
- Check [performance-benchmarks.md](review-gates/performance-benchmarks.md)
- Refer to [CLAUDE.md](../CLAUDE.md) for overall standards

---

## Contributing

### Improving Templates
If you find a template needs improvement:
1. Document the issue/suggestion
2. Propose changes with rationale
3. Get approval from team lead
4. Update template
5. Notify all agents of changes

### Adding New Templates
New templates should:
- Follow existing template structure
- Include clear instructions
- Provide examples
- Link to related contracts
- Have acceptance criteria

---

**Last Updated:** 2025-11-01
**Maintained By:** Tech Lead
**Version:** 1.0.0
