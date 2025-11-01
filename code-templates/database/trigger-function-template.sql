-- =================================================================
-- TRIGGER FUNCTION TEMPLATE
-- =================================================================
--
-- TODO: Update the following:
-- 1. Replace [FUNCTION_NAME] with your function name
-- 2. Replace [TABLE_NAME] with your table name
-- 3. Customize the trigger logic
-- 4. Add appropriate comments
-- 5. Test thoroughly before deploying
--
-- Function: [FUNCTION_NAME]
-- Purpose: [DESCRIBE_WHAT_THIS_TRIGGER_DOES]
-- Created: [DATE]
-- Author: [YOUR_NAME]
--
-- =================================================================

-- =================================================================
-- EXAMPLE 1: AUTO-UPDATE TIMESTAMP (Most Common)
-- =================================================================

-- This function is usually already created in schema.sql
-- Including here for reference and customization

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Set updated_at to current timestamp
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to table
DROP TRIGGER IF EXISTS update_[TABLE_NAME]_updated_at ON [TABLE_NAME];
CREATE TRIGGER update_[TABLE_NAME]_updated_at
  BEFORE UPDATE ON [TABLE_NAME]  -- Runs before update
  FOR EACH ROW                    -- Runs for each affected row
  EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- EXAMPLE 2: AUDIT LOG / CHANGE TRACKING
-- =================================================================

-- Create audit log table first
CREATE TABLE IF NOT EXISTS [TABLE_NAME]_audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  changed_by UUID REFERENCES profiles(id),
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION [TABLE_NAME]_audit_trigger()
RETURNS TRIGGER AS $$
DECLARE
  changed_fields TEXT[];
BEGIN
  -- Determine which fields changed (for UPDATE)
  IF TG_OP = 'UPDATE' THEN
    -- Compare OLD and NEW to find changed fields
    SELECT array_agg(key) INTO changed_fields
    FROM (
      SELECT key
      FROM jsonb_each(to_jsonb(NEW))
      WHERE to_jsonb(NEW) -> key IS DISTINCT FROM to_jsonb(OLD) -> key
    ) AS changes;
  END IF;

  -- Insert audit record
  INSERT INTO [TABLE_NAME]_audit_log (
    table_name,
    record_id,
    operation,
    changed_by,
    old_data,
    new_data,
    changed_fields
  ) VALUES (
    TG_TABLE_NAME::TEXT,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    auth.uid(), -- Current authenticated user
    CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
    changed_fields
  );

  -- Return appropriate value
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger
DROP TRIGGER IF EXISTS [TABLE_NAME]_audit ON [TABLE_NAME];
CREATE TRIGGER [TABLE_NAME]_audit
  AFTER INSERT OR UPDATE OR DELETE ON [TABLE_NAME]
  FOR EACH ROW
  EXECUTE FUNCTION [TABLE_NAME]_audit_trigger();

-- =================================================================
-- EXAMPLE 3: AUTO-POPULATE FIELDS
-- =================================================================

-- Automatically populate derived or computed fields
CREATE OR REPLACE FUNCTION [TABLE_NAME]_auto_populate()
RETURNS TRIGGER AS $$
BEGIN
  -- Example: Generate slug from name
  IF NEW.name IS NOT NULL AND (NEW.slug IS NULL OR OLD.name IS DISTINCT FROM NEW.name) THEN
    NEW.slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  END IF;

  -- Example: Set full_name from first_name and last_name
  -- IF NEW.first_name IS NOT NULL OR NEW.last_name IS NOT NULL THEN
  --   NEW.full_name := trim(concat_ws(' ', NEW.first_name, NEW.last_name));
  -- END IF;

  -- Example: Calculate total from line items
  -- NEW.total_amount := (SELECT SUM(amount) FROM line_items WHERE parent_id = NEW.id);

  -- Example: Set owner from current user on insert
  -- IF TG_OP = 'INSERT' AND NEW.user_id IS NULL THEN
  --   NEW.user_id := auth.uid();
  -- END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply auto-populate trigger
DROP TRIGGER IF EXISTS [TABLE_NAME]_auto_populate ON [TABLE_NAME];
CREATE TRIGGER [TABLE_NAME]_auto_populate
  BEFORE INSERT OR UPDATE ON [TABLE_NAME]
  FOR EACH ROW
  EXECUTE FUNCTION [TABLE_NAME]_auto_populate();

-- =================================================================
-- EXAMPLE 4: VALIDATION TRIGGER
-- =================================================================

