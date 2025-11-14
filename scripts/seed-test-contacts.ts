/**
 * Seed Test Contacts Script
 *
 * Creates test contact data for Epic 2 Contact Management testing.
 * This script can be run via Node.js to populate the Supabase database with test data.
 *
 * Usage:
 *   npx ts-node scripts/seed-test-contacts.ts <userId>
 *
 * Or use the Supabase SQL version: scripts/seed-test-contacts.sql
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration - update these if needed
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Test contacts data
const TEST_CONTACTS = [
  // Complete contact with all fields
  {
    name: 'John Doe',
    phone_number: '+14155551234',
    email: 'john.doe@example.com',
    birthday: '1990-05-15',
    anniversary: '2015-06-20',
    relationship_type: 'Friend',
    notes: 'Met at college reunion. Loves hiking and photography.',
  },
  // Minimal contact (name only)
  {
    name: 'Jane Smith',
    phone_number: null,
    email: null,
    birthday: null,
    anniversary: null,
    relationship_type: null,
    notes: null,
  },
  // Contact with special characters
  {
    name: "Michael O'Brien",
    phone_number: '+14155559876',
    email: 'michael.obrien@example.com',
    birthday: '1985-03-22',
    anniversary: null,
    relationship_type: 'Colleague',
    notes: 'Works in marketing department.',
  },
  // Unicode characters
  {
    name: 'María García',
    phone_number: '+14155554567',
    email: 'maria.garcia@example.com',
    birthday: '1992-11-08',
    anniversary: null,
    relationship_type: 'Family',
    notes: 'Cousin from Spain.',
  },
  // Professional contact
  {
    name: 'Dr. Sarah Chen',
    phone_number: '+14155552345',
    email: 'sarah.chen@example.com',
    birthday: null,
    anniversary: null,
    relationship_type: 'Professional',
    notes: 'Family doctor. Very knowledgeable and friendly.',
  },
  // Friend with birthday soon
  {
    name: 'Alex Thompson',
    phone_number: '+14155556789',
    email: 'alex.thompson@example.com',
    birthday: '1995-01-15', // Adjust to be soon
    anniversary: null,
    relationship_type: 'Friend',
    notes: 'Close friend from high school.',
  },
  // Contact for search testing
  {
    name: 'Alice Johnson',
    phone_number: '+14155558901',
    email: 'alice.johnson@example.com',
    birthday: '1988-07-30',
    anniversary: '2020-09-10',
    relationship_type: 'Friend',
    notes: 'Best friend. Always there when needed.',
  },
  // Another contact for search testing
  {
    name: 'Bob Smith',
    phone_number: '+14155553456',
    email: 'bob.smith@example.com',
    birthday: null,
    anniversary: null,
    relationship_type: 'Colleague',
    notes: 'Works in IT department.',
  },
  // Long name test
  {
    name: 'Christopher Anderson-Williams',
    phone_number: '+14155557890',
    email: 'chris.aw@example.com',
    birthday: '1993-04-12',
    anniversary: null,
    relationship_type: 'Acquaintance',
    notes: 'Met at networking event.',
  },
  // Edge case - short name
  {
    name: 'Li Wang',
    phone_number: '+14155551234',
    email: 'li.wang@example.com',
    birthday: null,
    anniversary: null,
    relationship_type: 'Friend',
    notes: null,
  },
];

async function seedTestContacts(userId: string) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log(`🌱 Seeding test contacts for user: ${userId}`);
  console.log(`📝 Creating ${TEST_CONTACTS.length} contacts...\n`);

  const results = [];

  for (let i = 0; i < TEST_CONTACTS.length; i++) {
    const contact = TEST_CONTACTS[i];
    console.log(`Creating contact ${i + 1}/${TEST_CONTACTS.length}: ${contact.name}`);

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        user_id: userId,
        ...contact,
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ Error creating ${contact.name}:`, error.message);
      results.push({ name: contact.name, status: 'FAILED', error: error.message });
    } else {
      console.log(`✅ Created: ${contact.name} (ID: ${data.id})`);
      results.push({ name: contact.name, status: 'SUCCESS', id: data.id });
    }
  }

  console.log('\n📊 Seeding Summary:');
  console.log('='.repeat(50));
  const successCount = results.filter((r) => r.status === 'SUCCESS').length;
  const failCount = results.filter((r) => r.status === 'FAILED').length;

  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('='.repeat(50));

  if (failCount > 0) {
    console.log('\n⚠️ Failed Contacts:');
    results.filter((r) => r.status === 'FAILED').forEach((r) => {
      console.log(`  - ${r.name}: ${(r as any).error}`);
    });
  }

  return results;
}

// Main execution
const userId = process.argv[2];

if (!userId) {
  console.error('❌ Error: User ID required');
  console.log('\nUsage:');
  console.log('  npx ts-node scripts/seed-test-contacts.ts <userId>');
  console.log('\nOr use SQL version:');
  console.log('  psql -f scripts/seed-test-contacts.sql');
  process.exit(1);
}

if (!SUPABASE_URL || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
  console.error('❌ Error: SUPABASE_URL not set');
  console.log('\nSet environment variables:');
  console.log('  export SUPABASE_URL="your-url"');
  console.log('  export SUPABASE_ANON_KEY="your-key"');
  process.exit(1);
}

seedTestContacts(userId)
  .then(() => {
    console.log('\n✨ Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });

