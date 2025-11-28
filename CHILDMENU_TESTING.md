# ChildMenu Testing Guide

## Overview
The ChildMenu component has been fully implemented with dynamic backend API integration. This guide explains how to test and verify the functionality.

## What Was Fixed

### 1. API-Driven Architecture
- **Before**: ChildMenu tried to use children from context only, which weren't populated
- **After**: ChildMenu fetches children dynamically from `GET /menu/access/:accessId/menus/:menuKey`

### 2. Type Definitions Enhanced
- Added `key` field to `MenuEntry` and `MenuItem` types
- Added `parentId` field for proper parent-child relationships
- Types now match backend response structure

### 3. Smart menuKey Extraction
- **Primary**: Uses backend's `key` field (e.g., "organizations")
- **Fallback**: Infers from URL path if `key` not present
- **Example**: `/organizations/overview` → extracts `"organizations"`

### 4. Robust Error Handling
- Shows loading spinner while fetching
- Shows error message if API fails
- Falls back to context children if API unavailable
- Gracefully hides if no children exist

## Testing Steps

### 1. Check Browser Console
When you click a parent menu (e.g., "Organizations"), you should see:

```
========== Sidebar Menus ==========
Raw menus from backend: [...]
Menu keys: [
  { title: "Organizations", key: "uuid-123", menuKey: "organizations", hasChildren: true }
]
===================================

SidebarMenus - Menu clicked: Organizations
SidebarMenus - UUID key: uuid-123
SidebarMenus - Menu key: organizations

========== ChildMenu Debug ==========
Parent menu title: Organizations
menuKey extracted: organizations
accessId: ac01
API enabled: true
API endpoint: /menu/access/ac01/menus/organizations
isLoading: false
API response - children count: 8
====================================
```

### 2. Visual Verification
After clicking "Organizations" in the sidebar, you should see:

```
┌─────────────────────────────────────────────────────────────┐
│ ORGANIZATIONS | Overview | Profile | Members | Settings | ▼ │
└─────────────────────────────────────────────────────────────┘
```

- Purple pill-shaped bar appears at top of content area
- Shows first 4 children as direct links
- Shows dropdown arrow (▼) if more than 4 children
- Clicking dropdown shows remaining children

### 3. API Response Structure
The backend should return this structure from `GET /menu/access/ac01/menus/organizations`:

```json
{
  "id": "uuid-org",
  "key": "organizations",
  "title": "Organizations", 
  "url": "/organizations",
  "children": [
    {
      "id": "uuid-ov",
      "key": "organizations-overview",
      "title": "Overview",
      "url": "/organizations/overview",
      "order": 1
    },
    {
      "id": "uuid-profile",
      "key": "organizations-profile", 
      "title": "Profile",
      "url": "/organizations/profile",
      "order": 2
    }
    // ... more children
  ]
}
```

### 4. Fallback Behavior
If the API endpoint doesn't exist or returns an error:

- **Option A**: Backend returns nested structure in `GET /menu`
  - Children will be available in context
  - ChildMenu will display them immediately
  
- **Option B**: No children available
  - ChildMenu won't render
  - Console will log: "ChildMenu - not rendering because no children"

## Troubleshooting

### ChildMenu Not Appearing
Check console for:
```
ChildMenu - not rendering: no active parent menu
```
→ **Fix**: Ensure `setActiveParentMenu` is called in sidebar click handler

```
API enabled: false
```
→ **Fix**: Check that user has `accesses[0].id` and menuKey is extracted

```
API error: 404
```
→ **Fix**: Backend endpoint doesn't exist or menuKey is wrong

### Wrong menuKey Extracted
If console shows:
```
menuKey extracted: uuid-123-456 (should be "organizations")
```
→ **Fix**: Backend needs to return `key` field, or URL must be `/organizations`

### Children Not Displaying
If console shows:
```
API response - children count: 0
```
→ **Fix**: Backend isn't returning children array in response

## Backend Requirements

Your backend must support ONE of these patterns:

### Pattern 1: Dedicated Child Endpoint (Recommended)
```
GET /menu/access/:accessId/menus/:menuKey
```
- Returns single menu with children array
- menuKey is semantic key like "organizations"
- Enables lazy loading of children

### Pattern 2: Nested Structure in Main Endpoint
```
GET /menu
```
- Returns parent menus with children already nested
- No additional API call needed
- Works with fallback mechanism

## Code References

- **ChildMenu Component**: `src/shared/components/layout/ChildMenu.tsx`
- **Sidebar Menus**: `src/shared/components/layout/sidebar/SidebarMenus.tsx`
- **MenuContext**: `src/shared/components/layout/MenuContext.tsx`
- **API Layer**: `src/app/routes/sections/menus/api.ts`
- **React Query Hooks**: `src/app/routes/sections/menus/hooks.ts`

## Success Criteria

✅ Clicking parent menu sets activeParentMenu
✅ ChildMenu appears at top of content area
✅ Loading spinner shows while fetching
✅ Children display in pill-shaped buttons
✅ Dropdown works for 5+ children
✅ Navigation works when clicking child items
✅ Error message shows if API fails
✅ Falls back gracefully if API unavailable

## Next Steps

1. Open browser to http://localhost:5174
2. Login to the application
3. Click "Organizations" in the sidebar
4. Verify ChildMenu appears with children
5. Check console logs for debug information
6. Test navigation to child pages
7. Test other parent menus (if any)

If you encounter issues, share the console logs for debugging.
