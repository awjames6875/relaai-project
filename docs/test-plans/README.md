# Epic 2 Contact Management - Testing Documentation

Complete testing resources for Epic 2 Contact Management feature.

---

## Quick Start 🚀

**New to testing?** Start here:
👉 **[QUICK-START-TESTING.md](./QUICK-START-TESTING.md)** - Get testing in 5 minutes

---

## Testing Documents

### 1. Smoke Test Checklist ⚡
**File:** `epic2-smoke-test-checklist.md`  
**Time:** 30 minutes  
**Purpose:** Critical path validation before full testing

**Use this when:**
- App first launches
- After major updates
- Before full test execution

---

### 2. Full Test Plan 📋
**File:** `epic2-manual-test-plan.md`  
**Time:** 4-6 hours  
**Purpose:** Comprehensive testing of all 6 user stories

**Covers:**
- US-2.1: Add Contact (5 tests)
- US-2.2: View Contact List (5 tests)
- US-2.3: Search Contacts (5 tests)
- US-2.4: Edit Contact (4 tests)
- US-2.5: Delete Contact (4 tests)
- US-2.6: View Contact Details (4 tests)

**Total:** 27+ test cases with acceptance criteria

---

### 3. Bug Report Template 🐛
**File:** `bug-report-template.md`  
**Purpose:** Standardized bug reporting

**Includes:**
- Severity and priority definitions
- Step-by-step reproduction
- Environment details
- Examples of good bug reports

**Use this for:** Every bug found during testing

---

### 4. Test Results Tracker 📊
**File:** `test-results-tracker.md`  
**Purpose:** Track all test execution results

**Features:**
- Test execution summary
- Results by user story
- Bug summary tables
- Performance observations
- Final sign-off

**Use this to:** Track progress and calculate pass rates

---

## Test Data Setup

### Seed Scripts Location
**Directory:** `scripts/`

### Files:
- `seed-test-contacts.sql` - SQL script (recommended)
- `seed-test-contacts.ts` - TypeScript script
- `README-TEST-DATA.md` - Setup instructions

### Creates:
- 10 test contacts with various data types
- Different relationship types
- Edge cases (special chars, unicode, long names)

**See:** `scripts/README-TEST-DATA.md` for details

---

## Testing Workflow

### Phase 1: Setup (10 minutes)
1. Launch app using `run-android.ps1`
2. Create/login to test account
3. Seed test data (SQL script)

### Phase 2: Smoke Test (30 minutes)
1. Run smoke test checklist
2. Document all results
3. Fix critical blockers if any

### Phase 3: Full Testing (4-6 hours)
1. Execute full test plan
2. Create bug reports for all issues
3. Track results in tracker document

### Phase 4: Retest (2-4 hours)
1. After bugs are fixed
2. Retest failed cases
3. Update test tracker
4. Final sign-off

---

## Test Coverage

### User Stories Covered:
- ✅ US-2.1: Add Contact
- ✅ US-2.2: View Contact List
- ✅ US-2.3: Search Contacts
- ✅ US-2.4: Edit Contact
- ✅ US-2.5: Delete Contact
- ✅ US-2.6: View Contact Details

### Test Types:
- ✅ Happy path testing
- ✅ Validation testing
- ✅ Error handling
- ✅ Edge cases
- ✅ Performance testing
- ✅ Accessibility testing
- ✅ Integration testing

---

## Acceptance Criteria Reference

All acceptance criteria are documented in:
- `docs/PRD.md` - Section 8.2 (Epic 2 User Stories)
- `docs/test-plans/epic2-manual-test-plan.md` - Each test case

**Key Performance Targets:**
- Contact save: <500ms
- List load: <1 second
- Search results: <300ms
- Scroll: 60 FPS

---

## Bug Triage Guidelines

### Critical (P0) - Fix Immediately
- App crashes
- Data loss
- Security issues
- Core functionality broken

### High (P1) - Fix This Sprint
- Major feature broken
- No workaround available
- Affects many users

### Medium (P2) - Fix Next Sprint
- Feature partially works
- Workaround available
- Affects some users

### Low (P3) - Backlog
- Cosmetic issues
- Minor UX problems
- Edge cases

---

## Resources

### Project Documentation:
- `PROJECT-STATUS.md` - Current project status
- `docs/PRD.md` - Product requirements
- `CLAUDE.md` - Architecture guide

### Code Documentation:
- `coordination/handoff-protocols/epic2-contacts-ui-handoff.md` - UI implementation details
- `mobile/src/services/contact.ts` - Contact service API
- `mobile/src/store/slices/contactSlice.ts` - Redux state management

---

## Getting Help

### Common Issues:
1. **App won't launch:** Check Android emulator and Metro bundler
2. **Can't find contacts:** Verify test data was seeded correctly
3. **Authentication fails:** Check Supabase credentials
4. **Build errors:** See `PROJECT-STATUS.md` troubleshooting

### Support:
- Review test plan for detailed steps
- Check bug report template examples
- Refer to PRD for acceptance criteria

---

## Testing Checklist

Before starting testing:
- [ ] App launches successfully
- [ ] Test account created
- [ ] Test data seeded
- [ ] Test plan document open
- [ ] Bug report template ready
- [ ] Results tracker ready
- [ ] Screenshot tool available

During testing:
- [ ] Follow test steps exactly
- [ ] Document actual results
- [ ] Take screenshots of issues
- [ ] Create bug reports immediately
- [ ] Update tracker after each test group

After testing:
- [ ] Calculate pass rate
- [ ] Summarize critical bugs
- [ ] Get sign-off from stakeholders
- [ ] Plan retest after fixes

---

**Ready to test?** Start with [QUICK-START-TESTING.md](./QUICK-START-TESTING.md)

**Good luck! 🧪✅**

---

**Documentation Version:** 1.0  
**Last Updated:** 2025-01-02

