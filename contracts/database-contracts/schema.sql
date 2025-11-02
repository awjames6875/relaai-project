-- =================================================================
-- RelaAI Complete Database Schema for Supabase (PostgreSQL 15+)
-- =================================================================
-- 
-- This schema includes:
-- - All tables with proper constraints
-- - Row Level Security (RLS) policies
-- - Indexes for performance
-- - Triggers for automation
-- - Functions for business logic
--
-- =================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =================================================================
-- PROFILES TABLE (extends Supabase Auth)
-- =================================================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT UNIQUE,
  profile_picture_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  subscription_tier TEXT DEFAULT 'free' 
    CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' 
    CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_subscription ON profiles(subscription_tier, subscription_status);

-- =================================================================
-- CONTACTS TABLE
-- =================================================================

CREATE TABLE contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT,
  email TEXT,
  birthday DATE,
  anniversary DATE,
  relationship_type TEXT,
  communication_style TEXT,
  personality_traits JSONB DEFAULT '{}',
  favorite_things JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$' OR email IS NULL),
  CONSTRAINT valid_phone CHECK (phone_number ~* '^\+?[1-9]\d{1,14}$' OR phone_number IS NULL)
);

-- RLS Policies
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own contacts"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts"
  ON contacts FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_phone ON contacts(phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX idx_contacts_email ON contacts(email) WHERE email IS NOT NULL;
CREATE INDEX idx_contacts_birthday ON contacts(birthday) WHERE birthday IS NOT NULL;
CREATE INDEX idx_contacts_anniversary ON contacts(anniversary) WHERE anniversary IS NOT NULL;
CREATE INDEX idx_contacts_deleted ON contacts(deleted_at) WHERE deleted_at IS NULL;

-- Full-text search index
CREATE INDEX idx_contacts_name_search 
  ON contacts USING gin(to_tsvector('english', name));

-- =================================================================
-- MESSAGES TABLE
-- =================================================================

CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_confidence CHECK (confidence_score >= 0 AND confidence_score <= 1),
  CONSTRAINT scheduled_future CHECK (scheduled_at IS NULL OR scheduled_at > created_at),
  CONSTRAINT sent_after_created CHECK (sent_at IS NULL OR sent_at >= created_at)
);

-- RLS Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_contact_id ON messages(contact_id);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_scheduled ON messages(scheduled_at) 
  WHERE status = 'scheduled' AND scheduled_at IS NOT NULL;
CREATE INDEX idx_messages_sent ON messages(sent_at) 
  WHERE status = 'sent' AND sent_at IS NOT NULL;
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- Enable real-time for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- =================================================================
-- RELATIONSHIPS TABLE (Health Tracking)
-- =================================================================

CREATE TABLE relationships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  health_score INTEGER DEFAULT 50 
    CHECK (health_score BETWEEN 0 AND 100),
  last_contact_date DATE,
  contact_frequency INTEGER, -- days between contacts
  temperature TEXT DEFAULT 'warm' 
    CHECK (temperature IN ('cold', 'warm', 'hot')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one relationship per contact
  UNIQUE(user_id, contact_id)
);

-- RLS Policies
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own relationships"
  ON relationships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own relationships"
  ON relationships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own relationships"
  ON relationships FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own relationships"
  ON relationships FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_relationships_user_id ON relationships(user_id);
CREATE INDEX idx_relationships_contact_id ON relationships(contact_id);
CREATE INDEX idx_relationships_health_score ON relationships(health_score);
CREATE INDEX idx_relationships_temperature ON relationships(temperature);
CREATE INDEX idx_relationships_last_contact ON relationships(last_contact_date);

-- =================================================================
-- PERSONAL FACTS TABLE (AI-extracted)
-- =================================================================

CREATE TABLE personal_facts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  fact_type TEXT NOT NULL 
    CHECK (fact_type IN ('hobby', 'preference', 'life_event', 'personality', 'other')),
  fact_content TEXT NOT NULL,
  source TEXT CHECK (source IN ('conversation', 'manual_entry', 'ai_inference')),
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_fact_confidence CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

-- RLS Policies
ALTER TABLE personal_facts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contact facts"
  ON personal_facts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contact facts"
  ON personal_facts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contact facts"
  ON personal_facts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contact facts"
  ON personal_facts FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_personal_facts_contact_id ON personal_facts(contact_id);
CREATE INDEX idx_personal_facts_fact_type ON personal_facts(fact_type);
CREATE INDEX idx_personal_facts_user_id ON personal_facts(user_id);

-- =================================================================
-- MESSAGE TEMPLATES TABLE
-- =================================================================

CREATE TABLE message_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  occasion TEXT NOT NULL 
    CHECK (occasion IN ('birthday', 'anniversary', 'casual', 'apology', 'thankyou', 'congratulations')),
  tone TEXT CHECK (tone IN ('formal', 'casual', 'humorous', 'heartfelt', 'professional')),
  template_text TEXT NOT NULL,
  placeholders JSONB DEFAULT '[]',
  is_system_template BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT system_template_no_user CHECK (
    (is_system_template = true AND user_id IS NULL) OR 
    (is_system_template = false AND user_id IS NOT NULL)
  )
);

