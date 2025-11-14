/**
 * Seed Test Contacts - SQL Script
 *
 * Creates test contact data for Epic 2 Contact Management testing.
 * Run this script directly in Supabase SQL editor or via psql.
 *
 * Usage:
 *   1. Replace '<USER_ID_HERE>' with your actual user ID
 *   2. Run in Supabase SQL Editor
 *
 * Or via command line:
 *   psql $DATABASE_URL -f scripts/seed-test-contacts.sql
 */

-- Replace this with your actual user ID from auth.users table
-- You can find it by running: SELECT id FROM auth.users WHERE email = 'your-email@example.com';
\set user_id '<USER_ID_HERE>'

-- Clean up existing test contacts (optional - uncomment if you want fresh start)
-- DELETE FROM contacts WHERE user_id = :'user_id';

-- Insert test contacts
INSERT INTO contacts (user_id, name, phone_number, email, birthday, anniversary, relationship_type, notes) VALUES
  -- Complete contact with all fields
  (:'user_id', 'John Doe', '+14155551234', 'john.doe@example.com', '1990-05-15', '2015-06-20', 'Friend', 'Met at college reunion. Loves hiking and photography.'),
  
  -- Minimal contact (name only)
  (:'user_id', 'Jane Smith', NULL, NULL, NULL, NULL, NULL, NULL),
  
  -- Contact with special characters
  (:'user_id', 'Michael O''Brien', '+14155559876', 'michael.obrien@example.com', '1985-03-22', NULL, 'Colleague', 'Works in marketing department.'),
  
  -- Unicode characters
  (:'user_id', 'María García', '+14155554567', 'maria.garcia@example.com', '1992-11-08', NULL, 'Family', 'Cousin from Spain.'),
  
  -- Professional contact
  (:'user_id', 'Dr. Sarah Chen', '+14155552345', 'sarah.chen@example.com', NULL, NULL, 'Professional', 'Family doctor. Very knowledgeable and friendly.'),
  
  -- Friend with birthday soon
  (:'user_id', 'Alex Thompson', '+14155556789', 'alex.thompson@example.com', '1995-01-15', NULL, 'Friend', 'Close friend from high school.'),
  
  -- Contact for search testing
  (:'user_id', 'Alice Johnson', '+14155558901', 'alice.johnson@example.com', '1988-07-30', '2020-09-10', 'Friend', 'Best friend. Always there when needed.'),
  
  -- Another contact for search testing
  (:'user_id', 'Bob Smith', '+14155553456', 'bob.smith@example.com', NULL, NULL, 'Colleague', 'Works in IT department.'),
  
  -- Long name test
  (:'user_id', 'Christopher Anderson-Williams', '+14155557890', 'chris.aw@example.com', '1993-04-12', NULL, 'Acquaintance', 'Met at networking event.'),
  
  -- Edge case - short name
  (:'user_id', 'Li Wang', '+14155551234', 'li.wang@example.com', NULL, NULL, 'Friend', NULL);

-- Verify the inserts
SELECT 
  COUNT(*) as total_contacts,
  COUNT(DISTINCT relationship_type) as unique_relationship_types,
  COUNT(CASE WHEN phone_number IS NOT NULL THEN 1 END) as contacts_with_phone,
  COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as contacts_with_email,
  COUNT(CASE WHEN birthday IS NOT NULL THEN 1 END) as contacts_with_birthday
FROM contacts
WHERE user_id = :'user_id' AND deleted_at IS NULL;

-- Display all created contacts
SELECT 
  name,
  relationship_type,
  phone_number,
  email,
  birthday,
  created_at
FROM contacts
WHERE user_id = :'user_id' AND deleted_at IS NULL
ORDER BY name;

