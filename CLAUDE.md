# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RelaAI is an AI-powered relationship management mobile app using a **multi-agent development system** with three specialized agents working in coordination:

- **UI Designer Agent** - React Native frontend development
- **QA Agent** - Testing and quality assurance
- **Database Agent** - Supabase/PostgreSQL database management

The system uses a contract-driven approach where all agents reference shared specifications in `contracts/` to maintain consistency.

## Current Repository State

**IMPORTANT:** This repository currently contains a comprehensive **development framework** but NO application code yet. It includes:

**✅ What Exists (76 files):**
- Complete contract system (22 files) - API specs, component interfaces, database schema, DTOs
- Comprehensive code templates (23 files) - React Native, Redux, Database, Testing, Services
- Multi-agent coordination system (21 files) - Workflows, handoffs, quality gates, task templates
- Agent specifications (3 files) - UI Designer, Database, QA agent configs
- Supabase configuration (`supabase/config.toml`)
- Documentation (CLAUDE.md, README.md, setup guides)

**❌ What Doesn't Exist Yet:**
- `/mobile/` directory - React Native app not initialized
- `/backend/` directory - Node.js API not initialized
- Any actual implementation code (components, services, tests)
- Database migrations (only templates and schema definitions)
- node_modules, built assets, or compiled code

**Status:** Ready to begin development using templates and contracts as guides.

## Tech Stack (Planned)

- **Mobile:** React Native + Expo, TypeScript, Redux Toolkit, React Navigation, Styled Components
- **Backend:** Node.js + Express API
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

**NOTE:** These commands will work after initializing the mobile app (see "Getting Started" section below).

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

## Getting Started

Since the mobile and backend applications are not yet initialized, follow these steps to begin development:

### Step 1: Initialize Mobile App

```bash
# Create React Native app with Expo
npx create-expo-app mobile --template blank-typescript

cd mobile

# Install core dependencies
npm install @reduxjs/toolkit react-redux
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install styled-components
npm install @supabase/supabase-js
npm install zod

# Install dev dependencies
npm install --save-dev @testing-library/react-native @testing-library/jest-native
npm install --save-dev detox detox-cli
npm install --save-dev @types/styled-components @types/styled-components-react-native
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev prettier eslint-config-prettier

# Create directory structure
mkdir -p src/components/atoms
mkdir -p src/components/molecules
mkdir -p src/components/organisms
mkdir -p src/screens
mkdir -p src/store/slices
mkdir -p src/services
mkdir -p src/navigation
mkdir -p src/theme
mkdir -p __tests__/unit
mkdir -p __tests__/integration
mkdir -p __tests__/e2e
```

### Step 2: Initialize Backend API

```bash
# Create Node.js project
mkdir backend
cd backend
npm init -y

# Install core dependencies
npm install express
npm install @supabase/supabase-js
npm install cors helmet dotenv
npm install zod

# Install dev dependencies
npm install --save-dev typescript @types/node @types/express
npm install --save-dev ts-node nodemon
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev prettier eslint-config-prettier

# Initialize TypeScript
npx tsc --init

# Create directory structure
mkdir -p src/routes
mkdir -p src/middleware
mkdir -p src/services
mkdir -p src/types
mkdir -p src/utils
mkdir -p __tests__
```

### Step 3: Deploy Database Schema

```bash
# Initialize Supabase (if not already done)
supabase init

# Create initial migration from schema
supabase migration new initial_schema

# Copy the schema from contracts/database-contracts/schema.sql
# to supabase/migrations/[timestamp]_initial_schema.sql

# Apply migration
supabase db push

# Or if using local development:
supabase start
supabase db reset  # Applies all migrations
```

### Step 4: Start Using Templates

Once initialized, use the code templates for consistent implementation:

1. **Components:** Copy from `code-templates/react-native-components/`
2. **Redux:** Copy from `code-templates/redux/`
3. **Database:** Copy from `code-templates/database/`
4. **Tests:** Copy from `code-templates/testing/`
5. **Services:** Copy from `code-templates/services/`

Refer to `code-templates/README.md` and `coordination/README.md` for detailed guidance.

## Architecture

### Multi-Agent Coordination System

This project uses a specialized multi-agent architecture where independent AI agents handle different layers:

1. **Contract-First Development**: All APIs, database schemas, and component interfaces are defined in `contracts/` before implementation
2. **Parallel Development**: Agents work independently using contracts as the source of truth
3. **Structured Handoffs**: Agents communicate through formal handoff documents in `coordination/handoff-protocols/`
4. **Quality Gates**: Each agent has specific quality checkpoints in `coordination/review-gates/`
5. **Template System**: Comprehensive templates in `code-templates/` and `coordination/` for consistent development

### Directory Structure

**Current Structure (What Exists Now):**

