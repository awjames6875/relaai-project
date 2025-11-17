# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**RelaAI MVP** is a streamlined AI-powered relationship manager designed to help users maintain meaningful relationships through intelligent message generation and scheduling.

**Core Concept:**
- Users add contacts and set desired contact frequency (weekly, monthly, etc.)
- AI generates personalized messages (contextual, not templates) using Claude API
- Messages schedule randomly within user availability windows (appears human, not automated)
- App tracks relationship health and nudges users before relationships drift
- Auto-reply suggestions for incoming messages (user approves before sending)

**Development Approach:** Single developer focused MVP. No multi-agent coordination overhead—just pragmatic, focused development with shared contracts in `contracts/` as specifications.

## Tech Stack

- **Mobile:** React Native + Expo SDK 54, TypeScript, Redux Toolkit, React Navigation, Styled Components
- **Backend:** Node.js + Express (planned, not yet in codebase)
- **Database:** Supabase (PostgreSQL) with Row Level Security
- **AI:** Anthropic Claude API (via `@anthropic-ai/sdk`)
- **Testing:** Jest + React Native Testing Library, factories via Faker.js

## Development Commands

### Mobile App (Primary Focus)

```bash
# Install dependencies
cd mobile && npm install

# Start development
npm start                    # Metro bundler
npm run expo:start          # Alternative: Expo CLI

# Run on device/emulator
npm run expo:ios            # iOS simulator
npm run expo:android        # Android emulator
npm run ios                 # Native iOS (requires Xcode)
npm run android             # Native Android (requires Android Studio)

# Code quality
npm run typecheck           # TypeScript type checking
npm run lint                # ESLint check
npm run lint:fix            # Auto-fix linting issues
npm run format              # Prettier formatting
npm run format:check        # Check formatting

# Testing
npm test                    # Run all tests
npm test -- <filename>      # Run specific test file
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
```

### Database (Supabase)

```bash
# Initialize and start local Supabase
supabase init
supabase start

# Migrations
supabase migration new <name>   # Create new migration
supabase migration up           # Apply pending migrations
supabase migration down         # Rollback last migration
supabase migration list         # Show migration status
```

## Project Structure

```
mobile/
├── src/
│   ├── screens/           # Full-page components (auth, messages, contacts)
│   │   ├── auth/          # Login/signup flows
│   │   ├── messages/      # Message viewing and generation
│   │   └── contacts/      # Contact management
│   ├── components/        # Reusable components (atomic design)
│   │   ├── atoms/         # Basic building blocks (Button, Input, etc.)
│   │   ├── molecules/     # Combined atoms (MessageCard, ContactItem)
│   │   └── organisms/     # Complex compositions
│   ├── services/          # API and external service clients
│   │   ├── auth.ts        # Supabase authentication
│   │   ├── contact.ts     # Contact CRUD operations
│   │   ├── message.ts     # Message operations
│   │   ├── profile.ts     # User profile management
│   │   ├── relationship.ts # Relationship tracking
│   │   ├── claudeAI.ts    # Claude API integration
│   │   └── supabase.ts    # Supabase client initialization
│   ├── store/             # Redux state management
│   │   └── slices/        # Redux slices for different domains
│   ├── navigation/        # React Navigation setup
│   ├── theme/             # Design system (colors, spacing, typography, shadows)
│   └── utils/             # Utility functions
├── __tests__/
│   ├── unit/              # Component and utility unit tests
│   ├── integration/       # Integration tests
│   ├── accessibility/     # Accessibility tests
│   ├── test-utils.tsx     # Test helper functions
│   └── factories/         # Test data factories
├── jest.config.js         # Jest configuration
├── tsconfig.json          # TypeScript config
└── package.json

contracts/
├── component-contracts/   # React component interfaces (TypeScript)
├── data-contracts/        # Data DTOs and validation schemas
└── database-contracts/    # Database schema documentation

docs/
├── design-system.md       # Design system specification
└── other documentation
```

## Key Architecture Patterns

### Redux State Management

Redux Toolkit slices handle domain-specific state:
- `auth` - Authentication status and user session
- `contacts` - Contact list and details
- `messages` - Message drafts, scheduled, sent
- `relationships` - Relationship health tracking

**Pattern:**
- Actions dispatched from screens
- Thunks handle async Supabase calls
- Selectors extract derived state
- Components subscribe via `useSelector`

### Design System

**Location:** `mobile/src/theme/`

Consistent styling via theme provider:
- **Colors:** Primary, secondary, neutral, semantic with 10 shades
- **Shadows:** Elevation scale (0-24) for depth
- **Spacing:** 4px-based scale
- **Typography:** 12-variant type scale
- **Breakpoints:** Phone (0-599px), Tablet (600-1023px), Desktop (1024px+)

