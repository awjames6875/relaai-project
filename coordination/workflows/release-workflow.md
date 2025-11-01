# Release Workflow

This workflow defines the complete process for releasing new versions of the RelaAI application to production.

**Agents Involved:** All agents (Database, Backend, UI Designer, QA), Tech Lead, DevOps

---

## Workflow Overview

```
Planning → Feature Freeze → Testing → Staging → Production → Monitor
   ↓           ↓              ↓          ↓          ↓           ↓
Version     Code Lock      Full QA   Validate   Deploy     Metrics
Scope       Branch Cut     Pass      Smoke      Gradual    & Support
```

**Release Types:**
- **Major Release (X.0.0):** Breaking changes, major features (quarterly)
- **Minor Release (1.X.0):** New features, no breaking changes (monthly)
- **Patch Release (1.2.X):** Bug fixes only (as needed)
- **Hotfix Release (1.2.3-hotfix):** Critical production fixes (immediate)

**Typical Timeline:**
- **Major:** 4-6 weeks
- **Minor:** 2-3 weeks
- **Patch:** 1 week
- **Hotfix:** <24 hours

---

## Phase 1: Release Planning

### Objective
Define release scope, version number, and timeline.

### Responsible Agent
**Tech Lead / Product Owner**

### Steps

#### 1.1 Define Release Scope

**Review backlog and completed work:**
```bash
# Check merged PRs since last release
gh pr list --state merged --base main --search "merged:>2025-01-01"

# Check closed issues
gh issue list --state closed --search "closed:>2025-01-01"

# Review feature branches
git branch --merged main
```

**Categorize changes:**
- [ ] New features
- [ ] Enhancements to existing features
- [ ] Bug fixes
- [ ] Performance improvements
- [ ] Security fixes
- [ ] Breaking changes
- [ ] Database schema changes
- [ ] API changes

**Deliverables:**
- [ ] Release scope document
- [ ] Feature list finalized
- [ ] Breaking changes identified

---

#### 1.2 Determine Version Number

**Semantic Versioning (MAJOR.MINOR.PATCH):**

**MAJOR (X.0.0) - Increment when:**
- Breaking API changes
- Breaking database schema changes
- Major architectural changes
- Removing deprecated features
- Incompatible with previous version

**Example:** 1.5.3 → 2.0.0
```
Breaking Changes:
- Removed deprecated /api/v1 endpoints
- Changed user authentication flow
- Migrated from contacts.name to contacts.full_name
```

**MINOR (1.X.0) - Increment when:**
- Adding new features
- Adding new API endpoints
- Backwards-compatible changes
- Non-breaking database additions

**Example:** 1.5.3 → 1.6.0
```
New Features:
- Notification preferences
- Contact tagging system
- Message scheduling improvements
```

**PATCH (1.5.X) - Increment when:**
- Bug fixes only
- Security patches
- Performance improvements
- No new features

**Example:** 1.5.3 → 1.5.4
```
Bug Fixes:
- Fixed contact delete crash
- Fixed search performance
- Fixed UI layout on iPad
```

**Deliverables:**
- [ ] Version number determined
- [ ] Version increment rationale documented

---

#### 1.3 Create Release Timeline

**Example Timeline for Minor Release (1.6.0):**

**Week 1: Development**
- Monday: Release planning meeting
- Tuesday-Friday: Feature development

**Week 2: Feature Freeze & Testing**
- Monday: Feature freeze, branch cut
- Tuesday-Thursday: QA testing
- Friday: Bug fixes

**Week 3: Deployment**
- Monday: Staging deployment
- Tuesday-Wednesday: Staging validation
- Thursday: Production deployment (gradual rollout)
- Friday: Monitor production, 100% rollout

**Deliverables:**
- [ ] Release timeline created
- [ ] Key dates communicated to team
- [ ] Calendar invites sent

---

#### 1.4 Create Release Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create release branch
git checkout -b release/v1.6.0

# Push to remote
git push origin release/v1.6.0

# Protect branch (prevent direct commits)
gh api repos/relaai/relaai-project/branches/release/v1.6.0/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field enforce_admins=true
```

**Deliverables:**
- [ ] Release branch created
- [ ] Branch protected
- [ ] Team notified

---

## Phase 2: Feature Freeze & Stabilization

### Objective
Stop adding new features and focus on quality and stability.

### Responsible Agent
**Tech Lead**

### Steps

#### 2.1 Feature Freeze Announcement

**Email to team:**
```
Subject: Feature Freeze for v1.6.0

