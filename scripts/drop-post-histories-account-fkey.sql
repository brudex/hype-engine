-- ============================================
-- Drop FKs on post_histories (accounts / posts)
-- ============================================
-- Publish history is an audit log; accounts may be deleted and re-linked.
-- Sequelize models use constraints: false — run this once on existing DBs.
--
-- Error this fixes:
--   violates foreign key constraint "post_histories_accountUuid_fkey"
--
-- Usage:
--   psql -U your_username -d your_database -f scripts/drop-post-histories-account-fkey.sql
-- ============================================

-- Drop every FK on post_histories that references accounts
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT tc.constraint_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = 'post_histories'
          AND ccu.table_name = 'accounts'
    LOOP
        EXECUTE format(
            'ALTER TABLE post_histories DROP CONSTRAINT IF EXISTS %I',
            r.constraint_name
        );
        RAISE NOTICE 'Dropped constraint % on post_histories -> accounts', r.constraint_name;
    END LOOP;
END $$;

-- Named constraint (Sequelize default) if the loop missed it
ALTER TABLE post_histories
    DROP CONSTRAINT IF EXISTS "post_histories_accountUuid_fkey";

-- Optional: drop post_histories -> posts FK (not required for account delete)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT tc.constraint_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = 'post_histories'
          AND ccu.table_name = 'posts'
    LOOP
        EXECUTE format(
            'ALTER TABLE post_histories DROP CONSTRAINT IF EXISTS %I',
            r.constraint_name
        );
        RAISE NOTICE 'Dropped constraint % on post_histories -> posts', r.constraint_name;
    END LOOP;
END $$;

ALTER TABLE post_histories
    DROP CONSTRAINT IF EXISTS "post_histories_postUuid_fkey";

-- Verify: no FKs left on post_histories
SELECT
    tc.constraint_name,
    ccu.table_name AS references_table,
    kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name = 'post_histories';
