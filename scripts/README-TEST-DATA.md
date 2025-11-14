# Test Data Seeding Scripts

Scripts to populate the database with test contacts for Epic 2 Contact Management testing.

---

## Option 1: SQL Script (Recommended)

**Easiest method - run directly in Supabase dashboard**

### Steps:

1. **Get your User ID:**
   - Open Supabase Dashboard → SQL Editor
   - Run: `SELECT id, email FROM auth.users;`
   - Copy your user ID

2. **Run the SQL script:**
   - Open `scripts/seed-test-contacts.sql`
   - Replace `<USER_ID_HERE>` with your actual user ID
   - Copy the entire script
   - Paste into Supabase SQL Editor
   - Click "Run"

3. **Verify:**
   - Check that 10 contacts were created
   - Navigate to Contacts screen in app
   - All test contacts should appear

---

## Option 2: TypeScript Script

**For developers who want programmatic control**

### Prerequisites:
```bash
npm install -g ts-node typescript
```

### Setup:
1. Set environment variables:
   ```bash
   export SUPABASE_URL="your-supabase-url"
   export SUPABASE_ANON_KEY="your-anon-key"
   ```

2. Get your User ID:
   - Same as Option 1

3. Run the script:
   ```bash
   cd relaai-project
   npx ts-node scripts/seed-test-contacts.ts <your-user-id>
   ```

---

## Test Data Included

The script creates **10 test contacts** with various scenarios:

1. **John Doe** - Complete contact (all fields populated)
2. **Jane Smith** - Minimal contact (name only)
3. **Michael O'Brien** - Special characters (apostrophe)
4. **María García** - Unicode characters
5. **Dr. Sarah Chen** - Professional contact
6. **Alex Thompson** - Friend with birthday
7. **Alice Johnson** - For search testing
8. **Bob Smith** - For search testing
9. **Christopher Anderson-Williams** - Long name
10. **Li Wang** - Short name (2 words)

### Contact Distribution:
- **Relationship Types:** Friend (4), Colleague (2), Family (1), Professional (1), Acquaintance (1)
- **With Phone:** 9 contacts
- **With Email:** 9 contacts
- **With Birthday:** 6 contacts
- **With Anniversary:** 2 contacts

---

## Cleanup

To remove test contacts:

```sql
-- Replace with your user ID
DELETE FROM contacts WHERE user_id = '<YOUR_USER_ID>';
```

Or if you want to keep them but mark as deleted:

```sql
UPDATE contacts 
SET deleted_at = NOW() 
WHERE user_id = '<YOUR_USER_ID>' AND deleted_at IS NULL;
```

---

## Troubleshooting

**Error: "User ID not found"**
- Verify your user ID exists in `auth.users` table
- Check that you're using the correct user ID format (UUID)

**Error: "Permission denied"**
- Make sure RLS policies allow your user to insert contacts
- Check that you're authenticated as the correct user

**Error: "Duplicate key"**
- Contacts already exist for this user
- Run cleanup SQL first, then re-run seed script

---

## Next Steps

After seeding:
1. Run smoke test checklist
2. Verify contacts appear in app
3. Test search functionality with "Alice" and "Bob"
4. Test edit/delete on test contacts
5. Proceed with full test plan execution

---

**Scripts Location:** `scripts/`
- `seed-test-contacts.sql` - SQL version
- `seed-test-contacts.ts` - TypeScript version