Team,

We've entered feature freeze for v1.6.0 release.

Effective immediately:
✅ Allowed: Bug fixes, tests, documentation
❌ Not allowed: New features, refactoring, non-critical changes

Branch: release/v1.6.0
Release Date: 2025-02-01
Testing Phase: Jan 25-29

Please:
- Complete in-progress bug fixes by EOD today
- Focus on testing and QA support
- Hold new features for v1.7.0

Thanks!
```

**Deliverables:**
- [ ] Feature freeze announced
- [ ] Only critical fixes allowed
- [ ] Team focused on stability

---

#### 2.2 Update Version Numbers

**Mobile App (package.json):**
```json
{
  "name": "relaai-mobile",
  "version": "1.6.0",
  "buildNumber": "56"
}
```

**Backend API (package.json):**
```json
{
  "name": "relaai-backend",
  "version": "1.6.0"
}
```

**Database (migration):**
```sql
-- V020_update_version.sql
UPDATE metadata SET value = '1.6.0' WHERE key = 'schema_version';
```

**iOS (ios/RelaAI/Info.plist):**
```xml
<key>CFBundleShortVersionString</key>
<string>1.6.0</string>
<key>CFBundleVersion</key>
<string>56</string>
```

**Android (android/app/build.gradle):**
```gradle
versionCode 56
versionName "1.6.0"
```

**Deliverables:**
- [ ] All version numbers updated
- [ ] Build numbers incremented
- [ ] Committed to release branch

---

#### 2.3 Generate Changelog

**Use git history to create changelog:**
```bash
# Get all commits since last release
git log v1.5.0..HEAD --oneline --no-merges

# Generate changelog
npx conventional-changelog -p angular -i CHANGELOG.md -s
```

**Manual cleanup and categorization:**
```markdown
# Changelog

## [1.6.0] - 2025-02-01

### Added
- Notification preferences screen
  - Email notification toggle
  - Push notification toggle
  - SMS notification toggle
- Contact tagging system
  - Create custom tags
  - Assign tags to contacts
  - Filter contacts by tag
- Message scheduling improvements
  - Recurring message support
  - Time zone handling

### Changed
- Improved contact search performance (5s → 100ms)
- Updated profile settings UI
- Enhanced error messages

