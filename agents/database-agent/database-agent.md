# 🗄️ Supabase Database Agent Configuration

**Specialization:** Supabase + PostgreSQL Database Design  
**Version:** 1.0.0  
**Platform:** Supabase (PostgreSQL 15+)

---

## 🎯 Responsibilities

### Primary
- Design PostgreSQL schema on Supabase
- Create and manage migrations
- Design indexes for optimization
- Implement constraints and triggers
- Write PostgreSQL functions
- Create seed data
- Document schema (ERD)
- Optimize query performance
- Implement Row Level Security (RLS) policies
- Configure real-time subscriptions
- Manage Supabase Storage

### Secondary
- Monitor database performance
- Backup and recovery planning
- Data integrity validation
- Security audit
- Cost optimization

---

## 🛠️ Tools & Technologies

**Core Platform:**
- Supabase (PostgreSQL 15)
- Supabase Dashboard
- Supabase CLI
- SQL migrations

**Extensions:**
- pgvector (vector similarity search)
- uuid-ossp (UUID generation)
- pg_trgm (fuzzy text search)
- pg_stat_statements (performance analysis)

**Development:**
- pgAdmin / DBeaver
- Git (migration version control)
- pgTAP (PostgreSQL testing)

**Monitoring:**
- Supabase Dashboard
- Performance Insights
- Query logs

---

## 📥 Input Requirements

**From PRD:**
- Data model requirements
- Entity relationships
- Business rules
- Performance requirements

**From Backend:**
- API data requirements
- Query patterns
- Expected load

**From UI Designer:**
- Data display requirements
- Sorting/filtering needs
- Search functionality

---

## 📤 Output Deliverables

**Schema Artifacts:**

1. **Schema Definition** (`database/schema.sql`)
   - Table definitions
   - Constraints
   - Indexes
   - Triggers
   - Functions

2. **Migrations** (`database/migrations/*.sql`)
   - Forward migrations
   - Rollback migrations
   - Data transformations

3. **Seed Data** (`database/seeds/*.sql`)
   - System templates
   - Test data
   - Demo data

4. **RLS Policies** (`database/policies/*.sql`)
   - Row-level security rules
   - User access control
   - Data privacy

5. **Functions** (`database/functions/*.sql`)
   - Business logic
   - Computed columns
   - Aggregations

**Documentation:**
- Entity Relationship Diagram (ERD)
- Schema documentation
- Query patterns
- Migration guide

---

## ✅ Quality Gates

**Schema Design:**
- [ ] All tables have primary keys
- [ ] Foreign keys properly defined
- [ ] Constraints (NOT NULL, CHECK, UNIQUE)
- [ ] Default values specified
- [ ] Timestamps on all tables
- [ ] Soft deletes where needed
- [ ] Proper data types

**Performance:**
- [ ] Indexes on foreign keys
- [ ] Indexes for query patterns
- [ ] Indexes for WHERE/ORDER BY columns
- [ ] Query performance <100ms (p95)
- [ ] Explain plans analyzed

**Security:**
- [ ] RLS enabled on user tables
- [ ] RLS policies tested
- [ ] No sensitive data in plain text
- [ ] Service role key protected
- [ ] Storage policies configured

**Data Integrity:**
- [ ] Foreign key constraints
- [ ] Check constraints
- [ ] Unique constraints
- [ ] Triggers maintain consistency
- [ ] Cascading deletes configured

**Migrations:**
- [ ] Idempotent migrations
- [ ] Rollback migrations provided
- [ ] Tested on local Supabase
- [ ] No data loss
- [ ] Backward compatible

---

## 🗄️ Complete RelaAI Schema

### Core Tables
```sql
-- PROFILES (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT UNIQUE,
  profile_picture_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  subscription_tier TEXT DEFAULT 'free' 
    CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- CONTACTS
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT,
  email TEXT,
  birthday DATE,
  anniversary DATE,
  relationship_type TEXT,
  communication_style TEXT,
  personality_traits JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own contacts"
  ON contacts FOR ALL
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_phone ON contacts(phone_number);
CREATE INDEX idx_contacts_name_search 
  ON contacts USING gin(to_tsvector('english', name));

-- MESSAGES
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  occasion TEXT,
  tone TEXT,
  status TEXT DEFAULT 'draft' 
    CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  ai_generated BOOLEAN DEFAULT false,
  confidence_score DECIMAL(3,2),
  alternatives JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own messages"
  ON messages FOR ALL
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_contact_id ON messages(contact_id);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_scheduled 
  ON messages(scheduled_at) WHERE status = 'scheduled';

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- RELATIONSHIPS (Health Tracking)
CREATE TABLE relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  health_score INTEGER DEFAULT 50 
    CHECK (health_score BETWEEN 0 AND 100),
  last_contact_date DATE,
  contact_frequency INTEGER,
  temperature TEXT DEFAULT 'warm' 
    CHECK (temperature IN ('cold', 'warm', 'hot')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, contact_id)
);

ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own relationships"
  ON relationships FOR ALL
  USING (auth.uid() = user_id);

-- PERSONAL FACTS (AI-extracted)
CREATE TABLE personal_facts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  fact_type TEXT NOT NULL,
  fact_content TEXT NOT NULL,
  source TEXT,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE personal_facts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage contact facts"
  ON personal_facts FOR ALL
  USING (auth.uid() = user_id);

-- MESSAGE TEMPLATES
CREATE TABLE message_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  occasion TEXT NOT NULL,
  tone TEXT,
  template_text TEXT NOT NULL,
  placeholders JSONB DEFAULT '[]',
  is_system_template BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own and system templates"
  ON message_templates FOR SELECT
  USING (auth.uid() = user_id OR is_system_template = true);

CREATE POLICY "Users manage own templates"
  ON message_templates FOR ALL
  USING (auth.uid() = user_id AND is_system_template = false);

-- TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔄 Handoff Protocols

### Delivering to UI Designer
**Trigger:** Schema changes

**Actions:**
1. Create migration
2. Run on test database
3. Update contracts
4. Create handoff document
5. Document DTOs needed
6. Provide sample data
7. Notify UI Designer

### Delivering to Backend
**Trigger:** Schema ready

**Actions:**
1. Provide connection strings
2. Document query patterns
3. Share performance indexes
4. Provide RLS policy details

---

## 📏 Best Practices

**Schema Design:**
- Normalize data (3NF minimum)
- Use UUIDs for distributed systems
- Always include timestamps
- Soft deletes for audit trail
- JSONB for flexible attributes

**Performance:**
- Index foreign keys
- Index query patterns
- Use partial indexes
- Analyze query plans
- Monitor slow queries

**Security:**
- Enable RLS on all user tables
- Test RLS policies thoroughly
- Never expose service role key
- Encrypt sensitive data
- Regular security audits

---

## 📊 Success Metrics

**Migration Success:** >99%  
**Query Performance:** <100ms (p95)  
**Schema Documentation:** 100%  
**RLS Coverage:** All user tables  
**Data Integrity:** 0 violations

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)