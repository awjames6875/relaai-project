# ✅ RelaAI Project Setup Checklist

Follow these steps to get your RelaAI multi-agent development system up and running.

---

## 🔧 Basic Configuration ✅

- [x] Cursor IDE installed
- [x] Supabase MCP server configured (`.cursor/mcp.json`)
- [x] Environment template created (`.env.example`)
- [x] Git ignore configured (`.gitignore`)
- [x] Database schema ready (`contracts/database-contracts/schema.sql`)

---

## 🗄️ Supabase Setup

- [ ] Create Supabase account at [supabase.com](https://supabase.com)
- [ ] Create new project named `relaai`
- [ ] Copy Project Reference from Settings > General
- [ ] Note your Region (e.g., `us-east-1`)
- [ ] Run `contracts/database-contracts/schema.sql` in SQL Editor
- [ ] Verify all 9 tables are created in Table Editor
- [ ] Enable Email Auth in Authentication settings
- [ ] Restart Cursor to load MCP configuration
- [ ] Authenticate MCP when prompted in browser

---

## 📱 Mobile App Setup (React Native)

- [ ] Install Node.js 20+
- [ ] Create `mobile/` directory
- [ ] Initialize React Native project
- [ ] Install dependencies:
  - React Native
  - React Navigation
  - Redux Toolkit
  - Supabase JS Client
  - React Native Testing Library
- [ ] Configure environment variables
- [ ] Set up Supabase Auth integration
- [ ] Create navigation structure

---

## 🖥️ Backend Setup (Node.js/Express)

- [ ] Create `backend/` directory
- [ ] Initialize Node.js project
- [ ] Install dependencies:
  - Express
  - Supabase JS Client
  - JWT tokens
  - Dotenv
  - CORS
- [ ] Configure environment variables
- [ ] Set up database connection
- [ ] Create API routes based on contracts
- [ ] Implement authentication middleware
- [ ] Add rate limiting

---

## 🧪 Testing Setup

- [ ] Install testing frameworks:
  - Jest
  - React Native Testing Library
  - Detox (for E2E tests)
  - Supertest (for API tests)
- [ ] Configure test environment
- [ ] Create test database
- [ ] Write first unit test
- [ ] Set up CI/CD pipeline

---

## 🔐 Security Setup

- [ ] Copy `.env.example` to `.env`
- [ ] Fill in all environment variables
- [ ] Add `.env` to `.gitignore` (already done)
- [ ] Generate JWT secret
- [ ] Configure CORS properly
- [ ] Set up Supabase RLS policies (already in schema)
- [ ] Enable HTTPS
- [ ] Set up API rate limiting

---

## 📝 Development Tools

- [ ] Install ESLint
- [ ] Install Prettier
- [ ] Configure TypeScript
- [ ] Set up pre-commit hooks
- [ ] Install debugging tools
- [ ] Set up logging (Winston/Pino)

---

## ✅ Validation Checklist

After completing setup, verify:

### Database
- [ ] Can connect to Supabase
- [ ] All 9 tables exist
- [ ] RLS policies are enabled
- [ ] Indexes are created
- [ ] Triggers are working

### Backend
- [ ] Server starts without errors
- [ ] Can connect to database
- [ ] Auth endpoints respond correctly
- [ ] API returns expected data
- [ ] Middleware works properly

### Mobile
- [ ] App builds successfully
- [ ] Navigation works
- [ ] Redux store configured
- [ ] Can login/logout
- [ ] Can fetch data from API
- [ ] UI renders correctly

### Tests
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Coverage > 80%
- [ ] No linter errors

---

## 🚀 First Launch

1. Start Supabase locally (if using local dev)
2. Start backend server: `npm run dev`
3. Start mobile app: `npm start`
4. Run tests: `npm test`
5. Check all services are running
6. Test login flow
7. Verify data sync

---

## 📚 Documentation

- [x] README.md created
- [x] CLAUDE.md for AI instructions
- [x] README-SUPABASE-SETUP.md guide
- [x] Contract documentation in `contracts/`
- [ ] API documentation
- [ ] Deployment guide
- [ ] Contributing guidelines

---

## 🆘 Need Help?

- Check `README-SUPABASE-SETUP.md` for database setup
- Review `CLAUDE.md` for AI agent guidelines
- See `contracts/README.md` for contract specifications
- Check agent configs in `agents/` directory
- Review coordination docs in `coordination/`

---

**Status**: Ready for Supabase project creation! 🎉