### Fixed
- Fixed crash when deleting contact with scheduled messages (#123)
- Fixed contact search on large datasets (#145)
- Fixed UI layout issues on iPad (#167)
- Fixed time zone bug in message scheduling (#189)

### Security
- Updated dependencies with security vulnerabilities
- Added rate limiting to API endpoints

### Deprecated
- `/api/v1/contacts` endpoint (use `/api/v2/contacts` instead)
- Will be removed in v2.0.0
```

**Deliverables:**
- [ ] CHANGELOG.md updated
- [ ] All changes categorized
- [ ] Breaking changes highlighted

---

## Phase 3: Quality Assurance

### Objective
Comprehensive testing to ensure release quality.

### Responsible Agent
**QA Agent**

### Steps

#### 3.1 Regression Testing

**Full regression test suite:**
```bash
# Run all unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

**Manual Testing Checklist:**
- [ ] All new features tested
- [ ] Critical user flows tested
- [ ] Regression testing complete
- [ ] Cross-platform testing (iOS & Android)
- [ ] Device testing (phones & tablets)
- [ ] Accessibility testing
- [ ] Performance testing
- [ ] Localization testing (if applicable)

Use [qa-agent-quality-gate.md](coordination/review-gates/qa-agent-quality-gate.md)

**Deliverables:**
- [ ] All automated tests passing
- [ ] Manual testing complete
- [ ] Test report generated
- [ ] Bugs filed for any issues found

---

#### 3.2 Performance Testing

**Measure key metrics:**
```bash
# Frontend performance
npm run analyze-bundle
npm run lighthouse -- --view

# Backend performance
npm run benchmark

# Database performance
psql -f scripts/benchmark_queries.sql
```

**Performance Benchmarks:**
- [ ] App launch time <2s
- [ ] Screen render time <500ms
- [ ] API response time p95 <200ms
- [ ] Database query time p95 <100ms
- [ ] Bundle size <10MB
- [ ] Memory usage <150MB
- [ ] 60 FPS maintained during scrolling

**Deliverables:**
- [ ] Performance benchmarks met
- [ ] Performance report generated
- [ ] Regressions identified and fixed

---

#### 3.3 Security Testing

**Security checklist:**
- [ ] Dependencies updated (no critical vulnerabilities)
- [ ] API endpoints require authentication
- [ ] RLS policies tested and verified
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] Secrets not committed to repository
- [ ] Environment variables properly configured

**Run security scans:**
```bash
# Check for vulnerable dependencies
npm audit
npm audit fix

# Security linting
npm run lint:security

# Check for secrets in code
npx @trufflesecurity/trufflehog filesystem --directory .
```

**Deliverables:**
- [ ] No critical security vulnerabilities
- [ ] Security audit complete
- [ ] Compliance requirements met

---

#### 3.4 Bug Triage & Fixes

**Triage all bugs found during testing:**

**P0 (Release Blocker):**
- Must fix before release
- Blocks critical functionality
- Causes data loss
- Security vulnerability

**P1 (High Priority):**
- Should fix before release
- Major feature broken
- Significant UX issue
- Consider delaying release if many P1s

**P2 (Medium Priority):**
- Fix if time permits
- Minor feature issue
- Can be included in patch release

**P3 (Low Priority):**
- Defer to next release
- Cosmetic issue
- Edge case

**Bug Fix Process:**
- [ ] All P0 bugs fixed
- [ ] P1 bugs fixed or deferred
- [ ] P2/P3 bugs documented for future releases
- [ ] All fixes tested

**Deliverables:**
- [ ] Bug triage complete
- [ ] All release blockers resolved
- [ ] Release quality acceptable

---

## Phase 4: Staging Deployment

### Objective
Deploy to staging environment for final validation.

### Responsible Agent
**DevOps / Tech Lead**

### Steps

#### 4.1 Deploy Database Migrations

```bash
# Backup staging database
pg_dump staging_db > backups/staging_pre_v1.6.0_$(date +%Y%m%d).sql

# Test migrations locally first
supabase migration up --local

# Deploy to staging
supabase migration up --env staging

# Verify schema
psql -h staging-db.supabase.co -d postgres -c "\d+ profiles"

# Verify data integrity
psql -h staging-db.supabase.co -d postgres -f scripts/verify_data.sql
```

**Deliverables:**
- [ ] Database backup created
- [ ] Migrations applied successfully
- [ ] Schema verified
- [ ] Data integrity confirmed

---

#### 4.2 Deploy Backend API

```bash
# Build backend
npm run build

# Run tests on staging code
NODE_ENV=staging npm test

# Deploy to staging
git push staging release/v1.6.0

# Verify deployment
curl https://staging-api.relaai.com/health
curl https://staging-api.relaai.com/version

# Check logs
kubectl logs -f deployment/api-server -n staging
```

**Deliverables:**
- [ ] Backend deployed to staging
- [ ] Health checks passing
- [ ] API endpoints responding
- [ ] No errors in logs

---

#### 4.3 Deploy Mobile App

```bash
# iOS - TestFlight
eas build --platform ios --profile staging
eas submit --platform ios --profile staging

# Android - Internal Testing Track
eas build --platform android --profile staging
eas submit --platform android --profile staging

# Notify testers
gh issue comment 200 --body "v1.6.0 available on TestFlight/Internal Track for testing"
```

**Deliverables:**
- [ ] iOS build on TestFlight
- [ ] Android build on Internal Track
- [ ] Testers notified
- [ ] App loads successfully

---

#### 4.4 Staging Smoke Tests

**Critical path testing:**
```bash
# Automated smoke tests
npm run test:smoke:staging

# Manual smoke tests
# 1. User can sign up
# 2. User can login
# 3. User can create contact
# 4. User can send message
# 5. User can schedule message
# 6. User can view notifications
# 7. User can update preferences
```

**Smoke Test Checklist:**
- [ ] Authentication works
- [ ] Core features functional
- [ ] Database operations work
- [ ] API endpoints responding
- [ ] No critical errors
- [ ] Performance acceptable

**Deliverables:**
- [ ] Smoke tests passed
- [ ] Staging environment stable
- [ ] Ready for production

---

## Phase 5: Production Deployment

### Objective
Deploy to production with minimal risk and downtime.

### Responsible Agent
**DevOps / Tech Lead**

### Steps

#### 5.1 Pre-Deployment Checklist

**Final verification:**
- [ ] All tests passing
- [ ] QA sign-off obtained
- [ ] Staging validation complete
- [ ] Database backups prepared
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured
- [ ] On-call engineer assigned
- [ ] Communication plan ready
- [ ] Release notes finalized
- [ ] Support team briefed

**Deployment Window:**
- Preferred: Tuesday-Thursday, 10 AM - 2 PM UTC
- Avoid: Monday, Friday, weekends, holidays
- Duration: 2-4 hours for full deployment

**Deliverables:**
- [ ] Pre-deployment checklist complete
- [ ] Go/No-Go decision made
- [ ] Deployment scheduled

---

#### 5.2 Database Migration

```bash
# 1. Announce maintenance (if downtime expected)
# Post to status page, send email, show in-app banner

# 2. Backup production database
pg_dump production_db > backups/prod_pre_v1.6.0_$(date +%Y%m%d_%H%M%S).sql

# 3. Enable read-only mode (if necessary)
# ALTER DATABASE production SET default_transaction_read_only = true;

# 4. Run migrations
supabase migration up --env production

# 5. Verify migrations
psql -h prod-db.supabase.co -d postgres -c "\d+ profiles"
psql -h prod-db.supabase.co -d postgres -f scripts/verify_data.sql

# 6. Disable read-only mode
# ALTER DATABASE production SET default_transaction_read_only = false;

# 7. Monitor for issues
tail -f /var/log/postgresql/postgresql.log
```

**Migration Safety:**
- Use transactions for rollback capability
- Apply changes in small batches
- Monitor query performance
- Have rollback script ready

**Deliverables:**
- [ ] Production database backed up
- [ ] Migrations applied successfully
- [ ] Data integrity verified
- [ ] Database healthy

---

#### 5.3 Deploy Backend API (Blue-Green Deployment)

```bash
# 1. Deploy new version (green) alongside current (blue)
kubectl apply -f deployments/api-server-v1.6.0.yaml

# 2. Wait for green pods to be ready
kubectl rollout status deployment/api-server-green

# 3. Run health checks on green
curl https://green-api.relaai.com/health
curl https://green-api.relaai.com/version

# 4. Gradually shift traffic to green
# 10% traffic
kubectl patch service api-server -p '{"spec":{"selector":{"version":"1.6.0","weight":"10"}}}'

# Wait 10 minutes, monitor metrics

# 50% traffic
kubectl patch service api-server -p '{"spec":{"selector":{"version":"1.6.0","weight":"50"}}}'

# Wait 30 minutes, monitor metrics

# 100% traffic
kubectl patch service api-server -p '{"spec":{"selector":{"version":"1.6.0","weight":"100"}}}'

# 5. Terminate blue deployment (after 24 hours)
kubectl delete deployment api-server-blue
```

**Deliverables:**
- [ ] New version deployed
- [ ] Traffic gradually shifted
- [ ] No errors during rollout
- [ ] Old version still available for rollback

---

#### 5.4 Deploy Mobile App (Gradual Rollout)

**iOS - App Store (Phased Release):**
```bash
# Submit to App Store
eas submit --platform ios --profile production

# Configure phased release in App Store Connect
# Day 1: 1% of users
# Day 2: 2% of users
# Day 3: 5% of users
# Day 4: 10% of users
# Day 5: 20% of users
# Day 6: 50% of users
# Day 7: 100% of users
```

**Android - Google Play (Staged Rollout):**
```bash
# Submit to Google Play
eas submit --platform android --profile production

# Configure staged rollout in Google Play Console
# Day 1: 10% of users
# Day 2: 25% of users
# Day 3: 50% of users
# Day 4: 100% of users
```

**Rollout Monitoring:**
- [ ] Crash rate <0.5%
- [ ] Error rate <1%
- [ ] User reviews >4.0 stars
- [ ] Support tickets normal
- [ ] No critical bugs reported

**If issues detected:**
- Pause rollout
- Investigate issue
- Fix or rollback
- Resume rollout when stable

**Deliverables:**
- [ ] Mobile app submitted
- [ ] Gradual rollout configured
- [ ] Initial rollout successful
- [ ] Monitoring active

---

#### 5.5 Tag Release

```bash
# Create git tag
git checkout release/v1.6.0
git tag -a v1.6.0 -m "Release v1.6.0: Notification Preferences & Contact Tagging

Features:
- Notification preferences screen
- Contact tagging system
- Message scheduling improvements

Bug Fixes:
- Fixed contact delete crash
- Fixed search performance
- Fixed iPad layout issues

See CHANGELOG.md for full details."

git push origin v1.6.0

# Create GitHub release
gh release create v1.6.0 \
  --title "v1.6.0: Notification Preferences & Contact Tagging" \
  --notes-file RELEASE_NOTES.md \
  --draft=false \
  --prerelease=false
```

**Deliverables:**
- [ ] Git tag created
- [ ] GitHub release published
- [ ] Release notes attached

---

## Phase 6: Post-Deployment Monitoring

### Objective
Monitor production for issues and verify successful deployment.

### Responsible Agent
**DevOps / Tech Lead / On-Call Engineer**

### Steps

#### 6.1 Monitor Key Metrics (First 24 Hours)

**Application Metrics:**
```bash
# Error rate
SELECT COUNT(*) FROM errors WHERE created_at > NOW() - INTERVAL '1 hour';

# API response times
SELECT percentile_cont(0.95) WITHIN GROUP (ORDER BY response_time)
FROM api_logs WHERE created_at > NOW() - INTERVAL '1 hour';

# Active users
SELECT COUNT(DISTINCT user_id) FROM sessions
WHERE created_at > NOW() - INTERVAL '1 hour';
```

**Mobile App Metrics:**
- [ ] Crash rate: <0.5% (target: <0.2%)
- [ ] ANR rate: <0.1% (Android)
- [ ] App launch time: <2s
- [ ] Screen load time: <500ms
- [ ] API error rate: <1%

**Backend Metrics:**
- [ ] API response time p95: <200ms
- [ ] API response time p99: <500ms
- [ ] Error rate: <1%
- [ ] CPU usage: <70%
- [ ] Memory usage: <80%
- [ ] Request throughput: normal

**Database Metrics:**
- [ ] Query performance p95: <100ms
- [ ] Connection pool usage: <80%
- [ ] CPU usage: <70%
- [ ] Disk I/O: normal
- [ ] Replication lag: <1s

**Deliverables:**
- [ ] All metrics within acceptable range
- [ ] No critical alerts triggered
- [ ] System stable

---

#### 6.2 Monitor User Feedback

**App Store Reviews:**
- Monitor for 1-star reviews mentioning bugs
- Respond to user concerns
- Escalate critical issues

**Support Tickets:**
- Track volume of support requests
- Identify common issues
- Escalate trends to engineering

**Social Media:**
- Monitor Twitter, Reddit for mentions
- Track sentiment
- Respond to user concerns

**In-App Feedback:**
- Review user-submitted feedback
- Categorize issues
- Prioritize fixes

**Deliverables:**
- [ ] User feedback monitored
- [ ] Issues categorized
- [ ] Critical issues escalated

---

#### 6.3 Verify Feature Adoption

**Track usage of new features:**
```sql
-- Notification preferences usage
SELECT
  COUNT(DISTINCT user_id) AS users_who_changed_prefs,
  COUNT(*) AS total_changes
FROM notification_preferences
WHERE updated_at > '2025-02-01';

-- Contact tagging usage
SELECT
  COUNT(DISTINCT user_id) AS users_with_tags,
  COUNT(*) AS total_tags_created
FROM contact_tags
WHERE created_at > '2025-02-01';
```

**Feature Adoption Targets:**
- Day 1: 5% of active users
- Week 1: 20% of active users
- Week 4: 50% of active users

**Deliverables:**
- [ ] Adoption metrics tracked
- [ ] Targets on track or exceeded
- [ ] Low adoption features identified for improvement

---

#### 6.4 Complete Rollout

**After 7 days of stable release:**

**Mobile App:**
```bash
# iOS - Complete phased release
# App Store Connect → Versions → Phased Release → Complete Release

# Android - Complete staged rollout
# Google Play Console → Release → Production → Complete Rollout
```

**Backend:**
```bash
# Remove old deployment
kubectl delete deployment api-server-v1.5.0

# Update main branch
git checkout main
git merge release/v1.6.0
git push origin main

# Delete release branch (optional)
git branch -d release/v1.6.0
git push origin --delete release/v1.6.0
```

**Deliverables:**
- [ ] 100% rollout complete
- [ ] Old versions cleaned up
- [ ] Main branch updated

---

## Phase 7: Post-Release Activities

### Objective
Communicate success, gather learnings, and plan next release.

### Steps

#### 7.1 Communicate Release Success

**Internal Announcement:**
```
#general channel:
"🎉 v1.6.0 Released to Production!

Features:
✅ Notification preferences
✅ Contact tagging
✅ Message scheduling improvements

Bug Fixes:
✅ Contact delete crash fixed
✅ Search performance improved
✅ iPad layouts fixed

Metrics:
- Crash rate: 0.15% (below target)
- Error rate: 0.5% (below target)
- User adoption: 12% (day 1)

Thanks to the entire team for a smooth release!

Full release notes: [link]"
```

**External Announcement:**
```
Blog Post: "What's New in RelaAI v1.6.0"
- Feature highlights
- Screenshots
- User benefits
- How to update

Social Media:
"📱 RelaAI v1.6.0 is here!

✨ Customize notification preferences
🏷️ Organize contacts with tags
⏰ Better message scheduling

Update now: [App Store / Play Store links]"
```

**Deliverables:**
- [ ] Internal team notified
- [ ] Users notified
- [ ] Blog post published
- [ ] Social media updated

---

#### 7.2 Release Retrospective

**Hold retrospective meeting (1 week after release):**

**Retrospective Template:**
```markdown
# v1.6.0 Release Retrospective

## Participants
- Tech Lead
- Database Agent
- UI Designer
- QA Agent
- DevOps

## Release Summary
- **Timeline:** 3 weeks (planned: 3 weeks) ✅
- **Quality:** 0 P0 bugs, 2 P1 bugs (fixed) ✅
- **Deployment:** Smooth, no rollbacks ✅
- **User Reception:** Positive (4.5 stars) ✅

## What Went Well
- Feature freeze discipline maintained
- Comprehensive QA testing caught critical bugs
- Gradual rollout prevented issues from affecting all users
- Database migrations went smoothly
- Team collaboration was excellent
- Communication was clear and timely

## What Didn't Go Well
- Contact delete bug found late in testing (should've been caught earlier)
- Performance regression in search (fixed before release)
- iPad testing happened too late in cycle
- Documentation updates delayed until last minute

## Action Items
1. [ ] Add contact deletion to standard test checklist
2. [ ] Add automated performance regression tests
3. [ ] Test all device sizes earlier in cycle
4. [ ] Update documentation concurrently with features
5. [ ] Improve staging environment to better match production
6. [ ] Add more E2E tests for critical flows

## Lessons Learned
- Testing on all devices early prevents last-minute scrambles
- Feature freeze discipline is critical for quality
- Gradual rollouts give us time to catch issues
- Good documentation makes deployment smoother
- Communication prevents surprises

## Next Release (v1.7.0)
- Planned features: [list]
- Target date: March 1, 2025
- Key improvements: Better testing, earlier device testing
```

**Deliverables:**
- [ ] Retrospective held
- [ ] Action items assigned
- [ ] Lessons documented
- [ ] Improvements planned

---

#### 7.3 Update Documentation

**Documentation to Update:**

**README.md:**
```markdown
## Installation

Download RelaAI v1.6.0:
- iOS: [App Store link]
- Android: [Play Store link]

## What's New

See [CHANGELOG.md](CHANGELOG.md) for release notes.
```

**CHANGELOG.md:**
```markdown
## [1.6.0] - 2025-02-01
[Already done in Phase 2.3]
```

**API Documentation:**
```markdown
## API Version: 1.6.0

### New Endpoints
- `GET /api/notification-preferences` - Get user notification preferences
- `PUT /api/notification-preferences` - Update notification preferences
- `GET /api/tags` - List user tags
- `POST /api/tags` - Create new tag
```

**Migration Guide (if breaking changes):**
```markdown
# Migration Guide: v1.5.x to v1.6.0

## Breaking Changes
None

## Deprecations
- `/api/v1/contacts` - Use `/api/v2/contacts` instead
- Will be removed in v2.0.0

## New Features
- Notification preferences API
- Contact tagging API
```

**Deliverables:**
- [ ] README updated
- [ ] CHANGELOG current
- [ ] API docs updated
- [ ] Migration guide published (if needed)

---

#### 7.4 Plan Next Release

**Create v1.7.0 milestone:**
```bash
# Create milestone
gh milestone create "v1.7.0" --due-date "2025-03-01" --description "Next minor release"

# Move deferred issues to v1.7.0
gh issue edit 145 --milestone "v1.7.0"
gh issue edit 167 --milestone "v1.7.0"

# Review backlog
gh issue list --milestone "v1.7.0"
```

**Deliverables:**
- [ ] Next release planned
- [ ] Milestone created
- [ ] Backlog groomed
- [ ] Timeline communicated

---

## Rollback Procedures

### When to Rollback

**Rollback if:**
- Crash rate >2%
- Error rate >5%
- Critical feature completely broken
- Data loss or corruption
- Security vulnerability introduced
- User outcry is significant

**DON'T Rollback if:**
- Minor bugs (fix forward instead)
- Cosmetic issues
- Issues affecting <1% of users
- Issues with easy workarounds

---

### Rollback Steps

**Backend Rollback:**
```bash
# 1. Redirect traffic to old version
kubectl patch service api-server -p '{"spec":{"selector":{"version":"1.5.0"}}}'

# 2. Verify old version working
curl https://api.relaai.com/health
curl https://api.relaai.com/version

# 3. Rollback database (if necessary)
psql -h prod-db.supabase.co -d postgres < backups/rollback_v1.6.0.sql

# 4. Monitor metrics
```

**Mobile App Rollback:**
```bash
# iOS - Pause rollout, submit 1.5.0 as urgent fix
eas submit --platform ios --profile production

# Android - Halt rollout, promote 1.5.0
# Google Play Console → Release → Production → Halt Rollout
```

**Communication During Rollback:**
```
"We've identified an issue with v1.6.0 and are rolling back to v1.5.0
while we investigate. Users may experience brief service interruption.
We'll provide updates as we have them."
```

---

## Hotfix Release Process

**For critical production issues that can't wait for next release:**

### Hotfix Workflow (Abbreviated)

```bash
# 1. Create hotfix branch from production tag
git checkout v1.6.0
git checkout -b hotfix/v1.6.1

# 2. Fix the critical bug (minimal changes only)
# ... make fix ...

# 3. Test thoroughly
npm test

# 4. Update version to 1.6.1
# Update package.json, Info.plist, build.gradle

# 5. Deploy immediately
git tag v1.6.1
git push origin v1.6.1

# 6. Deploy to production (skip staging if truly urgent)
./scripts/deploy-production.sh

# 7. Merge hotfix back to main
git checkout main
git merge hotfix/v1.6.1
git push origin main
```

**Hotfix Timeline:** <24 hours from discovery to production

---

## Example: v1.6.0 Minor Release

**Timeline:**

**Week 1 (Jan 15-19): Development**
- Features developed: Notification preferences, Contact tagging
- Database migrations created
- UI components implemented
- Unit tests written

**Week 2 (Jan 22-26): Feature Freeze & Testing**
- Monday: Feature freeze, release branch created
- Tuesday-Thursday: Full QA testing
- Friday: Bug fixes

**Week 3 (Jan 29 - Feb 2): Deployment**
- Monday: Staging deployment
- Tuesday-Wednesday: Staging validation
- Thursday: Production deployment starts (10% rollout)
- Friday: 50% rollout, monitoring

**Week 4 (Feb 5-9): Completion**
- Monday: 100% rollout complete
- Tuesday: All metrics stable
- Wednesday: Release retrospective
- Thursday: v1.7.0 planning begins

**Result:** Successful release, no rollbacks, positive user feedback

---

## Success Indicators

- [ ] Released on schedule
- [ ] Zero rollbacks required
- [ ] Crash rate within target (<0.5%)
- [ ] Error rate within target (<1%)
- [ ] Performance targets met
- [ ] User feedback positive
- [ ] Feature adoption >20% (week 1)
- [ ] Support ticket volume normal
- [ ] Team morale high
- [ ] Lessons learned documented

---

**Remember:** A good release is boring - no drama, no surprises, just steady progress and happy users!
