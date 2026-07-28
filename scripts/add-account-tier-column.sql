-- ============================================
-- Add accountTier to accounts (X API plan label)
-- ============================================
-- Values for X: Free, Basic, Premium, Premium Plus
--
-- Usage:
--   psql -U your_username -d your_database -f scripts/add-account-tier-column.sql
-- ============================================

ALTER TABLE accounts ADD COLUMN IF NOT EXISTS "accountTier" VARCHAR(32) NOT NULL DEFAULT 'Basic';

COMMENT ON COLUMN accounts."accountTier" IS 'Platform API tier (e.g. X: Free, Basic, Premium, Premium Plus)';

UPDATE accounts
SET "accountTier" = 'Basic'
WHERE "accountTier" IS NULL OR TRIM("accountTier") = '';
