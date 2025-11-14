# Bug Report Template

**Use this template for all bugs found during Epic 2 testing**

---

## Bug Report #: [BR-XXX]

### Basic Information
- **Date Found:** _______________
- **Found By:** _______________
- **Test Case:** [TEST-X.X from test plan, e.g., TEST-1.1]
- **User Story:** [US-2.X]
- **Epic:** Epic 2 - Contact Management

---

### Severity & Priority

**Severity:**
- [ ] **Critical** - App crashes, data loss, security issue, blocks core functionality
- [ ] **High** - Major feature broken, workaround difficult
- [ ] **Medium** - Feature partially works, has workaround
- [ ] **Low** - Minor issue, cosmetic, doesn't affect functionality

**Priority:**
- [ ] **P0** - Fix immediately (Critical/High severity)
- [ ] **P1** - Fix in current sprint (High/Medium severity)
- [ ] **P2** - Fix in next sprint (Medium/Low severity)
- [ ] **P3** - Backlog (Low severity)

---

### Bug Description

**Title:** [One-line summary of the bug]

**Description:**
[Detailed description of what the bug is]

---

### Steps to Reproduce

1. [Step 1]
2. [Step 2]
3. [Step 3]
4. [Continue as needed...]

**Reproducibility:**
- [ ] Always (100%)
- [ ] Sometimes (50-99%)
- [ ] Rarely (<50%)
- [ ] Only once (can't reproduce)

---

### Expected Result

[What should have happened]

---

### Actual Result

[What actually happened]

---

### Environment

**Platform:** [ ] Android [ ] iOS  
**OS Version:** _______________  
**Device/Emulator:** _______________  
**App Version:** _______________  
**React Native Version:** 0.73.0  
**Metro Bundler Port:** 8081

**Network:**
- [ ] WiFi
- [ ] Cellular
- [ ] Offline

**Test Data:**
[Any specific test data that triggers the bug]

---

### Screenshots/Recordings

**Screenshots:**
1. [Attach screenshot 1]
2. [Attach screenshot 2]

**Screen Recording:**
[Link to recording if available]

**Logs:**
```
[Paste relevant logs/errors here]
```

---

### Additional Information

**Error Messages:**
[Any error messages displayed]

**Console Errors:**
[Any errors in Metro bundler console or device logs]

**Related Bugs:**
[Links to related bug reports]

**Workaround:**
[If applicable, describe any workaround]

---

### Developer Notes

**Assigned To:** _______________  
**Status:** [ ] New [ ] In Progress [ ] Fixed [ ] Verified [ ] Closed  
**Fixed In Version:** _______________  
**Verification Date:** _______________

---

## Bug Report Examples

### Example 1: Critical - App Crash

**Bug Report #: BR-001**

**Title:** App crashes when tapping "Add Contact" button with network offline

**Severity:** Critical | **Priority:** P0

**Steps to Reproduce:**
1. Turn off WiFi/cellular connection
2. Navigate to Contacts screen
3. Tap "Add Contact" button
4. App crashes immediately

**Expected Result:** Error message displayed: "No internet connection. Please try again."

**Actual Result:** App crashes with "Network request failed" error and closes

**Environment:** Android 13, Pixel 5 emulator

---

### Example 2: High - Validation Not Working

**Bug Report #: BR-002**

**Title:** Add Contact form allows invalid email format

**Severity:** High | **Priority:** P1

**Steps to Reproduce:**
1. Navigate to Add Contact screen
2. Enter name: "Test User"
3. Enter email: "invalid-email-format"
4. Tap "Add Contact"
5. Contact is saved successfully

**Expected Result:** Error message: "Invalid email address format" and form doesn't submit

**Actual Result:** Contact saves with invalid email

**Environment:** Android 13, Pixel 5 emulator

---

### Example 3: Medium - UI Issue

**Bug Report #: BR-003**

**Title:** Search bar text becomes invisible after typing

**Severity:** Medium | **Priority:** P2

**Steps to Reproduce:**
1. Navigate to Contacts list
2. Tap search bar
3. Type any text
4. Text appears but is white on white background (invisible)

**Expected Result:** Search text is visible (dark color)

**Actual Result:** Text is invisible but search still works

**Workaround:** Can still use search, but can't see what you're typing

**Environment:** Android 13, Dark mode enabled

---

## Bug Report Checklist

Before submitting, verify:
- [ ] Clear title
- [ ] Detailed steps to reproduce
- [ ] Expected vs actual results documented
- [ ] Screenshots included
- [ ] Environment details filled in
- [ ] Severity and priority assigned
- [ ] Test case ID referenced
- [ ] User story referenced

---

**Template Version:** 1.0  
**Last Updated:** 2025-01-02

