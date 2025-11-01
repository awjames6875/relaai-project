-- =================================================================
-- SEED DATA TEMPLATE
-- =================================================================
--
-- TODO: Update the following:
-- 1. Replace placeholder UUIDs with real ones or use uuid_generate_v4()
-- 2. Add realistic sample data for your tables
-- 3. Ensure foreign key relationships are valid
-- 4. Update data to match your schema
-- 5. Remove/add sections as needed
--
-- Purpose: Insert realistic test/demo data for development and testing
-- Created: [DATE]
-- Author: [YOUR_NAME]
--
-- Usage: Run this after schema migration in development environment
-- DO NOT run in production unless intended for demo/staging
--
-- =================================================================

BEGIN;

-- =================================================================
-- CLEANUP (Optional - removes existing seed data)
-- =================================================================

-- WARNING: This will delete data! Only use in development.
-- Uncomment if you want to reset data before seeding:

-- DELETE FROM message_analytics WHERE user_id = 'seed-user-1-uuid';
-- DELETE FROM important_dates WHERE user_id = 'seed-user-1-uuid';
-- DELETE FROM personal_facts WHERE user_id = 'seed-user-1-uuid';
-- DELETE FROM messages WHERE user_id = 'seed-user-1-uuid';
-- DELETE FROM relationships WHERE user_id = 'seed-user-1-uuid';
-- DELETE FROM contacts WHERE user_id = 'seed-user-1-uuid';
-- DELETE FROM user_settings WHERE user_id = 'seed-user-1-uuid';
-- DELETE FROM profiles WHERE id = 'seed-user-1-uuid';

-- =================================================================
-- SEED DATA CONFIGURATION
-- =================================================================

-- Define reusable UUIDs (replace with actual UUIDs from auth.users)
-- In real scenarios, these would come from Supabase Auth user creation
DO $$
DECLARE
  -- Test user IDs (replace with real auth.users IDs)
  user1_id UUID := '00000000-0000-0000-0000-000000000001';
  user2_id UUID := '00000000-0000-0000-0000-000000000002';

  -- Contact IDs (will be generated)
  contact1_id UUID := uuid_generate_v4();
  contact2_id UUID := uuid_generate_v4();
  contact3_id UUID := uuid_generate_v4();
  contact4_id UUID := uuid_generate_v4();
  contact5_id UUID := uuid_generate_v4();

  -- Message IDs
  message1_id UUID := uuid_generate_v4();
  message2_id UUID := uuid_generate_v4();
  message3_id UUID := uuid_generate_v4();
BEGIN
  -- This is just for variable declaration
  -- Actual inserts are below
END $$;

-- =================================================================
-- USER PROFILES
-- =================================================================

-- Note: Profiles should normally be created via Supabase Auth
-- This is for testing only - in production, triggers handle profile creation

INSERT INTO profiles (id, email, full_name, phone_number, timezone, subscription_tier, onboarding_completed)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'john.doe@example.com',
    'John Doe',
    '+12025551234',
    'America/New_York',
    'premium',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'jane.smith@example.com',
    'Jane Smith',
    '+14155551234',
    'America/Los_Angeles',
    'free',
    false
  )
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- USER SETTINGS
-- =================================================================

INSERT INTO user_settings (user_id, notifications_enabled, email_notifications, reminder_frequency, default_message_tone)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    true,
    true,
    'weekly',
    'casual'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    true,
    false,
    'daily',
    'professional'
  )
ON CONFLICT (user_id) DO NOTHING;

-- =================================================================
-- CONTACTS
-- =================================================================

-- Realistic contact data for User 1
INSERT INTO contacts (id, user_id, name, phone_number, email, birthday, relationship_type, notes)
VALUES
  (
    uuid_generate_v4(),
    '00000000-0000-0000-0000-000000000001',
    'Sarah Johnson',
    '+13105551234',
    'sarah.j@example.com',
    '1990-05-15',
    'Friend',
    'College roommate, loves hiking and photography'
  ),
  (
    uuid_generate_v4(),
    '00000000-0000-0000-0000-000000000001',
    'Michael Chen',
    '+14155552345',
    'mchen@example.com',
    '1985-11-23',
    'Colleague',
    'Works in product team, interested in AI and tech'
  ),
  (
    uuid_generate_v4(),
    '00000000-0000-0000-0000-000000000001',
    'Emily Rodriguez',
    '+16175553456',
    'emily.r@example.com',
    '1992-03-08',
    'Family',
    'Cousin, getting married next year'
  ),
  (
    uuid_generate_v4(),
    '00000000-0000-0000-0000-000000000001',
    'David Kim',
    '+19175554567',
    'david.kim@example.com',
    NULL,
    'Friend',
    'High school friend, now lives in NYC'
  ),
  (
    uuid_generate_v4(),
    '00000000-0000-0000-0000-000000000001',
    'Lisa Anderson',
    '+13235555678',
    'lisa.a@example.com',
    '1988-07-19',
    'Professional',
    'Mentor from previous company'
  )
