# Settings Feature Analysis - mixpost-2.4.0

## Overview
Mixpost-2.4.0 has a comprehensive settings system that manages application-wide preferences for timezone, date/time formatting, notifications, and default accounts.

## Database Structure

### Table: `mixpost_settings`
- `id` (primary key)
- `name` (string) - Setting name/identifier
- `payload` (JSON) - Setting value (can be string, number, array, etc.)
- No timestamps

## Settings Features Implemented

### 1. **Timezone** (`timezone`)
- **Type**: String (timezone identifier)
- **Default**: `'UTC'`
- **Validation**: Required, must be valid timezone
- **Usage**:
  - Used throughout the app for date/time conversions
  - Calendar displays dates/times in user's timezone
  - Post scheduling converts to UTC for storage
  - Analytics display in user's timezone
- **UI**: Dropdown with grouped timezones (by continent) with GMT offsets

### 2. **Date Format** (`date_format`)
- **Type**: String
- **Default**: `'human'`
- **Options**: `'human'` (e.g., "Jan 15, 2024, 2:30pm")
- **Usage**: 
  - Used in post scheduling display
  - Used in analytics/reports
  - Human-readable date formatting

### 3. **Time Format** (`time_format`)
- **Type**: Integer
- **Default**: `12`
- **Options**: `12` (12-hour) or `24` (24-hour)
- **Validation**: Required, must be 12 or 24
- **Usage**:
  - Calendar time display
  - Post scheduling time picker
  - Analytics time display
- **UI**: Radio buttons (12 hour / 24 hour)

### 4. **Week Starts On** (`week_starts_on`)
- **Type**: Integer
- **Default**: `1` (Monday)
- **Options**: `0` (Sunday) or `1` (Monday)
- **Validation**: Required, must be 0 or 1
- **Usage**:
  - Calendar week view
  - Week-based scheduling
- **UI**: Radio buttons (Sunday / Monday)

### 5. **Admin Email** (`admin_email`)
- **Type**: String (email)
- **Default**: `''` (empty)
- **Validation**: Required, must be valid email
- **Usage**:
  - Receives notifications when accounts lose authorization
  - System notifications
- **UI**: Email input field

### 6. **Default Accounts** (`default_accounts`)
- **Type**: Array
- **Default**: `[]` (empty array)
- **Usage**:
  - Pre-selected accounts when creating new posts
  - Quick account selection
- **UI**: Not shown in settings page (used internally)

## Architecture

### Core Components

1. **Settings Class** (`src/Settings.php`)
   - Manages settings schema (form structure)
   - Validation rules
   - Cache management (stores in cache for performance)
   - Database fallback (reads from DB if not in cache)

2. **Setting Model** (`src/Models/Setting.php`)
   - Eloquent model for `mixpost_settings` table
   - Auto-updates cache on save/delete
   - Casts `payload` to array

3. **SettingsController** (`src/Http/Controllers/SettingsController.php`)
   - `index()` - Display settings page with timezone list
   - `update()` - Save settings

4. **SaveSettings Request** (`src/Http/Requests/SaveSettings.php`)
   - Validates settings input
   - Updates/creates settings in database
   - Updates cache

5. **TimezoneList Helper** (`src/Support/TimezoneList.php`)
   - Generates timezone list grouped by continent
   - Formats timezones with GMT offsets
   - Used in settings page dropdown

## Features

### Caching
- Settings are cached for performance
- Cache key: `{cache_prefix}.settings.{setting_name}`
- Auto-updated when settings are saved/deleted
- Falls back to database if cache miss

### Validation
- Timezone: Must be valid PHP timezone
- Time format: Must be 12 or 24
- Week starts on: Must be 0 or 1
- Admin email: Must be valid email format

### Usage Throughout Application

1. **Calendar Component**
   - Uses timezone for date/time display
   - Uses week_starts_on for week view
   - Uses time_format for time display

2. **Post Scheduling**
   - Converts scheduled time to UTC using timezone
   - Displays in user's timezone
   - Uses time_format for display

3. **Analytics/Reports**
   - Dates/times displayed in user's timezone
   - Uses time_format setting

4. **Notifications**
   - Sends to admin_email when accounts are unauthorized
   - Uses `SendAccountUnauthorizedNotification` listener

5. **Default Accounts**
   - Pre-populates account selection in post creation
   - Used in `PostsController`

## Frontend Integration

### Vue Composables
- `useSettings.js` - Provides reactive access to settings
- Returns: `timeZone`, `timeFormat`, `weekStartsOn`
- Used throughout Vue components

### Settings Page (`resources/js/Pages/Settings.vue`)
- Two main panels:
  1. **Notifications Panel**: Admin email input
  2. **Time Settings Panel**: Timezone, time format, week starts on
- Uses Inertia.js for form handling
- Real-time validation feedback

## Routes

```php
Route::prefix('settings')->name('settings.')->group(function () {
    Route::get('/', [SettingsController::class, 'index'])->name('index');
    Route::put('/', [SettingsController::class, 'update'])->name('update');
});
```

## Key Implementation Details

1. **Settings are global** (not per-user or per-project)
2. **Cached for performance** - reduces database queries
3. **Auto-sync** - Model events update cache automatically
4. **Default values** - Defined in `Settings::form()`
5. **Timezone list** - Comprehensive list with GMT offsets grouped by continent
6. **Used in middleware** - Settings passed to frontend via `HandleInertiaRequests`

## Summary

The settings feature in mixpost-2.4.0 provides:
- ✅ Timezone management with comprehensive timezone list
- ✅ Time format preference (12/24 hour)
- ✅ Week start day preference (Sunday/Monday)
- ✅ Admin email for notifications
- ✅ Default accounts for post creation
- ✅ Caching for performance
- ✅ Validation and error handling
- ✅ Frontend integration via Vue composables
- ✅ Used throughout calendar, scheduling, and analytics

This is a well-architected settings system that centralizes application preferences and is used consistently across the application.

