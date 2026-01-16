# Multi-Select Directive Documentation

## Overview

The `multi-select` directive is an AngularJS directive that wraps the Choices.js library to provide a customizable multi-select dropdown component. It supports type preservation (numbers, UUIDs, strings) and prevents AngularJS date parsing issues.

## Location

**File:** `public/scripts/app/multi-select.directive.js`

## Usage

### Basic Syntax

```html
<multi-select 
    ng-model="controller.selectedValues"
    options="controller.optionsArray"
    option-value="fieldName"
    option-label="fieldName"
    placeholder="Select options..."
    search-enabled="true"
    remove-item-button="true">
</multi-select>
```

### Required Attributes

- **`ng-model`** (required): AngularJS model binding. Should be an array to store selected values.
  - Example: `ng-model="ctrl.selectedAccountUuids"`
  - Type: Array (e.g., `[]`, `[1, 2, 3]`, `['uuid1', 'uuid2']`)

- **`options`** (required): Array of option objects to display in the dropdown.
  - Example: `options="ctrl.accounts"`
  - Type: Array of objects

### Optional Attributes

- **`option-value`** (optional): Field name in the option object to use as the value.
  - If not provided, falls back to: `value`, `id`, `uuid`, or the object itself
  - Examples:
    - `option-value="uuid"` - Use UUID field (for reports accounts)
    - `option-value="id"` - Use ID field (for calendar accounts)
    - `option-value="value"` - Use value field

- **`option-label`** (optional): Field name in the option object to use as the display label.
  - If not provided, falls back to: `label`, `name (provider)`, `name`, or the value
  - Examples:
    - `option-label="name"` - Use name field
    - `option-label="title"` - Use title field
    - If omitted and option has `name` and `provider`, formats as: `"Name (Provider)"`

- **`placeholder`** (optional): Placeholder text when no items are selected.
  - Default: `"Select options..."`
  - Example: `placeholder="Select accounts..."`

- **`search-enabled`** (optional): Enable search functionality in the dropdown.
  - Default: `true`
  - Set to `"false"` to disable: `search-enabled="false"`

- **`remove-item-button`** (optional): Show remove button on selected items.
  - Default: `true`
  - Set to `"false"` to disable: `remove-item-button="false"`

## Examples

### Example 1: Accounts with UUIDs (Reports Page)

```html
<multi-select 
    ng-model="reportsCtrl.selectedAccountUuids"
    options="reportsCtrl.accounts"
    option-value="uuid"
    option-label="name"
    placeholder="Select accounts..."
    search-enabled="true"
    remove-item-button="true">
</multi-select>
```

**Controller:**
```javascript
vm.accounts = [
    { uuid: '550e8400-e29b-41d4-a716-446655440000', name: 'Twitter Account', provider: 'twitter' },
    { uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', name: 'Facebook Page', provider: 'facebook' }
];
vm.selectedAccountUuids = []; // Array of UUID strings
```

### Example 2: Accounts with Numeric IDs (Calendar Page)

```html
<multi-select 
    ng-model="calendarCtrl.filter.accounts"
    options="calendarCtrl.accounts"
    option-value="id"
    placeholder="Select accounts..."
    search-enabled="true"
    remove-item-button="true">
</multi-select>
```

**Controller:**
```javascript
vm.accounts = [
    { id: 1, name: 'Twitter Account', provider: 'twitter' },
    { id: 2, name: 'Facebook Page', provider: 'facebook' }
];
vm.filter.accounts = []; // Array of numbers
```

**Note:** When `option-label` is not specified and accounts have both `name` and `provider`, the label will automatically format as `"Name (Provider)"`.

### Example 3: Tags with UUIDs

```html
<multi-select 
    ng-model="calendarCtrl.filter.tags"
    options="calendarCtrl.tags"
    option-value="uuid"
    placeholder="Select tags..."
    search-enabled="true"
    remove-item-button="true">
</multi-select>
```

**Controller:**
```javascript
vm.tags = [
    { uuid: 'tag-uuid-1', name: 'Marketing' },
    { uuid: 'tag-uuid-2', name: 'Announcement' }
];
vm.filter.tags = []; // Array of UUID strings
```

**Note:** When `option-label` is not specified, it will use the `name` field.

