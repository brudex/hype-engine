# Mixpost API Endpoints Documentation

All Mixpost API endpoints are prefixed with `/api/`

## Accounts API

### Get All Accounts
- **GET** `/api/accounts`
- **Response**: Array of account objects
- **Example**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "uuid": "uuid-here",
      "name": "Account Name",
      "username": "username",
      "provider": "twitter",
      "providerId": "123456",
      "authorized": true,
      "image": "https://...",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Single Account
- **GET** `/api/accounts/:uuid`
- **Response**: Single account object

### Update Account
- **PUT** `/api/accounts/:uuid`
- **Body**: `{ "name": "...", "username": "..." }`
- **Response**: Updated account object

### Delete Account
- **DELETE** `/api/accounts/:uuid`
- **Response**: Success message

## Posts API

### Get All Posts
- **GET** `/api/posts`
- **Query Parameters**:
  - `keyword` - Search keyword
  - `status` - Filter by status (0=Draft, 1=Scheduled, 2=Published, 3=Failed)
  - `tags` - Array of tag UUIDs
  - `accounts` - Array of account IDs
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 20)
- **Response**: Paginated posts with metadata

### Get Single Post
- **GET** `/api/posts/:uuid`
- **Response**: Post object with accounts, tags, and versions

### Create Post
- **POST** `/api/posts`
- **Body**:
```json
{
  "accounts": [1, 2],
  "versions": [
    {
      "accountId": 1,
      "isOriginal": true,
      "content": {
        "body": "Post content",
        "media": ["media-uuid-1", "media-uuid-2"]
      }
    }
  ],
  "tags": ["tag-uuid-1"],
  "scheduled_at": "2024-01-01T12:00:00Z"
}
```
- **Response**: Created post object

### Update Post
- **PUT** `/api/posts/:uuid`
- **Body**: Same as create, all fields optional
- **Response**: Updated post object

### Delete Post
- **DELETE** `/api/posts/:uuid`
- **Response**: Success message

### Delete Multiple Posts
- **DELETE** `/api/posts`
- **Body**: `{ "posts": ["uuid1", "uuid2"] }`
- **Response**: Success message with deleted count

### Schedule Post
- **POST** `/api/posts/:uuid/schedule`
- **Body**: `{ "scheduled_at": "2024-01-01T12:00:00Z" }`
- **Response**: Success message with formatted scheduled date

### Duplicate Post
- **POST** `/api/posts/:uuid/duplicate`
- **Response**: New post UUID

## Media API

### Get Uploaded Media
- **GET** `/api/media/uploaded`
- **Query Parameters**:
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 30)
- **Response**: Paginated media items

### Get Stock Images (Unsplash)
- **GET** `/api/media/stock`
- **Query Parameters**:
  - `keyword` - Search keyword
  - `page` - Page number
- **Response**: Stock images with pagination links
- **Note**: Requires Unsplash API configuration

### Get GIFs (Tenor)
- **GET** `/api/media/gifs`
- **Query Parameters**:
  - `keyword` - Search keyword
  - `page` - Page number
- **Response**: GIF items with pagination links
- **Note**: Requires Tenor API configuration

### Upload Media File
- **POST** `/api/media/upload`
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `file` field
- **Response**: Uploaded media object

### Download External Media
- **POST** `/api/media/download`
- **Body**: `{ "url": "https://...", "name": "filename.jpg" }`
- **Response**: Downloaded media objects
- **Note**: Not yet implemented

### Delete Media
- **DELETE** `/api/media`
- **Body**: `{ "ids": ["uuid1", "uuid2"] }`
- **Response**: Success message

## Tags API

### Get All Tags
- **GET** `/api/tags`
- **Response**: Array of tag objects

### Create Tag
- **POST** `/api/tags`
- **Body**: `{ "name": "Tag Name", "hex_color": "FF5733" }`
- **Response**: Created tag object

### Update Tag
- **PUT** `/api/tags/:uuid`
- **Body**: `{ "name": "...", "hex_color": "..." }`
- **Response**: Updated tag object

### Delete Tag
- **DELETE** `/api/tags/:uuid`
- **Response**: Success message

## Reports API

### Get Reports
- **GET** `/api/reports`
- **Query Parameters**:
  - `account_id` - Account ID (required)
  - `start_date` - Start date (YYYY-MM-DD)
  - `end_date` - End date (YYYY-MM-DD)
- **Response**: Report data with metrics, audience, and insights

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20,
    "last_page": 5
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (for DELETE operations)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Authentication

Currently, API endpoints do not require authentication. To add authentication:

1. Use the existing `auth.middleware.js`
2. Add middleware to routes:
```javascript
router.get('/posts', auth.requireAuth, MixpostApiController.getPosts);
```

## Notes

- All UUIDs are in UUID v4 format
- Dates are in ISO 8601 format
- JSON fields (content, data, conversions) are automatically parsed
- Pagination uses 1-based page numbers
- File uploads use `multipart/form-data`

