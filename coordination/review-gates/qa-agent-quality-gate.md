# QA Agent Quality Gate

This quality gate ensures QA Agent has completed comprehensive testing before approving features for release.

**Purpose:** Verify all functionality, prevent regressions, and ensure quality standards are met.

---

## When to Use This Quality Gate

Use this checklist **before**:
- Approving feature for release
- Signing off on bug fixes
- Closing QA testing phase
- Merging to main/production branch

---

## Test Coverage Quality Standards

### Unit Test Coverage
- [ ] Overall coverage >80%
- [ ] Critical path coverage 100%
- [ ] Service layer coverage >90%
- [ ] Component coverage >80%
- [ ] Utility function coverage >90%
- [ ] No untested edge cases

**Verification Command:**
```bash
npm run test:coverage
```

**Expected Output:**
```
Statements   : 85% (1200/1411)
Branches     : 82% (450/548)
Functions    : 88% (300/340)
Lines        : 85% (1150/1352)
```

---

### Integration Test Coverage
- [ ] API integration tests written
- [ ] Database integration tests written
- [ ] Redux integration tests written
- [ ] Navigation flow tests written
- [ ] Third-party integration tests written (mocked)

---

### E2E Test Coverage
- [ ] Critical user flows tested (E2E)
- [ ] Authentication flow tested
- [ ] Data CRUD operations tested
- [ ] Error handling flows tested
- [ ] Happy path tested end-to-end

**E2E Tests:**
- User registration and login
- Create/update/delete contact
- Generate and send message
- View relationship health
- Notification interactions

---

## Test Quality Standards

### Test Structure
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] One assertion per test (or logically grouped)
- [ ] Test names describe what is being tested
- [ ] Test file names match component names
- [ ] Tests organized in `describe` blocks
- [ ] Setup/teardown in `beforeEach`/`afterEach`

**Example:**
```typescript
describe('NotificationCard', () => {
  describe('when notification is unread', () => {
    it('should display unread indicator', () => {
      // Arrange
      const notification = { id: '1', read: false, title: 'Test' };

      // Act
      const { getByTestId } = render(
        <NotificationCard notification={notification} />
      );

      // Assert
      expect(getByTestId('unread-indicator')).toBeVisible();
    });
  });
});
```

---

### Test Data
- [ ] Test data factories created
- [ ] Test data realistic
- [ ] Test data covers edge cases
- [ ] Test data doesn't depend on external state
- [ ] Test data easily maintainable

**Example Factory:**
```typescript
export const createMockNotification = (
  overrides?: Partial<Notification>
): Notification => ({
  id: faker.datatype.uuid(),
  userId: faker.datatype.uuid(),
  title: faker.lorem.sentence(),
  message: faker.lorem.paragraph(),
  read: false,
  createdAt: faker.date.recent().toISOString(),
  ...overrides
});
```

---

### Mocking
- [ ] External dependencies mocked (API, database)
- [ ] Date/time mocked for consistency
- [ ] Random values mocked or seeded
- [ ] File system operations mocked
- [ ] Network requests intercepted
- [ ] Mocks reset between tests

---

### Test Reliability
- [ ] Tests are deterministic (no flakiness)
- [ ] Tests run in isolation
- [ ] Tests don't depend on order
- [ ] Tests clean up after themselves
- [ ] No hardcoded waits (use waitFor, etc.)
- [ ] Tests pass consistently (10/10 runs)

---

## Functional Testing Quality Standards

### Happy Path Testing
- [ ] Primary user flow works end-to-end
- [ ] All form submissions successful
- [ ] Data saves correctly
- [ ] Navigation works as expected
- [ ] UI updates reflect backend changes

---

### Error Scenario Testing
- [ ] Network offline - appropriate message shown
- [ ] API returns 400 - validation errors displayed
- [ ] API returns 401 - user redirected to login
- [ ] API returns 403 - permission error shown
- [ ] API returns 404 - not found message shown
- [ ] API returns 500 - generic error message shown
- [ ] Timeout errors handled gracefully

---

### Edge Case Testing
- [ ] Empty data sets - empty state shown
- [ ] Very long text - truncates or wraps correctly
- [ ] Special characters in input - handled correctly
- [ ] Minimum values - validated
- [ ] Maximum values - validated
- [ ] Boundary conditions tested
- [ ] Rapid user actions - debounced/prevented
- [ ] Concurrent operations - handled correctly

---

### State Testing
- [ ] Loading state displayed during async operations
- [ ] Success state shown after successful action
- [ ] Error state shown after failed action
- [ ] Empty state shown when no data
- [ ] Disabled state prevents interaction
- [ ] Transition animations smooth

---

## UI/UX Testing Quality Standards

### Visual Testing
- [ ] Screenshots captured for key screens
- [ ] Visual regressions checked (if tool available)
- [ ] Layout correct on all screen sizes
- [ ] Text legible at all font sizes
- [ ] Images load correctly
- [ ] Icons render correctly
- [ ] Colors match design system

---

