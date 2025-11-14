# Epic 2 Contact Management - Smoke Test Checklist

**Purpose:** Quick validation that core functionality works before full test execution  
**Estimated Time:** 30 minutes  
**Date:** 2025-01-02  
**Tester:** [Your Name]

---

## Pre-Flight Checks

Before starting, verify:

- [ ] Android emulator is running (check Android Studio → Device Manager)
- [ ] Metro bundler is running on port 8081
- [ ] `run-android.ps1` script exists in project root
- [ ] App builds successfully (no compile errors)
- [ ] Test account credentials available

---

## Smoke Test 1: App Launch & Authentication ⚡

**Time:** 5 minutes  
**Priority:** CRITICAL

### Steps:
1. Run the app: `powershell -ExecutionPolicy Bypass -File .\run-android.ps1`
2. Wait for app to install and launch on emulator
3. Observe initial screen

### Expected Results:
- [ ] App launches without crashing
- [ ] Login/Signup screen appears
- [ ] No error messages visible
- [ ] UI elements render correctly

### Actual Results:
_______________________________________________________________

**Status:** [ ] PASS [ ] FAIL [ ] BLOCKED  
**Notes:**
_______________________________________________________________

---

## Smoke Test 2: User Authentication & Navigation ⚡

**Time:** 5 minutes  
**Priority:** CRITICAL

### Steps:
1. Login with test account (or create new account if needed)
2. Complete Profile Setup (or skip if available)
3. Navigate through app to find Contacts tab/screen

### Expected Results:
- [ ] Login successful
- [ ] Profile setup works (or skip option available)
- [ ] Main navigation appears after authentication
- [ ] Contacts tab/button visible
- [ ] Can tap Contacts to navigate there

### Actual Results:
_______________________________________________________________

**Status:** [ ] PASS [ ] FAIL [ ] BLOCKED  
**Notes:**
_______________________________________________________________

---

## Smoke Test 3: Empty State Display ⚡

**Time:** 3 minutes  
**Priority:** CRITICAL

### Steps:
1. Navigate to Contacts screen/tab
2. Observe the screen when no contacts exist

### Expected Results:
- [ ] Empty state message displays: "No contacts yet" or similar
- [ ] "Add Contact" button or action visible
- [ ] Search bar visible (even if empty)
- [ ] No loading spinner stuck
- [ ] No error messages
- [ ] Screen loads in <2 seconds

### Actual Results:
_______________________________________________________________

**Status:** [ ] PASS [ ] FAIL [ ] BLOCKED  
**Notes:**
_______________________________________________________________

---

## Smoke Test 4: Add Contact (Happy Path) ⚡

**Time:** 5 minutes  
**Priority:** CRITICAL

### Steps:
1. Tap "Add Contact" button from empty state
2. Verify Add Contact screen opens
3. Enter name: "Test Contact"
4. Tap "Save" or "Add Contact" button
5. Observe what happens

### Expected Results:
- [ ] Add Contact screen opens
- [ ] Name field accepts input
- [ ] Save/Add button is tappable
- [ ] Loading indicator appears briefly
- [ ] Success message or automatic navigation occurs
- [ ] Returns to Contacts list
- [ ] "Test Contact" appears in list
- [ ] Operation completes in <1 second

### Actual Results:
_______________________________________________________________

**Status:** [ ] PASS [ ] FAIL [ ] BLOCKED  
**Notes:**
_______________________________________________________________

---

## Smoke Test 5: View Contact List & Basic Search ⚡

**Time:** 7 minutes  
**Priority:** CRITICAL

### Steps:
1. Add 2 more contacts: "Alice Johnson" and "Bob Smith"
2. Navigate to Contacts list
3. Verify all 3 contacts appear
4. Tap search bar
5. Type "Alice" in search
6. Observe results

### Expected Results:
- [ ] All 3 contacts display in list
- [ ] Each contact shows name
- [ ] List is scrollable
- [ ] Search bar is tappable
- [ ] Typing "Alice" filters to show only "Alice Johnson"
- [ ] Search results update in real-time or <300ms
- [ ] Clearing search shows all contacts again

### Actual Results:
_______________________________________________________________

**Status:** [ ] PASS [ ] FAIL [ ] BLOCKED  
**Notes:**
_______________________________________________________________

---

## Smoke Test 6: View Contact Details ⚡

**Time:** 5 minutes  
**Priority:** HIGH

### Steps:
1. Tap on "Test Contact" in the list
2. Observe Contact Detail screen

### Expected Results:
- [ ] Contact Detail screen opens
- [ ] Shows contact name: "Test Contact"
- [ ] Shows contact information fields
- [ ] "Edit" button or action visible
- [ ] "Delete" button or action visible
- [ ] Can navigate back to list

### Actual Results:
_______________________________________________________________

**Status:** [ ] PASS [ ] FAIL [ ] BLOCKED  
**Notes:**
_______________________________________________________________

---

## Smoke Test Results Summary

**Total Tests:** 6  
**Date Completed:** _______________

**Results:**
- ✅ Passed: _____
- ❌ Failed: _____
- ⏸️ Blocked: _____

### Overall Status:

**All Critical Tests Pass:** [ ] YES [ ] NO

**Recommendation:**
- [ ] ✅ **PROCEED** - All smoke tests passed, ready for full test execution
- [ ] ⚠️ **PROCEED WITH CAUTION** - Minor issues found, proceed but track closely
- [ ] ❌ **BLOCKED** - Critical failures found, fix before proceeding

### Critical Issues Found:

1. _______________________________________________________________
2. _______________________________________________________________
3. _______________________________________________________________

### Next Steps:
- [ ] Fix critical blockers (if any)
- [ ] Proceed to full test plan execution
- [ ] Document all issues in bug reports
- [ ] Schedule retest after fixes

---

**Sign-off:**
- Tester: ____________________ Date: _______________
- Reviewed by: ____________________ Date: _______________