-- Enforce complex business rules that can't be done with CHECK constraints
CREATE OR REPLACE FUNCTION [TABLE_NAME]_validate()
RETURNS TRIGGER AS $$
BEGIN
  -- Example: Validate date range
  IF NEW.end_date IS NOT NULL AND NEW.end_date < NEW.start_date THEN
    RAISE EXCEPTION 'end_date cannot be before start_date';
  END IF;

  -- Example: Validate against another table
  -- IF NOT EXISTS (SELECT 1 FROM other_table WHERE id = NEW.foreign_id AND active = true) THEN
  --   RAISE EXCEPTION 'Invalid foreign_id: must reference an active record';
  -- END IF;

  -- Example: Limit number of records
  -- IF (SELECT COUNT(*) FROM [TABLE_NAME] WHERE user_id = NEW.user_id) >= 100 THEN
  --   RAISE EXCEPTION 'Maximum of 100 records per user exceeded';
  -- END IF;

  -- Example: Prevent updates to certain fields
  -- IF TG_OP = 'UPDATE' AND OLD.locked = true AND NEW.locked = true THEN
  --   IF OLD.critical_field IS DISTINCT FROM NEW.critical_field THEN
  --     RAISE EXCEPTION 'Cannot modify critical_field on locked records';
  --   END IF;
  -- END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply validation trigger
DROP TRIGGER IF EXISTS [TABLE_NAME]_validate ON [TABLE_NAME];
CREATE TRIGGER [TABLE_NAME]_validate
  BEFORE INSERT OR UPDATE ON [TABLE_NAME]
  FOR EACH ROW
  EXECUTE FUNCTION [TABLE_NAME]_validate();

-- =================================================================
-- EXAMPLE 5: CASCADE UPDATES TO RELATED TABLES
-- =================================================================

-- Update related tables when parent changes
CREATE OR REPLACE FUNCTION [TABLE_NAME]_cascade_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Example: Update child records when parent status changes
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    UPDATE child_table
    SET status = NEW.status
    WHERE parent_id = NEW.id;
  END IF;

  -- Example: Update cache/summary table
  -- UPDATE summary_table
  -- SET last_updated = NOW(), item_count = (
  --   SELECT COUNT(*) FROM [TABLE_NAME] WHERE category = NEW.category
  -- )
  -- WHERE category = NEW.category;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply cascade trigger
DROP TRIGGER IF EXISTS [TABLE_NAME]_cascade ON [TABLE_NAME];
CREATE TRIGGER [TABLE_NAME]_cascade
  AFTER UPDATE ON [TABLE_NAME]
  FOR EACH ROW
  EXECUTE FUNCTION [TABLE_NAME]_cascade_update();

-- =================================================================
-- EXAMPLE 6: PREVENT DELETE (Soft Delete Only)
-- =================================================================

-- Force soft deletes by preventing hard deletes
CREATE OR REPLACE FUNCTION [TABLE_NAME]_prevent_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Instead of deleting, set deleted_at timestamp
  UPDATE [TABLE_NAME]
  SET deleted_at = NOW()
  WHERE id = OLD.id;

  -- Return NULL to cancel the DELETE operation
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply prevent delete trigger
DROP TRIGGER IF EXISTS [TABLE_NAME]_prevent_delete ON [TABLE_NAME];
CREATE TRIGGER [TABLE_NAME]_prevent_delete
  BEFORE DELETE ON [TABLE_NAME]
  FOR EACH ROW
  EXECUTE FUNCTION [TABLE_NAME]_prevent_delete();

-- =================================================================
-- EXAMPLE 7: NOTIFY CHANGES (Real-time)
-- =================================================================

-- Send PostgreSQL NOTIFY for real-time updates
CREATE OR REPLACE FUNCTION [TABLE_NAME]_notify_change()
RETURNS TRIGGER AS $$
DECLARE
  payload JSON;
BEGIN
  -- Build notification payload
  payload := json_build_object(
    'operation', TG_OP,
    'table', TG_TABLE_NAME,
    'record_id', COALESCE(NEW.id, OLD.id),
    'user_id', COALESCE(NEW.user_id, OLD.user_id),
    'timestamp', NOW()
  );

  -- Send notification on channel
  PERFORM pg_notify('[TABLE_NAME]_changes', payload::text);

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply notify trigger
DROP TRIGGER IF EXISTS [TABLE_NAME]_notify ON [TABLE_NAME];
CREATE TRIGGER [TABLE_NAME]_notify
  AFTER INSERT OR UPDATE OR DELETE ON [TABLE_NAME]
  FOR EACH ROW
  EXECUTE FUNCTION [TABLE_NAME]_notify_change();

-- Listen to notifications:
-- LISTEN [TABLE_NAME]_changes;

-- =================================================================
-- EXAMPLE 8: VERSIONING / HISTORY TABLE
-- =================================================================