**Usage:**
```typescript
import styled from 'styled-components/native';
import { applyShadow } from '@/theme';

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  ${({ theme }) => applyShadow(theme.shadows.md)};
  padding: ${({ theme }) => theme.spacing[4]}px;
`;
```

### Services Layer

Each service module handles a specific domain:

- **`auth.ts`** - Supabase Auth (signup, login, logout, session)
- **`contact.ts`** - Contact CRUD with Supabase queries
- **`message.ts`** - Message operations (create, update, fetch, delete)
- **`claudeAI.ts`** - Claude API calls for message generation with streaming
- **`supabase.ts`** - Supabase client initialization and configuration

Services return typed responses matching data contracts in `contracts/data-contracts/`.

### Component Testing

**Test Structure:**
- Unit tests in `mobile/__tests__/unit/` for isolated component logic
- Integration tests in `mobile/__tests__/integration/` for component + store interactions
- Use `test-utils.tsx` for consistent test setup (Redux store, theme, navigation)
- Test factories (`@faker-js/faker`) for generating realistic test data

**Running Tests:**
```bash
npm test NotificationCard.test.tsx    # Single file
npm run test:watch                    # Watch mode
npm run test:coverage                 # Full coverage report
```

## Current Implementation Status

**✅ Complete:**
- Expo SDK 54 setup with modern dependencies
- Design system (colors, shadows, spacing, typography)
- Authentication service (Supabase Auth)
- Redux store structure and slices
- Navigation setup (Tab and Stack navigation)
- AI message generation service with Claude API streaming
- Core services: contacts, messages, profiles, relationships
- Test infrastructure (Jest, factories, test utils)

**⏳ In Progress:**
- Feature screens (some partially implemented)
- Component library expansion
- Test coverage expansion

**Not Yet Started:**
- Backend API (Express)
- Advanced features (rich messages, groups, etc.)

## Common Development Workflows

### Adding a New Feature Screen

1. **Create screen component** in `mobile/src/screens/domain/`
2. **Add Redux slice** if new domain state needed (`mobile/src/store/slices/`)
3. **Create service calls** if needed (`mobile/src/services/`)
4. **Add navigation route** in `mobile/src/navigation/`
5. **Write unit tests** in `mobile/__tests__/unit/`
6. **Write integration tests** if Redux-heavy in `mobile/__tests__/integration/`

### Adding a UI Component

1. **Create component** in appropriate atomic level (`mobile/src/components/atoms/molecules/organisms/`)
2. **Use design system** for all styling (colors, spacing, shadows, typography)
3. **Define TypeScript props** with JSDoc comments
4. **Create unit test** in `mobile/__tests__/unit/`
5. **Update `contracts/component-contracts/`** if part of contract

### Fetching Data from Supabase

1. **Create service method** in appropriate file (`mobile/src/services/contact.ts`, etc.)
2. **Return typed response** matching data contract
3. **Handle errors** gracefully
4. **Dispatch Redux thunk** from screen or container component
5. **Subscribe to state** with `useSelector` in presentational components

### Calling Claude API

Use `claudeAI.ts` service:
```typescript
// Stream-based message generation
const { stream, stop } = await generateMessage({
  userId,
  contactId,
  context: conversationHistory,
  tone: 'friendly',
});

// Handle stream chunks
stream.on('text', (chunk) => setMessage(prev => prev + chunk));
stream.on('end', () => setIsGenerating(false));
```

## TypeScript & Linting Standards

- **TypeScript:** Reduced strictness for MVP (intentional—see recent commits)
- **ESLint:** Active for code quality, configured in `.eslintrc.json`
- **Prettier:** Auto-formatting configured
- **Path Aliases:** `@/` points to `src/`, `@components/`, `@services/`, etc.

**Before committing:**
```bash
npm run typecheck    # Verify types
npm run lint:fix     # Auto-fix issues
npm run format       # Format code
npm test             # Run tests
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `ANTHROPIC_API_KEY` - Anthropic API key for Claude

These are injected at build time and accessible via `process.env` and React Native's config.

## Contract Directory

**Location:** `contracts/`

The `contracts/` directory defines interfaces before implementation:
- **`component-contracts/component-interfaces.ts`** - React component prop types
- **`data-contracts/dto-definitions.ts`** - API response/request DTOs
- **`database-contracts/schema.sql`** - Database schema documentation

Update contracts when changing public APIs, component props, or database schema.

## Performance Notes

- **Target:** 60 FPS on mobile devices, <3s cold launch
- **Key Areas:** Message generation (streaming), contact list rendering (virtualization), image loading
- **Monitoring:** Check DevTools performance profiler in Expo

## Recent Architecture Changes

**Phase 1 (Most Recent):** Streamlined from multi-agent system to single-developer MVP
- Removed coordination system overhead
- Simplified template usage
- Fixed Expo SDK 54 compatibility
- Reduced TypeScript strictness for faster iteration

The old multi-agent coordination system files (in `coordination/` and `code-templates/`) remain in the repo as reference but are not actively used.
