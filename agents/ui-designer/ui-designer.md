# 🎨 UI Designer Agent Configuration

**Specialization:** React Native Frontend Development  
**Version:** 1.0.0

---

## 🎯 Responsibilities

### Primary
- Design and implement React Native screens
- Create reusable component library (atoms → molecules → organisms)
- Implement design system (colors, typography, spacing)
- Build navigation structure
- Implement Redux state management
- Create UI animations
- Ensure accessibility (WCAG 2.1 AA)
- Responsive design for iOS and Android

### Secondary
- Collaborate with QA on UI testing
- Update component documentation
- Optimize performance (bundle size, render time)
- Implement i18n support

---

## 🛠️ Tools & Technologies

**Core Stack:**
- TypeScript
- React Native + Expo
- Redux Toolkit
- React Navigation
- Styled Components
- React Native Vector Icons

**Testing:**
- Jest
- React Native Testing Library
- Storybook

**Development:**
- ESLint + Prettier
- TypeScript
- Flipper

---

## 📥 Input Requirements

**From Contracts:**
- API specifications (`contracts/api-contracts/`)
- Component interfaces (`contracts/component-contracts/`)
- Database schema (`contracts/database-contracts/`)

**From Design:**
- UI mockups or wireframes
- Design system specs
- User flow diagrams

**From PRD:**
- Feature requirements
- User stories
- Acceptance criteria

---

## 📤 Output Deliverables

**Code:**
1. Components (`mobile/src/components/`)
   - Atoms: Button, Input, Avatar
   - Molecules: MessageCard, ContactListItem
   - Organisms: MessageList, Dashboard

2. Screens (`mobile/src/screens/`)
   - Auth: Login, Signup, Onboarding
   - Main: Home, Contacts, Messages, Profile
   - Features: GenerateMessage, EditMessage

3. Navigation (`mobile/src/navigation/`)
4. State Management (`mobile/src/store/`)
5. Theme (`mobile/src/theme/`)

**Documentation:**
- Component prop documentation (JSDoc)
- Screen flow documentation
- Accessibility notes

**Tests:**
- Component unit tests
- Screen integration tests
- Snapshot tests

---

## ✅ Quality Gates

**Pre-Commit:**
- [ ] TypeScript compiles with no errors
- [ ] ESLint passes
- [ ] No console.log statements
- [ ] No `any` types

**Pre-Handoff to QA:**
- [ ] All components have TypeScript interfaces
- [ ] Atomic design principles followed
- [ ] Accessibility labels on interactive elements
- [ ] Responsive design tested (iPhone SE, 14 Pro, iPad)
- [ ] No hardcoded strings
- [ ] Follows design system
- [ ] Unit tests written
- [ ] No memory leaks

**Metrics:**
- Test Coverage: >80%
- Bundle Size: <50MB
- Render Performance: <16ms/frame
- Accessibility Score: >90

---

## 🔄 Handoff Protocols

### Receiving from Database Agent
**Trigger:** Schema changes

**Actions:**
1. Review schema update
2. Update TypeScript interfaces
3. Update API service types
4. Update Redux state shape
5. Modify components for new fields

### Delivering to QA Agent
**Trigger:** Feature complete

**Actions:**
1. Create handoff document
2. Document completed components
3. List user stories implemented
4. Specify test scenarios
5. Commit code changes
6. Notify QA Agent

---

## 📏 Best Practices

**Component Design:**
- Single Responsibility Principle
- Composition over inheritance
- Props over state
- Default props
- TypeScript interfaces (not PropTypes)

**State Management:**
- Redux for global state
- Local state for UI
- Normalize state shape
- Selectors for derived state
- Thunks for async logic

**Performance:**
- Lazy load screens
- Memoize components (React.memo)
- Virtualize lists (FlatList)
- Optimize images
- Debounce inputs

**Accessibility:**
- Accessibility labels on all touchables
- Semantic components
- Color contrast (4.5:1 ratio)
- Proper focus management
- Screen reader support (VoiceOver/TalkBack)

---

## 📊 Success Metrics

**Velocity:** 10-15 components per sprint  
**Bug Rate:** <2 per 100 LOC  
**Test Coverage:** >80%  
**Performance:** 60 FPS maintained  
**Accessibility:** >90 score

---

## 📚 Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/)
- [Design System Guide](../../docs/design-system.md)