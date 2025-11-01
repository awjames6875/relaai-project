# Agent Task Completion Checklist

This checklist ensures that all agents complete their tasks to the required quality standards before handing off to the next agent in the development workflow.

---

## General Completion Requirements

**All agents must complete these items regardless of task type:**

### Code Quality
- [ ] Code compiles/runs with no errors
- [ ] All linter warnings resolved (ESLint, TSLint, etc.)
- [ ] Code formatted with Prettier/auto-formatter
- [ ] No `any` types in TypeScript code (strict mode)
- [ ] All functions have TypeScript type signatures
- [ ] No commented-out code blocks (unless with explanation)
- [ ] No console.log statements in production code
- [ ] No hardcoded values that should be configuration
- [ ] Code follows DRY principle (no duplication)
- [ ] Magic numbers replaced with named constants

### Documentation
- [ ] Public functions have JSDoc comments
- [ ] Complex logic has inline comments explaining "why"
- [ ] README updated if new setup/configuration required
- [ ] API endpoints documented in contract files
- [ ] Breaking changes clearly documented
- [ ] Migration guide provided if backwards incompatible

### Testing
- [ ] Unit tests written for new code
- [ ] All tests pass locally
- [ ] Test coverage meets minimum thresholds (>80%)
- [ ] Edge cases covered in tests
- [ ] Error cases covered in tests
- [ ] Integration tests added if applicable
- [ ] Manual testing completed

### Contracts
- [ ] All relevant contract files updated
- [ ] Contract changes reviewed for breaking changes
- [ ] DTOs updated to match schema changes
- [ ] API contracts match implementation
- [ ] Component contracts match component props