-- Create history table to track all changes
CREATE TABLE IF NOT EXISTS [TABLE_NAME]_history (
  history_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  record_id UUID NOT NULL,
  version INTEGER NOT NULL,
  data JSONB NOT NULL,
  operation TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  changed_by UUID
);

CREATE OR REPLACE FUNCTION [TABLE_NAME]_version_trigger()
RETURNS TRIGGER AS $$
DECLARE
  current_version INTEGER;
BEGIN
  -- Get current version number
  SELECT COALESCE(MAX(version), 0) + 1 INTO current_version
  FROM [TABLE_NAME]_history
  WHERE record_id = NEW.id;

  -- Insert version record
  INSERT INTO [TABLE_NAME]_history (
    record_id,
    version,
    data,
    operation,
    changed_by
  ) VALUES (
    NEW.id,
    current_version,
    to_jsonb(NEW),
    TG_OP,
    auth.uid()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply versioning trigger
DROP TRIGGER IF EXISTS [TABLE_NAME]_versioning ON [TABLE_NAME];
CREATE TRIGGER [TABLE_NAME]_versioning
  AFTER INSERT OR UPDATE ON [TABLE_NAME]
  FOR EACH ROW
  EXECUTE FUNCTION [TABLE_NAME]_version_trigger();

-- =================================================================
-- TRIGGER EXECUTION ORDER
-- =================================================================

-- If you have multiple triggers on the same table, PostgreSQL executes them:
-- 1. BEFORE triggers in alphabetical order by trigger name
-- 2. The actual operation (INSERT/UPDATE/DELETE)
-- 3. AFTER triggers in alphabetical order by trigger name

-- To control order, prefix trigger names with numbers:
-- 01_[TABLE_NAME]_validate
-- 02_[TABLE_NAME]_auto_populate
-- 03_[TABLE_NAME]_update_timestamp

-- =================================================================
-- TRIGGER BEST PRACTICES
-- =================================================================

-- 1. ✓ Use BEFORE triggers for validation and auto-population
-- 2. ✓ Use AFTER triggers for logging and cascading changes
-- 3. ✓ Keep trigger logic simple and fast
-- 4. ✓ Avoid infinite loops (trigger updates same table)
-- 5. ✓ Use SECURITY DEFINER carefully (runs with function owner's privileges)
-- 6. ✓ Test triggers thoroughly with edge cases
-- 7. ✓ Document what each trigger does
-- 8. ✓ Consider performance impact on bulk operations
-- 9. ✓ Use WHEN clause to limit when trigger fires
-- 10. ✓ Return NULL from BEFORE trigger to skip operation

-- =================================================================
-- TRIGGER DEBUGGING
-- =================================================================

-- List all triggers on a table:
-- SELECT * FROM pg_trigger WHERE tgrelid = '[TABLE_NAME]'::regclass;

-- Disable trigger temporarily:
-- ALTER TABLE [TABLE_NAME] DISABLE TRIGGER [TRIGGER_NAME];

-- Enable trigger:
-- ALTER TABLE [TABLE_NAME] ENABLE TRIGGER [TRIGGER_NAME];

-- Drop trigger:
-- DROP TRIGGER IF EXISTS [TRIGGER_NAME] ON [TABLE_NAME];

-- View trigger definition:
-- \dft+ [FUNCTION_NAME]

-- =================================================================
-- COMMON TRIGGER PATTERNS
-- =================================================================

-- Pattern 1: Updated timestamp
-- BEFORE UPDATE: NEW.updated_at = NOW()

-- Pattern 2: Set created_by on insert
-- BEFORE INSERT: NEW.created_by = auth.uid()

-- Pattern 3: Prevent updates to certain columns
-- BEFORE UPDATE: IF OLD.locked_column IS DISTINCT FROM NEW.locked_column THEN RAISE EXCEPTION

-- Pattern 4: Auto-generate values
-- BEFORE INSERT: NEW.uuid = gen_random_uuid()

-- Pattern 5: Maintain counter/summary
-- AFTER INSERT/DELETE: UPDATE parent SET count = count +/- 1

-- Pattern 6: Soft delete
-- BEFORE DELETE: UPDATE table SET deleted_at = NOW(); RETURN NULL;

-- =================================================================
-- NOTES
-- =================================================================

-- 1. Trigger functions must return TRIGGER type
-- 2. RETURN NEW for BEFORE INSERT/UPDATE to proceed
-- 3. RETURN OLD for BEFORE DELETE to proceed
-- 4. RETURN NULL to skip operation
-- 5. Use TG_OP to determine operation type
-- 6. Use TG_TABLE_NAME for generic functions
-- 7. NEW is available for INSERT/UPDATE
-- 8. OLD is available for UPDATE/DELETE
-- 9. auth.uid() gets current authenticated user
-- 10. RAISE EXCEPTION stops the operation and rolls back
