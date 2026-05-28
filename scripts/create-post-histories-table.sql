-- ============================================
-- SQL Script: Create post_histories table
-- ============================================
-- Matches models/post-history.js (Sequelize camelCase columns).
--
-- Usage:
--   psql -U your_username -d your_database -f scripts/create-post-histories-table.sql
-- ============================================

CREATE TABLE IF NOT EXISTS post_histories (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    "postUuid" VARCHAR(36) NOT NULL,
    "accountUuid" VARCHAR(36) NOT NULL,
    "publishedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    status INTEGER NOT NULL DEFAULT 0,
    "providerPostId" VARCHAR(255),
    "recurringType" INTEGER NOT NULL DEFAULT 0,
    content TEXT,
    media JSONB,
    data JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS post_histories_post_uuid_idx ON post_histories ("postUuid");
CREATE INDEX IF NOT EXISTS post_histories_account_uuid_idx ON post_histories ("accountUuid");
CREATE INDEX IF NOT EXISTS post_histories_published_at_idx ON post_histories ("publishedAt");
CREATE INDEX IF NOT EXISTS post_histories_post_published_at_idx ON post_histories ("postUuid", "publishedAt");

COMMENT ON TABLE post_histories IS 'Per-account publish audit trail (one-time and recurring occurrences)';
COMMENT ON COLUMN post_histories.status IS '0=SUCCESS, 1=FAILED';
COMMENT ON COLUMN post_histories."recurringType" IS '0=ONE_TIME, 1=DAILY, 2=WEEKLY at publish time';
COMMENT ON COLUMN post_histories.data IS 'Platform metadata on success; { error, response? } on failure';

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'post_histories'
ORDER BY ordinal_position;
