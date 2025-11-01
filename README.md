# 🤖 RelaAI Multi-Agent Development System

**AI-Powered Relationship Management Platform**

---

## 🎯 Overview

RelaAI is an AI-powered mobile app that helps users maintain meaningful relationships through intelligent message generation, relationship health tracking, and personalized communication assistance.

This repository uses a **multi-agent development system** with three specialized AI agents:
- 🎨 **UI Designer Agent** - Frontend development
- 🧪 **QA Agent** - Testing and quality assurance
- 🗄️ **Database Agent** - Supabase/PostgreSQL management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Supabase CLI: `npm install -g supabase`
- React Native environment (Xcode/Android Studio)

### Setup
```bash
# Clone repository
git clone <your-repo-url>
cd relaai

# Install Supabase
supabase init
supabase start

# Install backend dependencies
cd backend && npm install

# Install mobile dependencies
cd mobile && npm install

# Start development
cd backend && npm run dev      # Terminal 1
cd mobile && npm start         # Terminal 2
```

---

## 📂 Project Structure
```
relaai/
├── agents/                  # AI agent configurations
├── contracts/              # Shared specifications
├── backend/               # Node.js + Express API
├── mobile/                # React Native app
├── database/              # Supabase migrations
└── docs/                  # Documentation
```

---

## 🤖 Agent Responsibilities

### UI Designer Agent
- React Native screens and components
- Design system implementation
- Redux state management
- Navigation setup

### QA Agent
- Unit, integration, and E2E tests
- API contract validation
- Performance testing
- Security testing

### Database Agent
- PostgreSQL schema design
- Supabase RLS policies
- Migrations and seed data
- Query optimization

---

## 📜 Contracts (Source of Truth)

All agents reference these shared specifications:
- **API Contracts** - OpenAPI specs in `contracts/api-contracts/`
- **Database Schema** - SQL in `contracts/database-contracts/`
- **Component Interfaces** - TypeScript in `contracts/component-contracts/`
- **Data DTOs** - TypeScript in `contracts/data-contracts/`

---

## 🔄 Development Workflow

1. **Planning** - Break features into agent tasks
2. **Contract Definition** - Define APIs, schema, components
3. **Parallel Development** - Agents work independently
4. **Handoffs** - Structured documents between agents
5. **Quality Gates** - Automated checks before merge

---

## 📊 Success Metrics

- Test Coverage: >80%
- API Response Time: <200ms (p95)
- Database Queries: <100ms (p95)
- Bug Rate: <2 per 100 LOC
- Accessibility Score: >90

---

## 📚 Documentation

- [Complete System Guide](docs/MULTI_AGENT_SYSTEM.md)
- [Getting Started](docs/GETTING_STARTED.md)
- [Agent Configurations](agents/)
- [API Documentation](contracts/api-contracts/)

---

## 🛠️ Tech Stack

**Backend:** Node.js, Express, Supabase (PostgreSQL)  
**Mobile:** React Native, Redux Toolkit, React Navigation  
**AI:** Anthropic Claude API  
**Testing:** Jest, Detox, Supertest  
**DevOps:** Docker, GitHub Actions

---

## 📞 Support

- Documentation: `docs/`
- Agent Guides: `agents/[agent-name]/agent-config.md`
- Contracts: `contracts/README.md`

---

**Built with ❤️ using multi-agent coordination**