### Version Control
- [ ] Code committed with meaningful commit messages
- [ ] Branch named descriptively (feature/*, bugfix/*, etc.)
- [ ] No merge conflicts
- [ ] No uncommitted changes
- [ ] .gitignore updated if needed
- [ ] No sensitive data in commits (API keys, passwords, etc.)

### Handoff Documentation
- [ ] Appropriate handoff template completed
- [ ] Test scenarios documented
- [ ] Known issues/limitations documented
- [ ] Dependencies clearly stated
- [ ] Blockers identified
- [ ] Next steps outlined

---

## UI Designer Agent Checklist

**Complete this section when implementing React Native components:**

### Component Implementation
- [ ] Component follows atomic design pattern (Atom/Molecule/Organism)
- [ ] Component placed in correct directory structure
- [ ] Props interface defined in [component-interfaces.ts](contracts/component-contracts/component-interfaces.ts)
- [ ] Component is properly typed (no `any` props)
- [ ] Default props provided where applicable
- [ ] Component is memoized if appropriate (React.memo)
- [ ] Hooks follow Rules of Hooks

### Styling
- [ ] Uses theme from [theme-contract.ts](contracts/component-contracts/theme-contract.ts)
- [ ] No hardcoded colors (use theme.colors.*)
- [ ] No hardcoded spacing (use theme.spacing.*)
- [ ] No hardcoded font sizes (use theme.typography.*)
- [ ] Responsive design tested on multiple screen sizes
- [ ] Dark mode support implemented (if applicable)
- [ ] Platform-specific styles handled (iOS vs Android)

### Accessibility
- [ ] All interactive elements have accessibilityLabel
- [ ] Accessibility roles assigned correctly
- [ ] Screen reader tested (VoiceOver/TalkBack)
- [ ] Color contrast ratio ≥4.5:1 for text
- [ ] Tap targets ≥44x44 points
- [ ] Keyboard navigation works (if web)
- [ ] Dynamic Type supported (iOS)
- [ ] TalkBack supported (Android)

### State Management
- [ ] Redux slice created if needed
- [ ] Redux state shape defined in [redux-types.ts](contracts/component-contracts/redux-types.ts)
- [ ] Selectors created for derived state
- [ ] Async actions use Redux Toolkit createAsyncThunk
- [ ] No business logic in components (belongs in thunks/selectors)
- [ ] State normalized (no nested arrays of objects)

### Navigation
- [ ] Navigation types updated in [navigation-types.ts](contracts/component-contracts/navigation-types.ts)
- [ ] Screen registered in navigator
- [ ] Deep linking configured if needed
- [ ] Navigation params properly typed

### Performance
- [ ] FlatList used for long lists (not ScrollView)
- [ ] Images optimized and lazy-loaded
- [ ] Heavy computations memoized (useMemo)
- [ ] Callbacks memoized (useCallback)
- [ ] No performance warnings in dev tools
- [ ] 60 FPS maintained during animations
- [ ] Bundle size impact assessed (<500KB increase)

### Testing
- [ ] Component unit tests written
- [ ] Snapshot tests created (if applicable)
- [ ] Interaction tests added (user events)
- [ ] Accessibility tests added
- [ ] Redux integration tested
- [ ] Navigation tests added

### Handoff to QA
- [ ] [ui-to-qa-handoff-template.md](coordination/handoff-protocols/ui-to-qa-handoff-template.md) completed
- [ ] Screenshots/recordings provided
- [ ] Test scenarios documented
- [ ] Known issues listed

---

## Database Agent Checklist

**Complete this section when modifying database schema:**

### Schema Design
- [ ] Tables follow naming conventions (snake_case)
- [ ] All tables have primary keys (UUID recommended)
- [ ] Foreign keys defined with proper constraints
- [ ] Indexes added for foreign keys
- [ ] Timestamps added (created_at, updated_at)
- [ ] Soft delete column added if applicable (deleted_at)
- [ ] Schema normalized (3NF minimum)
- [ ] Data types appropriate for data being stored
- [ ] Column constraints defined (NOT NULL, CHECK, etc.)

### Migrations
- [ ] Migration file follows naming convention (V###_description.sql)
- [ ] Migration is idempotent (can run multiple times safely)
- [ ] Rollback script provided (down migration)
- [ ] Migration tested on local database
- [ ] Migration tested on copy of production data
- [ ] No data loss in migration
- [ ] Migration completes in reasonable time (<5 min)
- [ ] Backwards compatible if possible

### Row Level Security (RLS)
- [ ] RLS enabled on all user-scoped tables
- [ ] RLS policies created for SELECT, INSERT, UPDATE, DELETE
- [ ] Policies tested with multiple users
- [ ] Policies verified to prevent unauthorized access
- [ ] Policy performance tested (<5ms overhead)
- [ ] No RLS bypass paths identified

### Indexes
- [ ] Indexes added for foreign keys
- [ ] Indexes added for common query patterns
- [ ] Composite indexes for multi-column queries
- [ ] EXPLAIN ANALYZE run on key queries
- [ ] Index selectivity verified (unique values / total rows)
- [ ] No unnecessary indexes (storage overhead)
- [ ] GIN/GiST indexes for full-text search if needed

### Functions & Triggers
- [ ] Functions follow naming conventions
- [ ] Functions have clear purpose and documentation
- [ ] Triggers only used when necessary (prefer application logic)
- [ ] Trigger performance tested
- [ ] Functions return appropriate types
- [ ] Error handling in functions

### Performance
- [ ] Query performance <100ms (p95)
- [ ] No N+1 query patterns
- [ ] Pagination strategy defined
- [ ] Connection pooling configured
- [ ] Slow query log reviewed

### Contracts
- [ ] [schema.sql](contracts/database-contracts/schema.sql) updated
- [ ] [indexes.sql](contracts/database-contracts/indexes.sql) updated
- [ ] [functions.sql](contracts/database-contracts/functions.sql) updated
- [ ] [triggers.sql](contracts/database-contracts/triggers.sql) updated
- [ ] [dto-definitions.ts](contracts/data-contracts/dto-definitions.ts) updated

### Documentation
- [ ] ERD diagram updated
- [ ] Migration notes written
- [ ] Sample queries documented
- [ ] Data dictionary updated (if applicable)

### Handoff
- [ ] [database-to-ui-handoff-template.md](coordination/handoff-protocols/database-to-ui-handoff-template.md) completed (if UI changes)
- [ ] [database-to-backend-handoff-template.md](coordination/handoff-protocols/database-to-backend-handoff-template.md) completed (if backend changes)
- [ ] Sample data provided
- [ ] Test scenarios documented

---

## QA Agent Checklist

**Complete this section when testing features:**

### Test Coverage
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests written (>85% for critical paths)
- [ ] E2E tests written (major user flows)
- [ ] All tests pass locally
- [ ] All tests pass in CI/CD pipeline
- [ ] Test data factories created
- [ ] Mock data realistic

### Test Quality
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] One assertion per test (or logically grouped)
- [ ] Test names describe what is being tested
- [ ] Tests are deterministic (no flaky tests)
- [ ] Tests clean up after themselves
- [ ] No hardcoded waits (use waitFor, etc.)
- [ ] External dependencies mocked properly

### Functional Testing
- [ ] Happy path tested
- [ ] Error cases tested
- [ ] Edge cases tested
- [ ] Boundary conditions tested
- [ ] Empty states tested
- [ ] Loading states tested
- [ ] Error states tested

### Non-Functional Testing
- [ ] Performance tested (meets benchmarks)
- [ ] Accessibility tested (screen reader, keyboard nav)
- [ ] Responsive design tested (multiple devices)
- [ ] Cross-browser tested (if web)
- [ ] Cross-platform tested (iOS/Android)
- [ ] Network conditions tested (offline, slow 3G)
- [ ] Security tested (no XSS, SQL injection, etc.)

### Regression Testing
- [ ] Existing features still work
- [ ] No new console errors/warnings
- [ ] No performance degradation
- [ ] No visual regressions
- [ ] No accessibility regressions

### Bug Reporting
- [ ] Bugs documented using [qa-bug-report-template.md](coordination/handoff-protocols/qa-bug-report-template.md)
- [ ] Severity/priority assigned correctly
- [ ] Steps to reproduce clear and concise
- [ ] Screenshots/recordings attached
- [ ] Suggested fixes provided when possible

### Test Documentation
- [ ] Test plan document created
- [ ] Test scenarios documented
- [ ] Test data documented
- [ ] Coverage report generated
- [ ] Known issues documented

### Sign-Off
- [ ] All acceptance criteria met
- [ ] All critical bugs fixed
- [ ] Performance benchmarks met
- [ ] Accessibility requirements met
- [ ] Ready for release

---

## Backend Agent Checklist

**Complete this section when implementing API endpoints:**

### API Implementation
- [ ] Endpoints match API contracts exactly
- [ ] Request validation implemented (Zod schemas)
- [ ] Response format matches DTO definitions
- [ ] Error handling implemented
- [ ] HTTP status codes used correctly
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Authentication required where needed

### Database Integration
- [ ] Supabase client configured correctly
- [ ] RLS policies respected (no bypassing)
- [ ] Queries parameterized (no SQL injection)
- [ ] Transactions used for multi-step operations
- [ ] Connection pooling configured
- [ ] Query performance optimized

### Security
- [ ] Input validation on all endpoints
- [ ] Output sanitization (no XSS)
- [ ] Authentication tokens verified
- [ ] Authorization checks implemented
- [ ] Sensitive data not logged
- [ ] API keys stored securely (environment variables)
- [ ] HTTPS enforced

### Error Handling
- [ ] All errors caught and handled
- [ ] Error responses follow error-types contract
- [ ] Stack traces not exposed in production
- [ ] Validation errors provide helpful messages
- [ ] 4xx errors for client issues
- [ ] 5xx errors for server issues

### Testing
- [ ] Unit tests for service layer (>90% coverage)
- [ ] Integration tests for API endpoints (>85% coverage)
- [ ] API tests use Supertest
- [ ] Mocked external dependencies
- [ ] Test different user roles
- [ ] Test error conditions

### Documentation
- [ ] API endpoints documented in OpenAPI/Swagger
- [ ] Environment variables documented
- [ ] Setup instructions in README
- [ ] Deployment guide written

### Performance
- [ ] Response times <200ms (p95)
- [ ] Database queries <100ms (p95)
- [ ] Caching implemented where appropriate
- [ ] Pagination implemented for lists
- [ ] No N+1 query problems

---

## Final Review

**Before marking task as COMPLETE:**

- [ ] All relevant checklists above completed
- [ ] Handoff document completed and reviewed
- [ ] Next agent notified
- [ ] Task status updated in project management tool
- [ ] Code merged to development branch (if applicable)
- [ ] CI/CD pipeline passing

---

## Handoff Approval

**Next Agent Acknowledgment:**

- Agent Name: _______________
- Date Reviewed: _______________
- Questions/Concerns: _______________
- **Status:** [ ] Approved / [ ] Needs Clarification / [ ] Rejected

---

**Remember:** Quality over speed. Taking time to complete these checklists prevents bugs and rework downstream.
