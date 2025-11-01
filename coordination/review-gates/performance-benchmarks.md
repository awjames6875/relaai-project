# Performance Benchmarks

This document defines performance targets and benchmarking procedures for the RelaAI project.

**Purpose:** Ensure the app meets performance standards before release.

---

## Performance Philosophy

**Key Principles:**
1. **User-First:** Performance impacts user experience directly
2. **Measure, Don't Guess:** Use data to make decisions
3. **Budget-Based:** Set budgets and stay within them
4. **Continuous:** Monitor performance in development and production
5. **Platform-Specific:** iOS and Android have different performance characteristics

---

## Mobile App Performance Benchmarks

### App Launch Time

#### Cold Start (App not in memory)
- **Target:** <3 seconds (from tap to interactive)
- **Maximum Acceptable:** 5 seconds
- **Measurement:** Time from app icon tap to first meaningful paint

**How to Measure:**
```bash
# iOS - Xcode Instruments
# Use "Time Profiler" and "App Launch" template

# Android - ADB
adb shell am start -W com.relaai/.MainActivity
# Look for "TotalTime" value
```

**Optimization Checklist:**
- [ ] Minimize JavaScript bundle size
- [ ] Use lazy loading for non-critical screens
- [ ] Defer heavy initializations
- [ ] Use native splash screen
- [ ] Optimize image loading

---

#### Warm Start (App in background)
- **Target:** <1 second
- **Maximum Acceptable:** 2 seconds
- **Measurement:** Time from app resume to interactive

---

### Screen Render Time

#### Initial Screen Render
- **Target:** <500ms
- **Maximum Acceptable:** 1 second
- **Measurement:** Time from navigation to screen interactive

**How to Measure:**
```typescript
const startTime = performance.now();
navigation.navigate('NotificationList');

// In NotificationListScreen useEffect
useEffect(() => {
  const endTime = performance.now();
  console.log(`Render time: ${endTime - startTime}ms`);
}, []);
```

---

#### Screen Transition Animation
- **Target:** 60 FPS (16.67ms per frame)
- **Maximum Acceptable:** 30 FPS (33.33ms per frame)
- **Measurement:** Frame rate during screen transitions

**How to Measure:**
- iOS: Xcode Instruments > Core Animation (FPS meter)
- Android: Enable "GPU Rendering" in Developer Options
- React Native: Performance Monitor (CMD+D > Show Perf Monitor)

---

### List Scrolling Performance

#### FlatList Scrolling
- **Target:** 60 FPS (smooth scrolling)
- **Maximum Acceptable:** 50 FPS (minor jank acceptable)
- **Measurement:** Frame rate while scrolling through 100+ items

**Optimization Checklist:**
- [ ] Use FlatList (not ScrollView with .map())
- [ ] Set `keyExtractor` prop
- [ ] Set `getItemLayout` for fixed-height items
- [ ] Use `windowSize` prop (default 21)
- [ ] Enable `removeClippedSubviews` for long lists
- [ ] Use React.memo on list item components
- [ ] Avoid inline functions in renderItem

**How to Measure:**
```bash
# React Native Performance Monitor
# Open in-app: CMD+D > Show Perf Monitor
# Look for "JS FPS" and "UI FPS" while scrolling
```

**Acceptable FPS Values:**
- **60 FPS:** Perfect, smooth scrolling
- **50-59 FPS:** Minor jank, acceptable
- **30-49 FPS:** Noticeable lag, needs optimization
- **<30 FPS:** Unusable, must fix

---

### Image Loading Performance

#### Image Load Time
- **Target:** <500ms for thumbnail images (<100KB)
- **Target:** <2 seconds for full-size images (<500KB)
- **Maximum Acceptable:** 5 seconds