```
relaai-project/
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore configuration
├── CLAUDE.md                    # AI assistant guidelines (this file)
├── README.md                    # Project overview
├── README-SUPABASE-SETUP.md    # Supabase setup guide
├── SETUP-CHECKLIST.md          # Setup validation checklist
│
├── agents/                      # Agent configuration files (3 files)
│   ├── ui-designer/            # Frontend agent specs
│   ├── qa-agent/               # Testing agent specs
│   └── database-agent/         # Database agent specs
│
├── contracts/                   # Shared specifications (22 files) ✅ SOURCE OF TRUTH
│   ├── api-contracts/          # OpenAPI 3.0 specs (6 YAML files)
│   ├── component-contracts/    # React component interfaces (3 TypeScript files)
│   ├── database-contracts/     # Database schema, indexes (2 SQL files)
│   ├── data-contracts/         # DTOs, validation schemas (3 TypeScript files)
│   └── @types/                 # Type definitions (8 files)
│
├── coordination/                # Agent coordination system (21 files)
│   ├── handoff-protocols/      # Inter-agent handoff templates (5 files)
│   ├── review-gates/           # Quality gate checklists (5 files)
│   ├── task-template/          # Task definition templates (5 files)
│   ├── workflows/              # Development workflows (5 files)
│   └── README.md              # Coordination system guide
│
├── code-templates/              # Reusable code templates (23 files)
│   ├── react-native-components/ # Component templates (5 files)
│   ├── redux/                  # Redux templates (4 files)
│   ├── database/               # SQL migration templates (5 files)
│   ├── testing/                # Test templates (5 files)
│   ├── services/               # Service layer templates (3 files)
│   └── README.md              # Template usage guide
│
└── supabase/
    └── config.toml             # Supabase local development config
```

**Planned Structure (After Initialization):**

```
relaai-project/
├── [All existing files above...]
│
├── mobile/                      # React Native application (NOT YET CREATED)
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
│   ├── __tests__/             # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── package.json
│   ├── tsconfig.json
│   └── app.json
│
├── backend/                     # Node.js API (NOT YET CREATED)
│   ├── src/
│   │   ├── routes/            # Express route handlers
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Helper functions
│   ├── __tests__/             # API tests
│   ├── package.json
│   └── tsconfig.json
│
└── supabase/
    ├── config.toml
    └── migrations/             # Database migrations (NOT YET CREATED)
        └── [timestamp]_*.sql
```

### Database Schema

The complete Supabase schema is **designed and documented** in `contracts/database-contracts/schema.sql` (637 lines, ready to deploy).

**Status:** ✅ Fully designed | ❌ Not yet deployed to Supabase

**Core Tables (9 total):**
- `profiles` - User profiles (extends Supabase Auth)
- `contacts` - User contacts with relationship data
- `messages` - Messages (draft, scheduled, sent) with AI metadata
- `relationships` - Relationship health tracking
- `personal_facts` - AI-extracted facts about contacts
- `message_templates` - Message templates (user + system)
- `important_dates` - Birthdays, anniversaries, special occasions
- `message_analytics` - Message delivery and engagement tracking
- `user_settings` - User preferences and app configuration

**Key Features:**
- UUIDs for all primary keys
- Row Level Security (RLS) policies on all user tables
- Soft deletes with `deleted_at` timestamps
- Automatic `updated_at` triggers
- Real-time subscriptions enabled on `messages`
- Full-text search on contacts
- JSONB for flexible attributes

### State Management (Planned)

- **Redux Toolkit** for global state
- Local component state for UI-only concerns
- Normalized state shape (entities stored by ID)
- Selectors for derived state
- Thunks for async operations
- State shape **already defined** in `contracts/component-contracts/redux-types.ts` ✅

### Component Architecture (Planned)

Will follow **Atomic Design** principles:
- **Atoms**: Button, Input, Avatar (will be in `mobile/src/components/atoms/`)
- **Molecules**: MessageCard, ContactListItem (will be in `mobile/src/components/molecules/`)
- **Organisms**: MessageList, Dashboard (will be in `mobile/src/components/organisms/`)
- **Screens**: Complete pages (will be in `mobile/src/screens/`)

Component interfaces **already defined** in `contracts/component-contracts/component-interfaces.ts` ✅

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

**Prerequisites:** Mobile app must be initialized first (see "Getting Started" section)

**Implementation:**
- Implement React Native components using TypeScript
- Follow atomic design pattern (atoms → molecules → organisms)
- Place components in appropriate `mobile/src/components/` subdirectories
- Implement screens in `mobile/src/screens/`
- Use Redux Toolkit for state management
- Define component props in `contracts/component-contracts/component-interfaces.ts` (already exists)

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

**Prerequisites:** Mobile/backend apps must be initialized first (see "Getting Started" section)

**Implementation:**
- Follow test pyramid: 60% unit, 30% integration, 10% E2E
- Use Arrange-Act-Assert (AAA) pattern
- One assertion per test with descriptive names
- Place unit tests in `mobile/__tests__/unit/` or `backend/__tests__/`
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

**✅ Completed (Framework Ready):**
- Multi-agent coordination system (21 workflow/template files)
- Contract structure (22 files covering API, Components, Database, Data)
- Code templates (23 reusable templates)
- Documentation (CLAUDE.md, 2 comprehensive READMEs, setup guides)
- Agent specifications (3 agent config files)
- Database schema design (9 tables, RLS policies, indexes, triggers, functions)
- Supabase configuration (config.toml)

**❌ Not Yet Started (Requires Initialization):**
- Mobile app (`/mobile/` directory does not exist)
- Backend API (`/backend/` directory does not exist)
- Database migrations (no versioned migration files)
- Any implementation code (components, services, tests)
- node_modules or built assets

**Next Steps to Begin Development:**

1. **Initialize applications** (see "Getting Started" section):
   - Create mobile app with Expo
   - Create backend API with Node.js/Express
   - Deploy database schema to Supabase

2. **Start implementing features:**
   - Use `coordination/workflows/feature-development-workflow.md` as guide
   - Use code templates from `code-templates/` for consistent implementation
   - Reference contracts in `contracts/` as source of truth
   - Follow quality gates in `coordination/review-gates/` before handoffs

3. **Maintain contract-driven approach:**
   - Update contracts before making breaking changes
   - Complete handoff documents when passing work between agents
   - Keep documentation synchronized with implementation
