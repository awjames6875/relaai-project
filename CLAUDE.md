# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**RelaAI MVP** is a streamlined AI-powered relationship manager - like "Auto Text: Schedule Messages" app but with AI superpowers.

**Core Concept:**
- Users add contacts and set desired contact frequency (weekly, monthly, etc.)
- AI generates personalized messages (not templates) using conversation context
- Messages schedule randomly within user availability windows (looks human, not automated)
- App tracks relationship health and nudges users before relationships drift
- Auto-reply suggestions for incoming messages (user approves, then sends)

**The 10x Factor:** Messages are AI-contextual, randomly timed (undetectable automation), and proactive relationship tracking - transforming simple scheduling into intelligent relationship management.

**Development Approach:** Single developer focused MVP (no multi-agent coordination overhead). All code is in one codebase using shared `contracts/` directory for specifications.

## Tech Stack

- **Mobile:** React Native + Expo, TypeScript, Redux Toolkit, React Navigation, Styled Components
- **Backend:** Node.js + Express API (not yet implemented in codebase)
- **Database:** Supabase (PostgreSQL 15+) with Row Level Security
- **AI:** Anthropic Claude API for message generation
- **Testing:** Jest, React Native Testing Library, Detox (E2E), Supertest (API)

## Development Commands

### Database Commands
```bash
# Initialize Supabase locally
supabase init
supabase start

# Create new migration
supabase migration new <migration_name>

# Apply migrations
supabase migration up

# Rollback migration
supabase migration down

# View migration status
supabase migration list

# Test RLS policies
npm run test:rls
```

