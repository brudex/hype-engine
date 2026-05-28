-- ============================================
-- SQL Script: Post recurring fields + post_accounts timestamps
-- ============================================
-- Adds recurring schedule columns to `posts` (see models/post.js) and
-- `createdAt` / `updatedAt` to `post_accounts` (see models/post-account.js).
--
-- Column names use Sequelize default camelCase (quoted identifiers).
--
-- Usage:
--   psql -U your_username -d your_database -f scripts/add-post-recurring-and-post-account-timestamps.sql
--   OR
--   psql -U your_username -d your_database < scripts/add-post-recurring-and-post-account-timestamps.sql
-- ============================================

-- --------------------------------------------
-- posts: recurring scheduling
-- --------------------------------------------
ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS "recurringType" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS "recurringDays" VARCHAR(32);

ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS "recurringTime" TIME WITHOUT TIME ZONE;

ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS "recurringEndAt" TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN posts."recurringType" IS '0=ONE_TIME, 1=DAILY, 2=WEEKLY';
COMMENT ON COLUMN posts."recurringDays" IS 'Comma-separated day codes for weekly recurrence, e.g. MON,TUE,FRI';
COMMENT ON COLUMN posts."recurringTime" IS 'Time of day for recurrence (PostgreSQL TIME)';
COMMENT ON COLUMN posts."recurringEndAt" IS 'Optional end date for recurring series';

-- Ensure existing rows are one-time if column was just added
UPDATE posts
SET "recurringType" = 0
WHERE "recurringType" IS NULL;

-- --------------------------------------------
-- post_accounts: Sequelize timestamps
-- --------------------------------------------
ALTER TABLE post_accounts
    ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE;

ALTER TABLE post_accounts
    ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE;

-- Backfill existing rows, then enforce NOT NULL
UPDATE post_accounts
SET
    "createdAt" = COALESCE("createdAt", NOW()),
    "updatedAt" = COALESCE("updatedAt", NOW())
WHERE "createdAt" IS NULL OR "updatedAt" IS NULL;

ALTER TABLE post_accounts
    ALTER COLUMN "createdAt" SET NOT NULL,
    ALTER COLUMN "createdAt" SET DEFAULT NOW();

ALTER TABLE post_accounts
    ALTER COLUMN "updatedAt" SET NOT NULL,
    ALTER COLUMN "updatedAt" SET DEFAULT NOW();

-- --------------------------------------------
-- Verify
-- --------------------------------------------
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'posts'
  AND column_name IN ('recurringType', 'recurringDays', 'recurringTime', 'recurringEndAt')
ORDER BY column_name;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'post_accounts'
  AND column_name IN ('createdAt', 'updatedAt')
ORDER BY column_name;
