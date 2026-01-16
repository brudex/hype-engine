# Mixpost Models Summary

## Overview
All Mixpost models have been created following the Sequelize ORM pattern used in the mixpost-node-better project. The models follow the existing coding standards and are automatically loaded by `models/index.js`.

## Created Models

### Core Models

1. **Account** (`account.js`)
   - Table: `mixpost_accounts`
   - Fields: uuid, name, username, media (JSON), provider, providerId, data (JSON), authorized, accessToken
   - Relationships: Many-to-Many with Post, HasMany PostVersion, Metric, Audience, FacebookInsight, ImportedPost
   - Unique constraint on (provider, provider_id)

2. **Post** (`post.js`)
   - Table: `mixpost_posts`
   - Fields: uuid, status, scheduleStatus, scheduledAt, publishedAt
   - Relationships: Many-to-Many with Account (through PostAccount), Many-to-Many with Tag (through TagPost), HasMany PostVersion
   - Supports soft deletes (paranoid: true)

3. **PostVersion** (`post-version.js`)
   - Table: `mixpost_post_versions`
   - Fields: postId, accountId, isOriginal, content (JSON)
   - Relationships: BelongsTo Post, BelongsTo Account
   - No timestamps

4. **PostAccount** (`post-account.js`)
   - Table: `mixpost_post_accounts` (pivot table)
   - Fields: postId, accountId, providerPostId, data (JSON), errors (JSON)
   - Relationships: BelongsTo Post, BelongsTo Account
   - No timestamps

5. **Media** (`media.js`)
   - Table: `mixpost_media`
   - Fields: uuid, name, mimeType, disk, path, data (JSON), size, sizeTotal, conversions (JSON)
   - Relationships: Referenced in PostVersion content JSON (no direct FK)

6. **Tag** (`tag.js`)
   - Table: `mixpost_tags`
   - Fields: uuid, name, hexColor
   - Relationships: Many-to-Many with Post (through TagPost)

7. **TagPost** (`tag-post.js`)
   - Table: `mixpost_tag_post` (pivot table)
   - Fields: tagId, postId
   - Relationships: BelongsTo Tag, BelongsTo Post
   - No timestamps

### Service Models

8. **Service** (`service.js`)
   - Table: `mixpost_services`
   - Fields: name, configuration (TEXT - encrypted), active
   - No timestamps

9. **Setting** (`setting.js`)
   - Table: `mixpost_settings`
   - Fields: name, payload (JSON)
   - No timestamps

### Analytics Models

10. **Metric** (`metric.js`)
    - Table: `mixpost_metrics`
    - Fields: accountId, data (JSON), date
    - Relationships: BelongsTo Account
    - Unique constraint on (account_id, date)
    - No timestamps

11. **Audience** (`audience.js`)
    - Table: `mixpost_audience`
    - Fields: accountId, total, date
    - Relationships: BelongsTo Account
    - Index on (account_id, date)
    - No timestamps

12. **FacebookInsight** (`facebook-insight.js`)
    - Table: `mixpost_facebook_insights`
    - Fields: accountId, type, value, date
    - Relationships: BelongsTo Account
    - Unique constraint on (account_id, type, date)
    - Has timestamps

13. **ImportedPost** (`imported-post.js`)
    - Table: `mixpost_imported_posts`
    - Fields: accountId, providerPostId, content (JSON), metrics (JSON), createdAt
    - Relationships: BelongsTo Account
    - Unique constraint on (account_id, provider_post_id)
    - No timestamps (uses created_at field directly)

## Key Features

### UUID Support
- Account, Post, Tag, and Media models use UUID as primary identifier
- UUIDs are automatically generated using Sequelize's UUIDV4

### JSON Fields
- Properly handled using DataTypes.JSON
- Used for: media, data, content, conversions, payload, metrics

### Relationships
- All relationships properly defined in associate functions
- Many-to-Many relationships use pivot tables (PostAccount, TagPost)
- Foreign keys properly configured with CASCADE on delete where appropriate

### Indexes
- Unique constraints defined where needed
- Indexes on foreign keys and commonly queried fields

### Field Naming
- Sequelize camelCase attributes map to snake_case database columns using `field` option
- Follows existing project conventions

## Next Steps

1. **Database Migration**: Create Sequelize migrations or SQL scripts to create the tables
2. **Controllers**: Create controllers for each model following the existing pattern
3. **Routes**: Set up routes for Mixpost features
4. **Services**: Implement business logic for social media integrations
5. **Frontend**: Create EJS views with AngularJS for the Mixpost interface

## Notes

- Models are automatically loaded by `models/index.js`
- All models follow the existing coding pattern in the project
- Relationships are properly configured and will be established when models are loaded
- The models are ready to use once the database tables are created