**Optimization Checklist:**
- [ ] Use optimized image formats (WebP on Android)
- [ ] Implement progressive image loading
- [ ] Use cached images (react-native-fast-image)
- [ ] Lazy load images outside viewport
- [ ] Use appropriate image sizes (don't load 4K for thumbnail)

---

### Memory Usage

#### Baseline Memory
- **Target:** <100MB at app launch
- **Maximum Acceptable:** 150MB

#### Active Usage Memory
- **Target:** <200MB during normal use
- **Maximum Acceptable:** 300MB

#### Memory Leaks
- **Target:** Zero memory leaks
- **Maximum Acceptable:** <5MB increase per hour

**How to Measure:**
```bash
# iOS - Xcode Instruments
# Use "Allocations" and "Leaks" templates

# Android - Android Studio Profiler
# Use "Memory Profiler" tab
```

**Memory Leak Test:**
1. Launch app and note baseline memory
2. Navigate through all screens 10 times
3. Return to home screen
4. Wait 30 seconds for GC
5. Check memory usage
6. **Pass:** Memory returns close to baseline
7. **Fail:** Memory significantly higher (leak detected)

---

## API Performance Benchmarks

### API Response Time

#### Read Operations (GET requests)
- **Target:** <200ms (p95)
- **Maximum Acceptable:** 500ms (p95)

**Endpoints:**
- `GET /api/notifications` - <200ms
- `GET /api/contacts` - <200ms
- `GET /api/messages` - <200ms
- `GET /api/contacts/:id` - <100ms (single record)

---

#### Write Operations (POST/PATCH/DELETE)
- **Target:** <300ms (p95)
- **Maximum Acceptable:** 1 second (p95)

**Endpoints:**
- `POST /api/contacts` - <300ms
- `PATCH /api/contacts/:id` - <300ms
- `DELETE /api/contacts/:id` - <200ms
- `POST /api/messages/generate` - <2 seconds (AI call)

---

#### Search Operations
- **Target:** <500ms (p95)
- **Maximum Acceptable:** 1 second (p95)

**Endpoints:**
- `GET /api/contacts?search=query` - <500ms
- `GET /api/messages?filter=status` - <300ms

---

### API Throughput
- **Target:** 100 requests/second per endpoint
- **Maximum Acceptable:** 50 requests/second

**How to Measure:**
```bash
# Using Apache Bench
ab -n 1000 -c 10 https://api.relaai.com/api/notifications

# Look for "Requests per second" metric
```

---

## Database Performance Benchmarks

### Query Performance

#### Single Row Fetch
- **Target:** <10ms (p95)
- **Maximum Acceptable:** 50ms

**Example:**
```sql
SELECT * FROM notifications WHERE id = $1;
```

---

#### List Query (20 items)
- **Target:** <50ms (p95)
- **Maximum Acceptable:** 100ms

**Example:**
```sql
SELECT * FROM notifications
WHERE user_id = $1
  AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 20;
```

---

#### Search Query
- **Target:** <100ms (p95)
- **Maximum Acceptable:** 500ms

**Example:**
```sql
SELECT * FROM full_text_search_contacts($1, $2)
LIMIT 20;
```

---

#### Aggregation Query
- **Target:** <200ms (p95)
- **Maximum Acceptable:** 1 second

**Example:**
```sql
SELECT
  COUNT(*) AS total_contacts,
  AVG(health_score) AS avg_health
FROM relationships
WHERE user_id = $1;
```

---

### Connection Pool
- **Target:** <50 active connections
- **Maximum Acceptable:** 100 active connections

**How to Measure:**
```sql
SELECT count(*) FROM pg_stat_activity
WHERE state = 'active';
```

---

### Row Level Security (RLS) Overhead
- **Target:** <5ms overhead per query
- **Maximum Acceptable:** 10ms overhead

**How to Measure:**
```sql
-- Without RLS
EXPLAIN ANALYZE
SELECT * FROM contacts WHERE user_id = $1;

-- With RLS enabled
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
EXPLAIN ANALYZE
SELECT * FROM contacts; -- RLS filter applied automatically

-- Compare execution times
```

---

## Bundle Size Benchmarks

### JavaScript Bundle Size

#### Total Bundle Size
- **Target:** <5MB
- **Maximum Acceptable:** 10MB

#### Per-Platform Bundle
- **iOS Target:** <3MB
- **Android Target:** <3MB

**How to Measure:**
```bash
# Build production bundle
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output ios-bundle.js

# Check size
ls -lh ios-bundle.js
```

---

### Code Splitting
- **Initial Load:** <1MB (critical path only)
- **Lazy Loaded:** <500KB per screen

**Optimization Checklist:**
- [ ] Use dynamic imports for screens
- [ ] Lazy load images and videos
- [ ] Remove unused dependencies
- [ ] Use tree shaking
- [ ] Minimize vendor bundle

---

## Network Performance Benchmarks

### Network Conditions

#### WiFi (Baseline)
- All targets assume WiFi connection

#### 4G (Good Mobile)
- Acceptable degradation: +50% time
- Example: 200ms API call → 300ms on 4G

#### 3G (Slow Mobile)
- Acceptable degradation: +200% time
- Example: 200ms API call → 600ms on 3G
- Must show loading indicators

#### Offline
- App must remain functional with cached data
- Must show offline indicator
- Must queue operations for retry

---

### Network Request Optimization
- **Target:** <10 network requests per screen load
- **Maximum Acceptable:** 20 network requests

**Optimization Checklist:**
- [ ] Batch API requests where possible
- [ ] Use GraphQL for flexible data fetching
- [ ] Implement pagination (don't fetch all data)
- [ ] Cache responses (use SWR or React Query)
- [ ] Prefetch data for likely next actions

---

## Animation Performance Benchmarks

### Animation FPS
- **Target:** 60 FPS
- **Maximum Acceptable:** 30 FPS

**Animations to Benchmark:**
- Screen transitions
- Pull-to-refresh
- Swipe-to-delete
- Modal open/close
- Tab switching
- Loading skeletons

**Optimization Checklist:**
- [ ] Use native animations (Animated.native)
- [ ] Use Reanimated for complex animations
- [ ] Avoid animating layout properties
- [ ] Animate transform and opacity only
- [ ] Use `useNativeDriver: true`

---

## Battery Performance Benchmarks

### Battery Drain
- **Target:** <5% battery per hour of active use
- **Maximum Acceptable:** 10% battery per hour

**How to Measure:**
```bash
# iOS - Xcode Instruments
# Use "Energy Log" template

# Android - Battery Historian
adb shell dumpsys batterystats --reset
# Use app for 1 hour
adb shell dumpsys batterystats > battery-stats.txt
```

**Optimization Checklist:**
- [ ] Minimize location service usage
- [ ] Batch network requests
- [ ] Use background task scheduling
- [ ] Avoid unnecessary wake locks
- [ ] Optimize image rendering

---

## Performance Testing Tools

### React Native Tools
- **Performance Monitor:** In-app FPS and memory monitor
- **React DevTools Profiler:** Component render analysis
- **Flipper:** Network, database, and performance debugging

### iOS Tools
- **Xcode Instruments:** CPU, memory, battery profiling
- **Time Profiler:** Identify slow functions
- **Allocations:** Track memory usage
- **Leaks:** Detect memory leaks
- **Energy Log:** Battery drain analysis

### Android Tools
- **Android Studio Profiler:** CPU, memory, network, battery
- **Systrace:** System-wide performance tracing
- **GPU Rendering:** Frame rate analysis
- **Battery Historian:** Battery usage over time

### API Tools
- **Apache Bench (ab):** Load testing
- **wrk:** Modern load testing tool
- **Postman:** API testing and monitoring
- **New Relic / Datadog:** Production monitoring

### Database Tools
- **EXPLAIN ANALYZE:** Query performance analysis
- **pg_stat_statements:** Track query statistics
- **PgHero:** PostgreSQL performance dashboard

---

## Performance Budgets

### Time-Based Budgets

| Metric | Target | Max | Measurement |
|--------|--------|-----|-------------|
| Cold App Launch | <3s | 5s | Time to interactive |
| Screen Render | <500ms | 1s | Navigation to ready |
| API Response | <200ms | 500ms | p95 latency |
| DB Query | <100ms | 500ms | p95 latency |
| Animation FPS | 60 | 30 | Frames per second |

---

### Size-Based Budgets

| Metric | Target | Max | Measurement |
|--------|--------|-----|-------------|
| JS Bundle Size | <5MB | 10MB | Total bundle |
| Initial Bundle | <1MB | 2MB | Critical path |
| Memory Usage | <200MB | 300MB | Active use |
| Image Size | <100KB | 500KB | Per image |
| API Payload | <50KB | 200KB | Per response |

---

## Performance Testing Checklist

### Before Every Release
- [ ] App launch time measured
- [ ] Screen render times measured
- [ ] List scrolling FPS checked
- [ ] Memory leaks tested
- [ ] API response times checked
- [ ] Database query performance verified
- [ ] Bundle size analyzed
- [ ] Network performance tested (WiFi/4G/3G/Offline)
- [ ] Battery drain measured
- [ ] Animation FPS checked

---

### Performance Regression Detection
- [ ] Benchmark current main branch
- [ ] Benchmark feature branch
- [ ] Compare results
- [ ] Investigate >10% degradation
- [ ] Block merge if >25% degradation

**Example:**
```bash
# Benchmark main
git checkout main
npm run benchmark > main-results.json

# Benchmark feature
git checkout feature/notifications
npm run benchmark > feature-results.json

# Compare
npm run benchmark:compare main-results.json feature-results.json
```

---

## Performance Monitoring in Production

### Metrics to Track
- [ ] App crash rate (<1%)
- [ ] ANR rate (<0.1%) - Android
- [ ] Memory usage (avg, p95, p99)
- [ ] API response times (avg, p95, p99)
- [ ] Database query times (avg, p95, p99)
- [ ] Error rate (<1%)
- [ ] User satisfaction (>4.0 stars)

### Alerting Thresholds
- 🟢 **Green:** All metrics within targets
- 🟡 **Yellow:** Metrics within max acceptable
- 🔴 **Red:** Metrics exceed max acceptable

**Alert on:**
- API p95 >500ms for 5 minutes
- Database p95 >500ms for 5 minutes
- Crash rate >1% for 1 hour
- Memory usage >300MB for >50% of users

---

## Performance Optimization Priorities

### Priority 1 - Critical
Issues that block user actions or cause crashes:
- App crashes
- ANRs (Android)
- API timeouts
- Memory leaks

### Priority 2 - High
Issues that significantly degrade UX:
- Slow screen loads (>1s)
- Laggy scrolling (<30 FPS)
- Slow API responses (>500ms)

### Priority 3 - Medium
Issues that cause minor UX degradation:
- Slightly slow loads (500ms-1s)
- Minor jank (30-50 FPS)
- Moderate API times (200-500ms)

### Priority 4 - Low
Optimizations for marginal gains:
- Bundle size reduction
- Micro-optimizations
- Nice-to-have improvements

---

## Conclusion

**Performance is a Feature** - treat it as seriously as functionality.

**Measure Continuously** - performance degrades over time without monitoring.

**Optimize Wisely** - focus on user-perceived performance first.

**Stay Within Budgets** - set budgets and enforce them in CI/CD.

---

**Performance Champion:** _______________
**Last Updated:** _______________
**Next Review:** _______________