### Responsive Design Testing
Tested on these devices:
- [ ] iPhone SE (375x667) - smallest iOS
- [ ] iPhone 14 Pro (393x852) - standard iOS
- [ ] iPhone 14 Pro Max (430x932) - large iOS
- [ ] iPad Pro (1024x1366) - tablet
- [ ] Android Pixel 5 (393x851) - standard Android
- [ ] Android Samsung S21 (360x800) - small Android
- [ ] Large Android device (>400px width)

**Issues Found:**
- [ ] Text cutoff on small screens
- [ ] Layout breaks on large screens
- [ ] Buttons too small on any device
- [ ] Content overlaps
- [ ] Scrolling issues

---

### Interaction Testing
- [ ] All buttons respond to tap
- [ ] All forms submit correctly
- [ ] All inputs accept text
- [ ] Swipe gestures work (if used)
- [ ] Pull-to-refresh works
- [ ] Long-press actions work (if used)
- [ ] Keyboard dismisses correctly
- [ ] Focus management correct

---

### Theme Testing
- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] Theme toggle works smoothly
- [ ] No color issues in either theme
- [ ] Contrast sufficient in both themes

---

## Accessibility Testing Quality Standards

### Screen Reader Testing
- [ ] VoiceOver tested (iOS) - all screens
- [ ] TalkBack tested (Android) - all screens
- [ ] All content announced correctly
- [ ] Headings announced as headings
- [ ] Buttons announced as buttons
- [ ] Form labels announced correctly
- [ ] State changes announced

**VoiceOver Test Script:**
1. Enable VoiceOver: Settings > Accessibility > VoiceOver
2. Navigate through app with swipe gestures
3. Verify all elements announced clearly
4. Verify logical reading order
5. Test all interactive actions

---

### Keyboard Navigation (if web)
- [ ] All interactive elements focusable
- [ ] Tab order logical
- [ ] Focus visible (outline or highlight)
- [ ] No keyboard traps
- [ ] Shortcuts work (if defined)

---

### Visual Accessibility
- [ ] Text contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Large text contrast ≥ 3:1
- [ ] Color not sole indicator (icons + color)
- [ ] Focus indicators visible
- [ ] Tap targets ≥ 44x44 points (iOS) / 48x48dp (Android)

**Tools:**
- Contrast Checker: https://webaim.org/resources/contrastchecker/
- Color Blindness Simulator: https://www.color-blindness.com/coblis-color-blindness-simulator/

---

### Dynamic Type/Font Scaling
- [ ] Text scales with system settings (iOS Dynamic Type)
- [ ] Text scales with font size settings (Android)
- [ ] Layout adapts to larger text sizes
- [ ] No text cutoff at large sizes
- [ ] No overlapping elements at large sizes

**Test:**
- iOS: Settings > Display & Brightness > Text Size (try largest)
- Android: Settings > Display > Font Size (try largest)

---

### Accessibility Score
- [ ] Lighthouse Accessibility score >90 (if web)
- [ ] Axe DevTools scan shows no critical issues
- [ ] No WCAG violations

---

## Performance Testing Quality Standards

### App Performance
- [ ] App launches in <3 seconds (cold start)
- [ ] App resumes in <1 second (warm start)
- [ ] Screens render in <500ms
- [ ] Transitions smooth (60 FPS)
- [ ] Scrolling smooth (60 FPS)
- [ ] Animations smooth (no jank)

**Measurement:**
- Use React Native Performance Monitor
- Use React DevTools Profiler
- Use Xcode Instruments (iOS)
- Use Android Profiler (Android)

---

### API Performance
- [ ] API response times <200ms (p95)
- [ ] Database queries <100ms (p95)
- [ ] Search queries <500ms (p95)
- [ ] Image uploads <3 seconds
- [ ] Pagination loads next page <500ms

**Measurement:**
```bash
# Check API response times
curl -w "@curl-format.txt" -o /dev/null -s https://api.example.com/endpoint
```

---

### Network Conditions
Tested under:
- [ ] WiFi (normal conditions)
- [ ] 4G (good mobile connection)
- [ ] 3G (slow mobile connection)
- [ ] Offline (no connection)

**Performance Under Slow 3G:**
- [ ] App still usable
- [ ] Loading indicators shown
- [ ] Timeouts handled gracefully
- [ ] Cached data displayed

---

### Memory Usage
- [ ] No memory leaks detected
- [ ] Memory usage stable during extended use
- [ ] Memory usage <200MB under normal use
- [ ] App doesn't crash after extended use

**Test:**
- Run app for 30+ minutes
- Navigate through all screens multiple times
- Monitor memory in DevTools/Xcode/Android Studio

---

### Battery Usage
- [ ] No excessive battery drain
- [ ] Background processes minimal
- [ ] Location services used appropriately
- [ ] Network requests optimized (batched)

---

## Security Testing Quality Standards

### Authentication
- [ ] Login required for protected features
- [ ] Logout clears session correctly
- [ ] Session expires after timeout
- [ ] JWT tokens stored securely
- [ ] Refresh tokens work correctly

