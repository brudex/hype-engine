-- ============================================
-- SQL Script to Remove keyPrefix Column
-- ============================================
-- This script removes the keyPrefix column from the mixpost_api_keys table
-- 
-- Usage:
--   psql -U your_username -d your_database -f scripts/remove-keyprefix-column.sql
--   OR
--   psql -U your_username -d your_database < scripts/remove-keyprefix-column.sql
-- ============================================

-- Drop the keyPrefix column from mixpost_api_keys table
ALTER TABLE mixpost_api_keys DROP COLUMN IF EXISTS "keyPrefix";

-- Verify the column was removed
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'mixpost_api_keys' 
AND column_name = 'keyPrefix';

-- If the above query returns no rows, the column has been successfully removed