### Mobile App Commands
```bash
# Install dependencies
cd mobile && npm install

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run single test file
npm test NotificationCard.test.tsx

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

### Backend Commands (when implemented)
```bash
cd backend && npm install
npm run dev          # Development server
npm run build        # Production build
npm test            # Run tests
npm run test:api    # API integration tests
```

## Architecture

### Multi-Agent Coordination System

This project uses a specialized multi-agent architecture where independent AI agents handle different layers:

1. **Contract-First Development**: All APIs, database schemas, and component interfaces are defined in `contracts/` before implementation
2. **Parallel Development**: Agents work independently using contracts as the source of truth
3. **Structured Handoffs**: Agents communicate through formal handoff documents in `coordination/handoff-protocols/`
4. **Quality Gates**: Each agent has specific quality checkpoints in `coordination/review-gates/`
5. **Template System**: Comprehensive templates in `code-templates/` and `coordination/` for consistent development

### Directory Structure

```
relaai-project/
├── agents/                      # Agent configuration files
│   ├── ui-designer/            # Frontend agent specs
│   ├── qa-agent/               # Testing agent specs
│   └── database-agent/         # Database agent specs
│
├── contracts/                   # Shared specifications (source of truth)
│   ├── api-contracts/          # OpenAPI specs (YAML)
│   ├── component-contracts/    # React component interfaces (TypeScript)
│   ├── database-contracts/     # Database schema, indexes, functions (SQL)
│   └── data-contracts/         # DTOs, validation schemas (TypeScript)
│
├── coordination/                # Agent coordination system (49 templates)
│   ├── handoff-protocols/      # Inter-agent handoff templates (5 files)
│   ├── review-gates/           # Quality gate checklists (5 files)
│   ├── task-template/          # Task definition templates (5 files)
│   ├── workflows/              # Development workflows (5 files)
│   └── README.md              # Coordination system guide
│
├── code-templates/              # Reusable code templates (27 templates)
│   ├── react-native-components/ # Component templates (5 files)
│   ├── redux/                  # Redux templates (4 files)
│   ├── database/               # SQL migration templates (5 files)
│   ├── testing/                # Test templates (5 files)
│   ├── services/               # Service layer templates (3 files)
│   └── README.md              # Template usage guide
│
├── mobile/                      # React Native application
│   ├── src/
│   │   ├── components/         # Atomic design components
│   │   │   ├── atoms/
│   │   │   ├── molecules/
│   │   │   └── organisms/
│   │   ├── screens/           # Full page components
│   │   ├── store/             # Redux slices, selectors
│   │   ├── services/          # API/Supabase clients
│   │   ├── navigation/        # React Navigation setup
│   │   └── theme/             # Design system
│   └── __tests__/             # Test files
│
└── docs/                        # Documentation
```

### Database Schema

The complete Supabase schema is documented in `contracts/database-contracts/schema.sql` and includes:

**Core Tables:**
- `profiles` - User profiles (extends Supabase Auth)
- `contacts` - User contacts with relationship data
- `messages` - Messages (draft, scheduled, sent) with AI metadata
- `relationships` - Relationship health tracking
- `personal_facts` - AI-extracted facts about contacts
- `message_templates` - Message templates (user + system)

**Key Features:**
- UUIDs for all primary keys
- Row Level Security (RLS) policies on all user tables
- Soft deletes with `deleted_at` timestamps
- Automatic `updated_at` triggers
- Real-time subscriptions enabled on `messages`
- Full-text search on contacts
- JSONB for flexible attributes

### State Management

- **Redux Toolkit** for global state
- Local component state for UI-only concerns
- Normalized state shape (entities stored by ID)
- Selectors for derived state
- Thunks for async operations
- State shape defined in `contracts/component-contracts/redux-types.ts`

### Design System

RelaAI implements an advanced design system with three core principles:

1. **Shadow System** - Two-layer shadows (ambient + directional) for realistic depth
2. **Color Palette** - Primary, secondary, neutral, and semantic colors with 10 shades each
3. **Responsive Design** - Box-based layouts that rearrange, not shrink

**Key Features:**
- **Shadows:** Elevation scale from 0 (none) → 24 (maximum prominence)
- **Colors:** Full palettes with light/dark mode support
- **Typography:** Modular type scale (1.25 ratio) with 12 variants
- **Spacing:** 4px-based spacing scale for consistency
- **Breakpoints:** Phone (0-599px), Tablet (600-1023px), Desktop (1024px+)
- **Accessibility:** WCAG AA compliance, contrast checking, font scaling

**Location:** `mobile/src/theme/`
**Documentation:** `docs/design-system.md` and `mobile/src/theme/README.md`

**Quick Example:**
```typescript
import styled from 'styled-components/native';
import { applyShadow } from '@/theme';

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  ${({ theme }) => applyShadow(theme.shadows.sm)};
  padding: ${({ theme }) => theme.spacing[4]}px;
  border-radius: 12px;
`;
```

### Component Architecture

Follows **Atomic Design** principles:
- **Atoms**: Button, Input, Avatar (in `mobile/src/components/atoms/`)
- **Molecules**: MessageCard, ContactListItem (in `mobile/src/components/molecules/`)
- **Organisms**: MessageList, Dashboard (in `mobile/src/components/organisms/`)
- **Screens**: Complete pages (in `mobile/src/screens/`)

Component interfaces defined in `contracts/component-contracts/component-interfaces.ts`

**All components use the design system:**
- Theme colors via `${({ theme }) => theme.colors.primary[500]}`
- Shadows via `${({ theme }) => applyShadow(theme.shadows.md)}`
- Spacing via `${({ theme }) => theme.spacing[4]}px`
- Typography via `${({ theme }) => theme.typography.body}`

## Working with Templates

### Using Code Templates

**Quick Start:**
1. Navigate to `code-templates/README.md` for full guide
2. Copy relevant template from `code-templates/`
3. Search for `// TODO:` comments
4. Customize for your specific feature
5. Reference contracts in `contracts/` directory

**Example - Creating a new component:**
```bash
# Copy template
cp code-templates/react-native-components/molecule-component-template.tsx \
   mobile/src/components/molecules/NotificationCard.tsx

# Search for TODO comments and customize
# Update contracts/component-contracts/component-interfaces.ts with props
```

