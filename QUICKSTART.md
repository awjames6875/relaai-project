# RelaAI - Quick Start Guide

**RelaAI** is an AI-powered relationship manager that automates keeping in touch with friends and family.

**Vision:** Like "Auto Text" app but with AI superpowers - messages are AI-generated, contextually relevant, randomly timed (looks natural), with relationship health tracking.

## What It Does

1. **AI generates messages** (contextual, not templates)
2. **Schedules randomly** within your availability window (so it looks human)
3. **Remembers conversations** using past SMS context
4. **Nudges proactively** when relationships need attention
5. **Auto-replies** with AI suggestions (you approve first)

## Tech Stack

- React Native + Expo 54
- Redux Toolkit
- Supabase + PostgreSQL
- Anthropic Claude API
- Styled Components (custom design system)

## Getting Started

```bash
cd mobile
npm install --legacy-peer-deps
npm run expo:start
# Press 'i' for iOS or 'a' for Android
```

## MVP Epics

1. **Epic 2:** Contact Management
2. **Epic 3:** AI Message Generation  
3. **Epic 4:** Smart Scheduling (randomized)
4. **Epic 5:** Personal Facts Database
5. **Epic 6:** Relationship Health Tracking
6. **Epic 7:** Auto-Reply System

## Commands

```bash
npm run expo:start      # Dev server
npm run typecheck       # Type check
npm run test            # Run tests
npm run format          # Format code
```

## Next Steps

1. Run the app
2. Build contact management
3. Build AI message generation
4. Implement smart scheduling

See `CLAUDE.md` for full architecture details.
