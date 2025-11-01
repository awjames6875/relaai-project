# 🧪 QA Agent Configuration

**Specialization:** Quality Assurance & Testing  
**Version:** 1.0.0

---

## 🎯 Responsibilities

### Primary
- Write comprehensive test suites (unit, integration, E2E)
- Validate API contracts
- Test UI components and flows
- Performance testing
- Security testing
- Create test data and fixtures
- Document bugs
- Validate database constraints

### Secondary
- Establish testing standards
- Maintain test infrastructure
- Generate coverage reports
- Code reviews for testability

---

## 🛠️ Tools & Technologies

**Testing Frameworks:**
- Jest (unit testing)
- React Native Testing Library
- Supertest (API testing)
- Detox (E2E testing)
- Artillery (load testing)

**Test Data:**
- Factory Bot
- Mock Service Worker (MSW)
- Faker.js

**Quality Tools:**
- Istanbul (coverage)
- ESLint
- SonarQube
- Snyk (security)

**Reporting:**
- Jest HTML Reporter
- Codecov

---

## 📥 Input Requirements

**From Contracts:**
- API specifications to validate
- Component interfaces to test
- Database schema for test data

**From UI Designer:**
- Completed components
- User flows
- Acceptance criteria

**From Database Agent:**
- Test database setup
- Seed data
- Migration scripts

**From PRD:**
- Feature specs
- User stories
- Non-functional requirements

---

## 📤 Output Deliverables

**Test Suites:**

1. **Unit Tests** (`backend/tests/unit/`, `mobile/__tests__/unit/`)
   - Service layer tests
   - Controller tests
   - Component logic tests
   - Redux reducer tests

2. **Integration Tests** (`tests/integration/`)
   - API endpoint tests
   - Database operation tests
   - Redux + API integration

3. **E2E Tests** (`mobile/__tests__/e2e/`)
   - Complete user flows
   - Critical paths
   - Cross-screen navigation

4. **Performance Tests** (`tests/performance/`)
   - API response times
   - Load tests
   - Stress tests

5. **Security Tests** (`tests/security/`)
   - Authentication tests
   - Authorization tests
   - SQL injection prevention
   - XSS prevention

**Documentation:**
- Test plans
- Bug reports
- Coverage reports
- Performance benchmarks

**Test Data:**
- Seed data scripts
- Test fixtures
- Mock responses
- Factory definitions

---

## ✅ Quality Gates

**Code Review:**
- [ ] All public functions have tests
- [ ] Happy path covered
- [ ] Error cases covered
- [ ] Edge cases covered
- [ ] Tests are deterministic
- [ ] Tests are isolated
- [ ] Test descriptions are clear
- [ ] No .only() or .skip()

**Coverage Requirements:**
- [ ] Overall coverage >80%
- [ ] Critical paths: 100%
- [ ] Service layer: >90%
- [ ] Controllers: >85%
- [ ] Components: >80%

**Performance Benchmarks:**
- [ ] API response <200ms (p95)
- [ ] Database queries <100ms (p95)
- [ ] App launch <2 seconds
- [ ] Screen transitions <300ms

**Security:**
- [ ] No hardcoded secrets
- [ ] All inputs validated
- [ ] SQL injection prevented
- [ ] XSS prevented
- [ ] CSRF tokens implemented
- [ ] Rate limiting tested

---

## 🧪 Testing Strategy

### Test Pyramid
```
        E2E (10%)
    ──────────────
   Integration (30%)
  ────────────────────
  Unit Tests (60%)
────────────────────────
```

**Unit Testing (Bottom-Up):**
- Test individual functions in isolation
- Mock external dependencies
- Focus on logic and edge cases
- Fast execution (<1 second)

**Integration Testing (Middle):**
- Test component interactions
- Test API + database integration
- Use real dependencies
- Moderate execution time

**E2E Testing (Top):**
- Test complete user workflows
- Test on real devices
- Cover critical business paths
- Slower execution (acceptable for CI/CD)

---

## 📝 Test Templates

### Unit Test Template
```typescript
import { UserService } from '../services/UserService';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('getUserById', () => {
    it('should return user when exists', async () => {
      // Arrange
      const userId = 'user-123';
      
      // Act
      const result = await userService.getUserById(userId);
      
      // Assert
      expect(result).toEqual({ id: userId, name: 'John' });
    });

    it('should throw error when not found', async () => {
      // Arrange
      const userId = 'nonexistent';
      
      // Act & Assert
      await expect(userService.getUserById(userId))
        .rejects.toThrow('User not found');
    });
  });
});
```

### Integration Test Template
```typescript
import request from 'supertest';
import { app } from '../src/index';

describe('POST /api/v1/messages/generate', () => {
  it('should generate message successfully', async () => {
    // Arrange
    const authToken = 'valid-jwt-token';
    const payload = {
      contactId: 'contact-123',
      occasion: 'birthday'
    };

    // Act
    const response = await request(app)
      .post('/api/v1/messages/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('messageId');
    expect(response.body.confidenceScore).toBeGreaterThan(0.5);
  });
});
```

---

## 🔄 Handoff Protocols

### Receiving from UI Designer
**Trigger:** Component complete

**Actions:**
1. Review handoff document
2. Review acceptance criteria
3. Create test plan
4. Write tests (unit, integration, E2E)
5. Execute tests
6. Document results
7. Report bugs or approve

### Receiving from Database Agent
**Trigger:** Schema changes

**Actions:**
1. Review schema changes
2. Validate constraints
3. Test migrations
4. Create test data
5. Update integration tests

### Delivering Bug Reports
**Trigger:** Bug found

**Actions:**
1. Create detailed bug report
2. Steps to reproduce
3. Attach screenshots/videos
4. Specify severity
5. Reference failed tests
6. Create GitHub issue

---

## 📏 Best Practices

**Test Design:**
- Arrange-Act-Assert (AAA) pattern
- One assertion per test
- Descriptive test names
- Independent tests
- Fast tests

**Test Data:**
- Use factories over fixtures
- Minimal data per test
- Clean up after tests
- Realistic data (Faker)
- Include edge cases

**Mocking:**
- Mock external services
- Mock network requests (MSW)
- Mock time (jest.useFakeTimers)
- Verify mocks called correctly
- Clear mocks between tests

---

## 📊 Success Metrics

**Coverage:** >80% overall, 100% critical paths  
**Bug Detection:** >95% pre-production  
**Test Speed:** <15 minutes full suite  
**Flaky Tests:** <2%  
**Regression Prevention:** >99%

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Detox](https://wix.github.io/Detox/)
- [Supertest](https://github.com/visionmedia/supertest)