# 📜 Contracts - Source of Truth

This directory contains all shared specifications that agents reference during development.

---

## 📂 Contract Types

### 1. API Contracts (`api-contracts/`)
**Format:** OpenAPI 3.0 (YAML)  
**Purpose:** Define all REST API endpoints

**Includes:**
- Endpoint paths and methods
- Request/response schemas
- Authentication requirements
- Error responses
- Example requests/responses

**Used By:**
- UI Designer: API calls from React Native
- Backend Team: Implementation guide
- QA Agent: Integration test validation

---

### 2. Database Contracts (`database-contracts/`)
**Format:** SQL + Markdown  
**Purpose:** Define complete database schema

**Includes:**
- Table definitions
- Column specifications
- Relationships (foreign keys)
- Constraints and indexes
- RLS policies (Supabase)
- Triggers and functions

**Used By:**
- Database Agent: Implementation
- Backend Team: Data models and queries
- UI Designer: Understanding data structure
- QA Agent: Test data creation

---

### 3. Component Contracts (`component-contracts/`)
**Format:** TypeScript interfaces  
**Purpose:** Define React Native component APIs

**Includes:**
- Component prop interfaces
- Event handler signatures
- State shape definitions
- Redux action/reducer types

**Used By:**
- UI Designer: Component implementation
- QA Agent: Type-safe testing
- Backend Team: Understanding UI data needs

---

### 4. Data Contracts (`data-contracts/`)
**Format:** TypeScript DTOs  
**Purpose:** Define data transfer objects

**Includes:**
- Request DTOs
- Response DTOs
- Validation rules
- Error formats

**Used By:**
- All agents: Shared data structures
- Type safety across frontend/backend

---

## 🔄 Contract Updates

### When to Update

1. **Before Implementation** - Define contracts first
2. **During Breaking Changes** - Update contracts, then code
3. **After Refactoring** - Ensure contracts reflect reality

### Update Process

1. **Propose Change** - Create draft contract update
2. **Review** - All affected agents review
3. **Approve** - Requires consensus
4. **Update** - Modify contract files
5. **Notify** - Alert all agents of changes
6. **Implement** - Agents update their code

---

## ✅ Best Practices

1. **Contracts First** - Define before coding
2. **Single Source of Truth** - Don't duplicate specs
3. **Keep Updated** - Contracts must match reality
4. **Clear Documentation** - Every field documented
5. **Examples** - Include request/response examples
6. **Validation** - Automate contract validation

---

## 🔍 Validation

### API Contracts
```bash
npm run validate:api-contracts
```

### TypeScript Contracts
```bash
npm run validate:types
```

### Database Contracts
```bash
npm run validate:db-schema
```

---

**Remember:** Contracts are the foundation of multi-agent coordination!