**Available Templates:**
- **React Native:** Atoms, molecules, organisms, screens, tests
- **Redux:** Slices, selectors, thunks, integration tests
- **Database:** Migrations (up/down), RLS policies, triggers, seed data
- **Testing:** Unit, integration, E2E, API tests, test factories
- **Services:** API services, Supabase clients, custom hooks

### Using Coordination Templates

**Quick Start:**
1. Navigate to `coordination/README.md` for full guide
2. Select appropriate template for your task
3. Follow step-by-step checklist
4. Complete handoffs between agents

**Available Templates:**
- **Handoff Protocols:** Database→UI, UI→QA, QA→Bug reports, completion checklists
- **Review Gates:** UI Designer, Database, QA quality gates, code review, performance benchmarks
- **Task Templates:** Component implementation, database migration, test suite, epic, bug fix
- **Workflows:** Feature development, schema change, bug fix, release, refactoring

**Example - Starting a new feature:**
1. Read `coordination/workflows/feature-development-workflow.md`
2. Create epic using `coordination/task-template/feature-task-epic.md`
3. Define contracts in `contracts/` first
4. Use code templates from `code-templates/` for implementation
5. Complete handoff documents when passing to next agent

## Agent Responsibilities

### When Working on Frontend (UI Designer Role)

**Implementation:**
- Implement React Native components using TypeScript
- Follow atomic design pattern (atoms → molecules → organisms)
- Place components in appropriate `mobile/src/components/` subdirectories
- Implement screens in `mobile/src/screens/`
- Use Redux Toolkit for state management
- Define component props in `contracts/component-contracts/component-interfaces.ts`

**Templates to Use:**
- `code-templates/react-native-components/` for component structure
- `code-templates/redux/` for state management
- `code-templates/services/` for API integration

**Quality Gate:**
- Review checklist: `coordination/review-gates/ui-designer-quality-gate.md`
- TypeScript compiles with no errors (`npm run typecheck`)
- ESLint passes with no warnings (`npm run lint`)
- All interactive elements have accessibility labels
- Responsive design tested (iPhone SE, iPhone 14 Pro, iPad)
- Unit tests written (>80% coverage)
- Performance: maintain 60 FPS

**Handoff:**
- Complete `coordination/handoff-protocols/ui-to-qa-handoff-template.md` when ready for testing
- Update contracts if component interfaces change

### When Working on Database (Database Agent Role)

**Implementation:**
- Define schema in SQL migrations
- Create idempotent migrations with rollback scripts
- Enable RLS on all user tables with appropriate policies
- Add indexes on foreign keys and query patterns
- Include timestamps (`created_at`, `updated_at`) on all tables
- Use UUIDs for primary keys
- Implement soft deletes where appropriate

**Templates to Use:**
- `code-templates/database/migration-up-template.sql`
- `code-templates/database/migration-down-template.sql`
- `code-templates/database/rls-policy-template.sql`
- `code-templates/database/trigger-function-template.sql`

**Quality Gate:**
- Review checklist: `coordination/review-gates/database-agent-quality-gate.md`
- All tables have primary keys and proper foreign keys
- Query performance <100ms (p95) verified with `EXPLAIN ANALYZE`
- RLS policies tested with multiple users
- Migrations are backward compatible
- Schema documented in `contracts/database-contracts/`

**Handoff:**
- Complete `coordination/handoff-protocols/database-to-ui-handoff-template.md` for frontend
- Complete `coordination/handoff-protocols/database-to-backend-handoff-template.md` for backend

### When Working on Tests (QA Agent Role)

**Implementation:**
- Follow test pyramid: 60% unit, 30% integration, 10% E2E
- Use Arrange-Act-Assert (AAA) pattern
- One assertion per test with descriptive names
- Place unit tests in `mobile/__tests__/unit/`
- Place integration tests in `mobile/__tests__/integration/`
- Place E2E tests in `mobile/__tests__/e2e/`
- Mock external dependencies
- Use factories for test data (Faker.js)

**Templates to Use:**
- `code-templates/testing/component-unit-test-template.test.tsx`
- `code-templates/testing/integration-test-template.test.ts`
- `code-templates/testing/e2e-test-template.e2e.ts`
- `code-templates/testing/test-factory-template.ts`

