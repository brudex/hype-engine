-- ============================================
-- PostgreSQL Script to Drop All Tables
-- ============================================
-- WARNING: This will permanently delete all data in all tables!
-- 
-- Usage:
--   psql -U your_username -d your_database -f scripts/drop-all-tables.sql
--   OR
--   psql -U your_username -d your_database < scripts/drop-all-tables.sql
-- ============================================

-- Disable foreign key checks temporarily (PostgreSQL doesn't have this, but CASCADE handles it)
-- Drop tables with CASCADE to automatically handle foreign key constraints

-- Drop junction/join tables first (they have foreign keys)
DROP TABLE IF EXISTS mixpost_tag_post CASCADE;
DROP TABLE IF EXISTS mixpost_post_accounts CASCADE;
DROP TABLE IF EXISTS mixpost_post_versions CASCADE;

-- Drop tables with foreign keys to other tables
DROP TABLE IF EXISTS mixpost_imported_posts CASCADE;
DROP TABLE IF EXISTS mixpost_facebook_insights CASCADE;
DROP TABLE IF EXISTS mixpost_metrics CASCADE;
DROP TABLE IF EXISTS mixpost_audience CASCADE;
DROP TABLE IF EXISTS mixpost_posts CASCADE;
DROP TABLE IF EXISTS mixpost_accounts CASCADE;
DROP TABLE IF EXISTS mixpost_media CASCADE;
DROP TABLE IF EXISTS mixpost_projects CASCADE;

-- Drop independent tables
DROP TABLE IF EXISTS mixpost_tags CASCADE;
DROP TABLE IF EXISTS mixpost_services CASCADE;
DROP TABLE IF EXISTS mixpost_settings CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Clean up any sequences that might be left behind
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_schema = 'public'
    ) 
    LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;
END $$;

-- Clean up any types/enums that might be left behind
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT typname 
        FROM pg_type 
        WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        AND typtype = 'e'
    ) 
    LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
    END LOOP;
END $$;

-- Success message
SELECT 'All tables dropped successfully!' AS message;