### Example 4: Custom Options

```html
<multi-select 
    ng-model="ctrl.selectedItems"
    options="ctrl.customOptions"
    option-value="code"
    option-label="displayName"
    placeholder="Choose items..."
    search-enabled="true"
    remove-item-button="true">
</multi-select>
```

**Controller:**
```javascript
vm.customOptions = [
    { code: 'OPT1', displayName: 'Option 1' },
    { code: 'OPT2', displayName: 'Option 2' }
];
vm.selectedItems = []; // Array of 'code' values
```

## Type Preservation

The directive automatically preserves the original data types:

- **Numbers**: If `option-value` points to a numeric field, selected values remain numbers
  - Example: Calendar accounts with `option-value="id"` → `[1, 2, 3]`

- **UUIDs**: If values are UUIDs (36 chars with hyphens), they remain strings
  - Example: Reports accounts with `option-value="uuid"` → `['uuid1', 'uuid2']`

- **Strings**: All other values remain strings
  - Example: Tags with `option-value="uuid"` → `['tag-uuid-1', 'tag-uuid-2']`

## Best Practices

1. **Always specify `option-value`**: Makes the code explicit and prevents unexpected behavior
   ```html
   option-value="uuid"  <!-- Good -->
   <!-- vs relying on fallback logic -->
   ```

2. **Always specify `option-label`**: Ensures correct display text
   ```html
   option-label="name"  <!-- Good -->
   ```

3. **Initialize ng-model as empty array**: Prevents undefined errors
   ```javascript
   vm.selectedValues = []; // Good
   // vs
   vm.selectedValues = undefined; // Bad
   ```

4. **Use descriptive placeholders**: Improves UX
   ```html
   placeholder="Select accounts..."  <!-- Good -->
   placeholder="..."  <!-- Less clear -->
   ```

5. **Watch for changes**: If you need to react to selection changes, use `$watch`:
   ```javascript
   $scope.$watch(function() {
       return vm.selectedAccountUuids;
   }, function(newVal, oldVal) {
       if (newVal !== oldVal && oldVal !== undefined) {
           // Handle selection change
           loadData();
       }
   }, true); // Deep watch for array changes
   ```

## Common Patterns

### Pattern 1: Accounts Selection (UUIDs)

```html
<multi-select 
    ng-model="ctrl.selectedAccountUuids"
    options="ctrl.accounts"
    option-value="uuid"
    option-label="name"
    placeholder="Select accounts...">
</multi-select>
```

### Pattern 2: Accounts Selection (Numeric IDs)

```html
<multi-select 
    ng-model="ctrl.filter.accounts"
    options="ctrl.accounts"
    option-value="id"
    placeholder="Select accounts...">
</multi-select>
```

### Pattern 3: Tags Selection

```html
<multi-select 
    ng-model="ctrl.filter.tags"
    options="ctrl.tags"
    option-value="uuid"
    placeholder="Select tags...">
</multi-select>
```

## Troubleshooting

### Issue: UUIDs showing instead of names

**Solution:** Ensure `option-label` is specified:
```html
option-label="name"  <!-- Add this -->
```

### Issue: Numbers showing instead of labels

**Solution:** Specify `option-label`:
```html
option-label="displayName"  <!-- Use appropriate field -->
```

### Issue: Date parsing errors

**Solution:** The directive handles this automatically. Ensure values are properly typed (numbers for IDs, strings for UUIDs).

### Issue: Selected values not persisting

**Solution:** Ensure `ng-model` is initialized as an array:
```javascript
vm.selectedValues = []; // Initialize as empty array
```

## Files Using This Directive

- `views/dashboard/calendar/index.ejs` - Accounts and tags selection
- `views/dashboard/reports/index.ejs` - Accounts selection

## Dependencies

- **Choices.js**: Multi-select library (loaded in `layouts/dashboard/index.ejs`)
- **AngularJS**: Framework for directive implementation

## Related Files

- Directive implementation: `public/scripts/app/multi-select.directive.js`
- Choices.js CSS: `public/vendor/choices/css/choices.min.css`
- Choices.js JS: `public/vendor/choices/js/choices.min.js`
- Styling: `public/css/dashboard.css` (Choices.js theme styling)