ON CONFLICT (id) DO NOTHING;

-- Contacts for User 2
INSERT INTO contacts (id, user_id, name, phone_number, email, relationship_type)
VALUES
  (
    uuid_generate_v4(),
    '00000000-0000-0000-0000-000000000002',
    'Robert Taylor',
    '+12135556789',
    'rtaylor@example.com',
    'Colleague'
  ),
  (
    uuid_generate_v4(),
    '00000000-0000-0000-0000-000000000002',
    'Maria Garcia',
    '+19495557890',
    'maria.g@example.com',
    'Friend'
  )
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- RELATIONSHIPS (Health Tracking)
-- =================================================================

-- Create relationship records for User 1's contacts
WITH user1_contacts AS (
  SELECT id FROM contacts
  WHERE user_id = '00000000-0000-0000-0000-000000000001'
  LIMIT 5
)
INSERT INTO relationships (user_id, contact_id, health_score, last_contact_date, contact_frequency, temperature, notes)
SELECT
  '00000000-0000-0000-0000-000000000001',
  id,
  CASE
    WHEN random() > 0.7 THEN 85 + floor(random() * 15)::integer
    WHEN random() > 0.4 THEN 60 + floor(random() * 25)::integer
    ELSE 30 + floor(random() * 30)::integer
  END,
  CURRENT_DATE - (floor(random() * 30)::integer),
  CASE
    WHEN random() > 0.5 THEN 14
    ELSE 30
  END,
  CASE
    WHEN random() > 0.7 THEN 'hot'
    WHEN random() > 0.3 THEN 'warm'
    ELSE 'cold'
  END::TEXT,
  'Auto-generated relationship data'
FROM user1_contacts
ON CONFLICT (user_id, contact_id) DO NOTHING;

-- =================================================================
-- MESSAGES
-- =================================================================

-- Get some contact IDs to use
WITH contact_ids AS (
  SELECT id FROM contacts
  WHERE user_id = '00000000-0000-0000-0000-000000000001'
  LIMIT 3
)
INSERT INTO messages (user_id, contact_id, content, occasion, tone, status, ai_generated, confidence_score)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM contact_ids OFFSET 0 LIMIT 1),
    'Hey Sarah! Hope you''re doing well. Want to grab coffee this weekend?',
    'casual',
    'casual',
    'draft',
    false,
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM contact_ids OFFSET 1 LIMIT 1),
    'Happy Birthday Michael! Hope you have an amazing day filled with joy and celebration! 🎉',
    'birthday',
    'casual',
    'scheduled',
    true,
    0.92
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM contact_ids OFFSET 2 LIMIT 1),
    'Hi Emily, congratulations on your engagement! So happy for you both!',
    'congratulations',
    'heartfelt',
    'sent',
    true,
    0.88
  )
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- PERSONAL FACTS
-- =================================================================

-- Add some AI-extracted facts about contacts
WITH contact_ids AS (
  SELECT id FROM contacts
  WHERE user_id = '00000000-0000-0000-0000-000000000001'
  LIMIT 3
)
INSERT INTO personal_facts (user_id, contact_id, fact_type, fact_content, source, confidence_score)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM contact_ids OFFSET 0 LIMIT 1),
    'hobby',
    'Enjoys hiking and outdoor photography',
    'manual_entry',
    1.0
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM contact_ids OFFSET 1 LIMIT 1),
    'preference',
    'Interested in AI and emerging technologies',
    'conversation',
    0.85
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM contact_ids OFFSET 2 LIMIT 1),
    'life_event',
    'Getting married next year',
    'manual_entry',
    1.0
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM contact_ids OFFSET 1 LIMIT 1),
    'personality',
    'Very analytical and detail-oriented',
    'ai_inference',
    0.78
  )
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- IMPORTANT DATES
-- =================================================================