-- RLS Policies
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own templates and system templates"
  ON message_templates FOR SELECT
  USING (auth.uid() = user_id OR is_system_template = true);

CREATE POLICY "Users can insert own templates"
  ON message_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_system_template = false);

CREATE POLICY "Users can update own templates"
  ON message_templates FOR UPDATE
  USING (auth.uid() = user_id AND is_system_template = false);

CREATE POLICY "Users can delete own templates"
  ON message_templates FOR DELETE
  USING (auth.uid() = user_id AND is_system_template = false);

-- Indexes
CREATE INDEX idx_templates_user_id ON message_templates(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_templates_occasion ON message_templates(occasion);
CREATE INDEX idx_templates_tone ON message_templates(tone) WHERE tone IS NOT NULL;
CREATE INDEX idx_templates_system ON message_templates(is_system_template);
CREATE INDEX idx_templates_usage ON message_templates(usage_count DESC);

-- =================================================================
-- IMPORTANT DATES TABLE
-- =================================================================

CREATE TABLE important_dates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  date_type TEXT NOT NULL 
    CHECK (date_type IN ('birthday', 'anniversary', 'custom')),
  date DATE NOT NULL,
  description TEXT,
  reminder_days_before INTEGER DEFAULT 7 
    CHECK (reminder_days_before >= 0 AND reminder_days_before <= 365),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE important_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own important dates"
  ON important_dates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own important dates"
  ON important_dates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own important dates"
  ON important_dates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own important dates"
  ON important_dates FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_important_dates_contact_id ON important_dates(contact_id);
CREATE INDEX idx_important_dates_date ON important_dates(date);
-- Note: Removed idx_important_dates_upcoming - CURRENT_DATE is not IMMUTABLE in PostgreSQL
-- Use idx_important_dates_date instead, filter at query time with WHERE date >= CURRENT_DATE
CREATE INDEX idx_important_dates_user_id ON important_dates(user_id);

-- =================================================================
-- MESSAGE ANALYTICS TABLE
-- =================================================================

CREATE TABLE message_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  opened BOOLEAN DEFAULT false,
  opened_at TIMESTAMPTZ,
  delivered BOOLEAN DEFAULT false,
  delivered_at TIMESTAMPTZ,
  failed BOOLEAN DEFAULT false,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE message_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own message analytics"
  ON message_analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own message analytics"
  ON message_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_analytics_message_id ON message_analytics(message_id);
CREATE INDEX idx_analytics_user_id ON message_analytics(user_id);
CREATE INDEX idx_analytics_delivered ON message_analytics(delivered, delivered_at);
CREATE INDEX idx_analytics_opened ON message_analytics(opened, opened_at);

-- =================================================================
-- USER SETTINGS TABLE
-- =================================================================

CREATE TABLE user_settings (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  reminder_frequency TEXT DEFAULT 'weekly' 
    CHECK (reminder_frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
  auto_schedule_enabled BOOLEAN DEFAULT false,
  default_message_tone TEXT DEFAULT 'casual' 
    CHECK (default_message_tone IN ('formal', 'casual', 'humorous', 'heartfelt', 'professional')),
  theme TEXT DEFAULT 'auto' 
    CHECK (theme IN ('light', 'dark', 'auto')),
  language TEXT DEFAULT 'en-US',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- =================================================================
-- TRIGGERS
-- =================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
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

CREATE TRIGGER update_relationships_updated_at
  BEFORE UPDATE ON relationships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personal_facts_updated_at
  BEFORE UPDATE ON personal_facts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_templates_updated_at
  BEFORE UPDATE ON message_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_important_dates_updated_at
  BEFORE UPDATE ON important_dates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- FUNCTIONS
-- =================================================================

-- Function to calculate relationship health score
CREATE OR REPLACE FUNCTION calculate_health_score(
  p_user_id UUID,
  p_contact_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_days_since_contact INTEGER;
  v_message_count INTEGER;
  v_contact_frequency INTEGER;
  v_health_score INTEGER;
BEGIN
  -- Get days since last contact
  SELECT COALESCE(CURRENT_DATE - last_contact_date, 999)
  INTO v_days_since_contact
  FROM relationships
  WHERE user_id = p_user_id AND contact_id = p_contact_id;

  -- Get message count in last 90 days
  SELECT COUNT(*)
  INTO v_message_count
  FROM messages
  WHERE user_id = p_user_id 
    AND contact_id = p_contact_id 
    AND status = 'sent'
    AND sent_at > NOW() - INTERVAL '90 days';

  -- Get desired contact frequency
  SELECT COALESCE(contact_frequency, 30)
  INTO v_contact_frequency
  FROM relationships
  WHERE user_id = p_user_id AND contact_id = p_contact_id;

  -- Calculate score (0-100)
  v_health_score := 100 - LEAST(100, 
    (v_days_since_contact * 100 / (v_contact_frequency * 2)) +
    GREATEST(0, 30 - (v_message_count * 10))
  );

  RETURN GREATEST(0, v_health_score);
END;
$$ LANGUAGE plpgsql;

-- Function to get upcoming important dates
CREATE OR REPLACE FUNCTION get_upcoming_dates(
  p_user_id UUID,
  p_days_ahead INTEGER DEFAULT 30
)
RETURNS TABLE (
  date_id UUID,
  contact_id UUID,
  contact_name TEXT,
  date_type TEXT,
  date DATE,
  days_until INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id.id,
    id.contact_id,
    c.name,
    id.date_type,
    id.date,
    (id.date - CURRENT_DATE) AS days_until
  FROM important_dates id
  JOIN contacts c ON c.id = id.contact_id
  WHERE id.user_id = p_user_id
    AND id.date BETWEEN CURRENT_DATE AND CURRENT_DATE + p_days_ahead
    AND c.deleted_at IS NULL
  ORDER BY id.date ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get contact statistics
CREATE OR REPLACE FUNCTION get_contact_stats(p_user_id UUID)
RETURNS TABLE (
  total_contacts BIGINT,
  contacts_with_birthdays BIGINT,
  contacts_with_anniversaries BIGINT,
  avg_health_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT c.id)::BIGINT,
    COUNT(DISTINCT c.id) FILTER (WHERE c.birthday IS NOT NULL)::BIGINT,
    COUNT(DISTINCT c.id) FILTER (WHERE c.anniversary IS NOT NULL)::BIGINT,
    ROUND(AVG(r.health_score), 2)
  FROM contacts c
  LEFT JOIN relationships r ON r.contact_id = c.id AND r.user_id = p_user_id
  WHERE c.user_id = p_user_id AND c.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- =================================================================
-- SEED DATA - System Message Templates
-- =================================================================

INSERT INTO message_templates (name, occasion, tone, template_text, placeholders, is_system_template) VALUES
  ('Birthday - Casual', 'birthday', 'casual', 
   'Happy birthday {{name}}! Hope you have an amazing day! 🎉', 
   '["name"]', true),
  
  ('Birthday - Heartfelt', 'birthday', 'heartfelt', 
   'Wishing you the happiest of birthdays, {{name}}! May this year bring you joy, health, and everything your heart desires. 🎂', 
   '["name"]', true),
  
  ('Anniversary - Romantic', 'anniversary', 'heartfelt', 
   'Happy anniversary {{name}}! Here''s to another year of love and happiness together. ❤️', 
   '["name"]', true),
  
  ('Thank You - Casual', 'thankyou', 'casual', 
   'Hey {{name}}, just wanted to say thanks for {{reason}}! Really appreciate it! 🙏', 
   '["name", "reason"]', true),
  
  ('Thank You - Formal', 'thankyou', 'formal', 
   'Dear {{name}}, I wanted to express my sincere gratitude for {{reason}}. Your kindness means a lot to me.', 
   '["name", "reason"]', true),
  
  ('Apology - Sincere', 'apology', 'heartfelt', 
   'Hi {{name}}, I want to sincerely apologize for {{reason}}. I hope you can forgive me.', 
   '["name", "reason"]', true),
  
  ('Casual Check-in', 'casual', 'casual', 
   'Hey {{name}}! Just wanted to check in and see how you''re doing. Hope all is well! 😊', 
   '["name"]', true),
  
  ('Congratulations', 'congratulations', 'casual', 
   'Congratulations on {{achievement}}, {{name}}! So proud of you! 🎊', 
   '["name", "achievement"]', true);

-- =================================================================
-- COMMENTS
-- =================================================================

COMMENT ON TABLE profiles IS 'User profiles extending Supabase Auth';
COMMENT ON TABLE contacts IS 'User contacts with relationship metadata';
COMMENT ON TABLE messages IS 'AI-generated and user-created messages';
COMMENT ON TABLE relationships IS 'Relationship health tracking';
COMMENT ON TABLE personal_facts IS 'AI-extracted personal information about contacts';
COMMENT ON TABLE message_templates IS 'Message templates (system and user-created)';
COMMENT ON TABLE important_dates IS 'Important dates for contacts';
COMMENT ON TABLE message_analytics IS 'Message delivery and engagement analytics';
COMMENT ON TABLE user_settings IS 'User preferences and settings';

COMMENT ON FUNCTION calculate_health_score IS 'Calculate relationship health score based on contact frequency and message history';
COMMENT ON FUNCTION get_upcoming_dates IS 'Get upcoming important dates within specified days';
COMMENT ON FUNCTION get_contact_stats IS 'Get aggregate statistics about user contacts';