**Quality Gate:**
- Review checklist: `coordination/review-gates/qa-agent-quality-gate.md`
- Overall coverage >80%
- Critical paths: 100%
- Service layer: >90%
- Components: >80%
- All tests passing (`npm test`)
- Accessibility tests passing
- Performance benchmarks met

**Handoff:**
- File bugs using `coordination/handoff-protocols/qa-bug-report-template.md`
- Provide comprehensive test reports

## Key Development Principles

### Contract-Driven Development
1. **Define contracts first** in `contracts/` directory before implementation
2. Agents implement against contracts independently
3. Contracts serve as the integration point
4. Update contracts before making breaking changes
5. Reference contracts from code templates

**Workflow:**
```
Define Contract → Implement Feature → Update Tests → Review → Merge
       ↓               ↓                   ↓           ↓        ↓
   contracts/    code-templates/    test templates   review   contracts/
                                                     gates
```

### Quality Gates
Each agent has specific quality checkpoints before handoff:
- **UI Designer**: `coordination/review-gates/ui-designer-quality-gate.md`
- **Database Agent**: `coordination/review-gates/database-agent-quality-gate.md`
- **QA Agent**: `coordination/review-gates/qa-agent-quality-gate.md`
- **Code Review**: `coordination/review-gates/code-review-checklist.md`
- **Performance**: `coordination/review-gates/performance-benchmarks.md`

### Handoff Protocol
When completing work that affects other agents:
1. Update relevant contracts in `contracts/`
2. Complete handoff template from `coordination/handoff-protocols/`
3. Document what changed and why
4. Provide sample data or test scenarios
5. Notify dependent agent(s)
6. Reference quality gate checklist

## Success Metrics

**Performance:**
- API Response Time: <200ms (p95)
- Database Queries: <100ms (p95)
- App render: <16ms/frame (60 FPS)
- Cold app launch: <3 seconds
- Screen render: <500ms

**Quality:**
- Test Coverage: >80% overall
- Critical paths: 100%
- Bug Rate: <2 per 100 LOC
- Accessibility Score: >90 (WCAG AA)

**Code Quality:**
- TypeScript with strict mode enabled
- ESLint + Prettier configured
- No `any` types in production code
- All public functions have JSDoc documentation
- `react-hooks/exhaustive-deps` enforced as error

## Common Workflows

### Implementing a New Feature
1. Read `coordination/workflows/feature-development-workflow.md`
2. Define contracts in `contracts/` (API, Database, Component, Data)
3. Database Agent: Create migration using `code-templates/database/`
4. UI Designer: Implement components using `code-templates/react-native-components/`
5. QA Agent: Write tests using `code-templates/testing/`
6. Complete quality gates and handoffs
7. Code review using `coordination/review-gates/code-review-checklist.md`

### Making a Database Change
1. Read `coordination/workflows/schema-change-workflow.md`
2. Create migration using `code-templates/database/migration-up-template.sql`
3. Create rollback using `code-templates/database/migration-down-template.sql`
4. Test locally with `supabase migration up`
5. Complete `coordination/review-gates/database-agent-quality-gate.md`
6. Handoff to dependent agents with appropriate templates

### Fixing a Bug
1. Read `coordination/workflows/bug-fix-workflow.md`
2. Create bug task using `coordination/task-template/bug-fix-task.md`
3. Write regression test first
4. Implement fix
5. Verify quality gates
6. Complete handoff to QA

## Project Status

**Current State:**
- ✅ Multi-agent coordination system complete (49 templates)
- ✅ Contract structure complete (API, Component, Database, Data)
- ✅ Code templates complete (27 templates)
- ✅ Documentation complete (2 comprehensive READMEs)
- ⏳ Mobile app implementation (ready to start with templates)
- ⏳ Backend API implementation (not started)

**Next Steps:**
- Use `feature-development-workflow.md` to implement features
- Use code templates for consistent implementation
- Follow quality gates before handoffs
- Update contracts as features are implemented