-- Add important dates for contacts
WITH contact_data AS (
  SELECT id, birthday FROM contacts
  WHERE user_id = '00000000-0000-0000-0000-000000000001'
  AND birthday IS NOT NULL
  LIMIT 3
)
INSERT INTO important_dates (user_id, contact_id, date_type, date, description, reminder_days_before)
SELECT
  '00000000-0000-0000-0000-000000000001',
  id,
  'birthday',
  birthday,
  'Birthday',
  7
FROM contact_data
ON CONFLICT (id) DO NOTHING;

-- Add custom important dates
WITH first_contact AS (
  SELECT id FROM contacts
  WHERE user_id = '00000000-0000-0000-0000-000000000001'
  LIMIT 1
)
INSERT INTO important_dates (user_id, contact_id, date_type, date, description, reminder_days_before)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM first_contact),
    'custom',
    '2025-06-15',
    'Coffee meetup anniversary',
    3
  )
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- MESSAGE TEMPLATES (Custom User Templates)
-- =================================================================

-- User-created custom templates (system templates are in schema.sql)
INSERT INTO message_templates (user_id, name, occasion, tone, template_text, placeholders, is_system_template)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'My Birthday Greeting',
    'birthday',
    'casual',
    'Happy Birthday {{name}}! Can''t wait to celebrate with you soon! 🎂🎉',
    '["name"]',
    false
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Professional Thank You',
    'thankyou',
    'professional',
    'Dear {{name}}, I wanted to thank you for {{reason}}. Your support has been invaluable.',
    '["name", "reason"]',
    false
  )
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- MESSAGE ANALYTICS
-- =================================================================

-- Add analytics for sent messages
WITH sent_messages AS (
  SELECT id, user_id FROM messages
  WHERE user_id = '00000000-0000-0000-0000-000000000001'
  AND status = 'sent'
  LIMIT 5
)
INSERT INTO message_analytics (message_id, user_id, opened, opened_at, delivered, delivered_at)
SELECT
  id,
  user_id,
  random() > 0.3, -- 70% opened
  CASE WHEN random() > 0.3 THEN NOW() - (floor(random() * 3600)::integer || ' seconds')::interval END,
  true,
  NOW() - (floor(random() * 7200)::integer || ' seconds')::interval
FROM sent_messages
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- =================================================================
-- VERIFICATION QUERIES
-- =================================================================

-- Run these to verify seed data was inserted correctly:

-- Count records per table:
-- SELECT
--   'profiles' AS table_name, COUNT(*) AS count FROM profiles
-- UNION ALL
-- SELECT 'contacts', COUNT(*) FROM contacts
-- UNION ALL
-- SELECT 'messages', COUNT(*) FROM messages
-- UNION ALL
-- SELECT 'relationships', COUNT(*) FROM relationships
-- UNION ALL
-- SELECT 'personal_facts', COUNT(*) FROM personal_facts
-- UNION ALL
-- SELECT 'important_dates', COUNT(*) FROM important_dates
-- UNION ALL
-- SELECT 'message_templates', COUNT(*) FROM message_templates
-- UNION ALL
-- SELECT 'message_analytics', COUNT(*) FROM message_analytics
-- UNION ALL
-- SELECT 'user_settings', COUNT(*) FROM user_settings;

-- View sample data:
-- SELECT * FROM profiles LIMIT 5;
-- SELECT * FROM contacts LIMIT 10;
-- SELECT * FROM messages LIMIT 10;

-- =================================================================
-- NOTES
-- =================================================================

-- 1. This seed data is for DEVELOPMENT/TESTING only
-- 2. Replace hard-coded UUIDs with real auth.users IDs in production
-- 3. Transaction ensures all-or-nothing insertion
-- 4. ON CONFLICT DO NOTHING makes script idempotent
-- 5. Uses realistic sample data for better testing
-- 6. Maintains referential integrity between tables
-- 7. Includes variety of statuses, tones, occasions for testing
-- 8. Generated UUIDs ensure no collisions

-- =================================================================
-- CUSTOMIZATION TIPS
-- =================================================================

-- 1. For more realistic data, use:
--    - Faker.js in JavaScript
--    - faker library in Python
--    - Online generators
--
-- 2. To generate many records, use generate_series():
--    INSERT INTO contacts (user_id, name)
--    SELECT
--      'user-uuid',
--      'Contact ' || generate_series(1, 100)
--
-- 3. For timestamps, use intervals:
--    created_at := NOW() - (floor(random() * 365)::integer || ' days')::interval
--
-- 4. For random enum values:
--    tone := (ARRAY['formal', 'casual', 'humorous'])[floor(random() * 3 + 1)]
