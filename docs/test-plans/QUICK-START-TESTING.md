# Quick Start: Epic 2 Testing Guide

**Purpose:** Get started with Epic 2 Contact Management testing in 5 minutes  
**Estimated Time:** 30 minutes for smoke test

---

## Step 1: Launch the App (5 minutes)

### Prerequisites Check:
- [ ] Android emulator running (Android Studio → Device Manager)
- [ ] Metro bundler running (check port 8081)
- [ ] `run-android.ps1` script exists in project root

### Launch:
```powershell
cd c:\Users\1alph\OneDrive\Desktop\relaai-project
powershell -ExecutionPolicy Bypass -File .\run-android.ps1
```

**Expected:** App builds, installs, and launches on emulator

**If errors occur:** Check `PROJECT-STATUS.md` troubleshooting section

---

## Step 2: Setup Test Account (3 minutes)

### Option A: Use Existing Account
1. Log in with your test credentials
2. Complete Profile Setup (or skip if available)
3. Note your User ID from Supabase dashboard (needed for test data)

### Option B: Create New Test Account
1. Tap "Sign Up" on login screen
2. Enter test email: `test@relaai.test`
3. Enter password: `TestPassword123!`
4. Complete registration
5. Complete Profile Setup screen
6. Get User ID from Supabase: `SELECT id FROM auth.users WHERE email = 'test@relaai.test';`

---

## Step 3: Seed Test Data (5 minutes)

### Method 1: SQL Script (Easiest)

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `scripts/seed-test-contacts.sql`
3. Replace `<USER_ID_HERE>` with your actual user ID
4. Run the script
5. Verify: Should see "10 contacts created" message

### Method 2: Manual (If you prefer)
- Use the app to add 3-5 contacts manually
- Recommended names: "Alice Johnson", "Bob Smith", "Test Contact"

**See:** `scripts/README-TEST-DATA.md` for detailed instructions

---

## Step 4: Run Smoke Test (30 minutes)

### Use the Checklist:
Open: `docs/test-plans/epic2-smoke-test-checklist.md`

### Execute in Order:
1. ✅ App Launch & Authentication (5 min)
2. ✅ Navigation to Contacts (5 min)
3. ✅ Empty State Display (3 min)
4. ✅ Add Contact (5 min)
5. ✅ View List & Search (7 min)
6. ✅ View Details (5 min)

### Record Results:
- Check boxes as you go
- Fill in "Actual Results" for each test
- Mark status: PASS / FAIL / BLOCKED
- Take screenshots of any issues

---

## Step 5: Document Findings (10 minutes)

### If Bugs Found:
1. Create bug report using: `docs/test-plans/bug-report-template.md`
2. Fill in all sections
3. Assign severity and priority
4. Take screenshots
5. Add to test results tracker

### Update Test Tracker:
Open: `docs/test-plans/test-results-tracker.md`
- Record all test results
- Update bug summary table
- Calculate pass rate

---

## Next Steps

### If Smoke Test Passes ✅:
- Proceed to full test plan: `docs/test-plans/epic2-manual-test-plan.md`
- Execute Phase 1: Critical Path Testing
- Continue through all phases

### If Smoke Test Fails ❌:
- Document all critical bugs
- Share bug reports with development team
- Fix critical blockers before proceeding
- Retest after fixes

---

## Quick Reference

### Test Documents:
- **Smoke Test:** `docs/test-plans/epic2-smoke-test-checklist.md`
- **Full Test Plan:** `docs/test-plans/epic2-manual-test-plan.md`
- **Bug Template:** `docs/test-plans/bug-report-template.md`
- **Results Tracker:** `docs/test-plans/test-results-tracker.md`

### Test Data:
- **SQL Script:** `scripts/seed-test-contacts.sql`
- **TypeScript Script:** `scripts/seed-test-contacts.ts`
- **Instructions:** `scripts/README-TEST-DATA.md`

### Getting Help:
- Check `PROJECT-STATUS.md` for project overview
- Review `docs/PRD.md` for requirements
- See `CLAUDE.md` for architecture details

---

## Testing Tips

1. **Take Screenshots:** Document everything, especially bugs
2. **Test on Real Device:** If possible, test on physical device too
3. **Test Edge Cases:** Try special characters, long names, empty fields
4. **Performance:** Note any slowness or lag
5. **Accessibility:** Check screen reader, color contrast, touch targets

---

## Expected Timeline

- **Smoke Test:** 30 minutes
- **Full Test Plan:** 4-6 hours
- **Bug Fixes & Retest:** Variable (depends on findings)

---

**Ready to start?** Follow steps 1-5 above!

**Good luck testing! 🧪**