---

### Authorization
- [ ] Users can only access own data
- [ ] Admin features restricted to admins
- [ ] RLS policies enforced
- [ ] API endpoints validate user permissions

**Test:**
- Create two user accounts
- Verify User A cannot access User B's data
- Verify User A cannot modify User B's data

---

### Data Validation
- [ ] Input validation on all forms
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (output sanitization)
- [ ] CSRF tokens used (if web)
- [ ] File upload validation (type, size)
- [ ] Rate limiting works

**Test:**
- Try SQL injection: `'; DROP TABLE users; --`
- Try XSS: `<script>alert('XSS')</script>`
- Try uploading invalid files

---

### Data Privacy
- [ ] Sensitive data encrypted in transit (HTTPS)
- [ ] Sensitive data not logged
- [ ] PII handled according to privacy policy
- [ ] User can export their data
- [ ] User can delete their data (GDPR)

---

## Regression Testing Quality Standards

### Existing Features
- [ ] Dashboard still loads
- [ ] Contact list still works
- [ ] Message generation still works
- [ ] Settings still accessible
- [ ] Profile updates still work
- [ ] All navigation still functions

---

### No New Bugs
- [ ] No new console errors
- [ ] No new console warnings
- [ ] No new accessibility violations
- [ ] No performance degradation
- [ ] No visual regressions

---

### Cross-Feature Impact
- [ ] New feature doesn't break existing features
- [ ] Database changes don't affect existing queries
- [ ] UI changes don't break existing screens
- [ ] API changes backward compatible

---

## Bug Reporting Quality Standards

### Bug Documentation
- [ ] All bugs documented using [qa-bug-report-template.md](coordination/handoff-protocols/qa-bug-report-template.md)
- [ ] Severity assigned correctly
- [ ] Priority assigned correctly
- [ ] Steps to reproduce clear
- [ ] Screenshots/recordings attached
- [ ] Assigned to appropriate agent

---

### Bug Validation
- [ ] All critical bugs (P0) fixed
- [ ] All high priority bugs (P1) fixed
- [ ] Medium/low bugs documented for future fix
- [ ] Regressions fixed
- [ ] Bug fixes verified and retested

---

## Platform-Specific Testing

### iOS Testing
- [ ] Tested on iOS 15.0 (minimum supported)
- [ ] Tested on iOS 17.x (latest)
- [ ] Tested on physical iPhone device
- [ ] Xcode warnings reviewed
- [ ] No iOS-specific crashes
- [ ] Push notifications work (if applicable)
- [ ] Deep links work (if applicable)

---

### Android Testing
- [ ] Tested on Android 10 (minimum supported)
- [ ] Tested on Android 14 (latest)
- [ ] Tested on physical Android device
- [ ] Gradle warnings reviewed
- [ ] No Android-specific crashes
- [ ] Push notifications work (if applicable)
- [ ] Deep links work (if applicable)

---

## Documentation Quality Standards

### Test Documentation
- [ ] Test plan document created
- [ ] Test scenarios documented
- [ ] Test data documented
- [ ] Known issues documented
- [ ] Workarounds documented
- [ ] Test results recorded

---

### User Documentation
- [ ] User-facing changes documented (if applicable)
- [ ] Help text updated (if applicable)
- [ ] Release notes drafted
- [ ] Breaking changes highlighted

---

## Pre-Release Final Check

### All Tests Passing
- [ ] Unit tests: 100% passing
- [ ] Integration tests: 100% passing
- [ ] E2E tests: 100% passing
- [ ] Manual tests: 100% passing
- [ ] CI/CD pipeline: ✅ Passing

---

### Acceptance Criteria
- [ ] All acceptance criteria met
- [ ] All user stories completed
- [ ] All edge cases covered
- [ ] All error cases handled
- [ ] No blocking bugs

---

### Sign-Off Checklist
- [ ] Feature works as designed
- [ ] Performance meets benchmarks
- [ ] Accessibility requirements met
- [ ] Security requirements met
- [ ] No critical or high priority bugs
- [ ] Regression testing complete
- [ ] Documentation complete

---

## Quality Gate Approval

### Self-Review
- [ ] All checklist items completed
- [ ] All tests documented
- [ ] All bugs reported
- [ ] Ready for release approval

### Peer Review (if applicable)
- Reviewer Name: _______________
- Review Date: _______________
- **Status:** [ ] Approved / [ ] Changes Requested

---

## Quality Gate Decision

**[ ] PASS** - Feature approved for release
**[ ] FAIL** - Issues must be addressed before release

**Blocking Issues:**
1. _______________________
2. _______________________
3. _______________________

**Non-Blocking Issues (backlog):**
1. _______________________
2. _______________________

---

## Release Approval

**QA Agent Signature:** _______________
**Date:** _______________
**Release Version:** _______________

**Product Owner Approval:** [ ] Approved / [ ] Not Approved

---

**Remember:** QA is the last line of defense before production. Be thorough!
