---
id: serverpreferences
title: Server Preferences
description: Client-side management system for server display preferences including profanity filtering and name visibility controls
sidebar_position: 3
slug: /api-vanilla/core-systems/serverpreferences
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Server Preferences

## Version History
| Build Version | Change Date | Change Type | Description |
|---------------|-------------|-------------|-------------|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `ServerPreferences` module provides client-side management of server display preferences, including profanity filtering for server names and descriptions, and user-controlled visibility settings. This system allows players to customize their server browser experience while maintaining persistent storage of their preferences.

## Class Structure

### ServerPreferences Class

**Status:** `stable`

**Description:**
Main class responsible for managing server display preferences and profanity filtering settings.

**Properties:**
- `persistdata` (table): Persistent storage for server-specific preferences
- `profanityservers` (table): Runtime cache of servers flagged for profanity
- `dirty` (boolean): Flag indicating if data needs to be saved

## Core Methods

### ServerPreferences:Reset() {#reset}

**Status:** `stable`

**Description:**
Resets all server preferences to default state and clears persistent data.

**Parameters:**
None

**Returns:**
None

**Example:**
```lua
-- Reset all server preferences
local prefs = ServerPreferences()
prefs:Reset()
```

### ServerPreferences:ToggleNameAndDescriptionFilter(server_data) {#toggle-filter}

**Status:** `stable`

**Description:**
Toggles the visibility filter for a specific server's name and description. This allows users to manually hide servers they don't want to see in the browser.

**Parameters:**
- `server_data` (table|string|nil): Server information containing name and description, or just server name as string, or nil for current server

**Returns:**
None

**Example:**
```lua
-- Toggle filter for a specific server
local server_info = {
    name = "My Test Server",
    description = "A private server for testing"
}
prefs:ToggleNameAndDescriptionFilter(server_info)

-- Toggle filter using just server name
prefs:ToggleNameAndDescriptionFilter("Simple Server Name")

-- Toggle filter for current server
prefs:ToggleNameAndDescriptionFilter(nil)
```

### ServerPreferences:IsNameAndDescriptionHidden(server_data) {#is-hidden}

**Status:** `stable`

**Description:**
Checks whether a server's name and description should be hidden based on user preferences or profanity filtering.

**Parameters:**
- `server_data` (table|string|nil): Server information to check

**Returns:**
- (boolean): `true` if the server should be hidden, `false` otherwise

**Example:**
```lua
-- Check if server should be hidden
local server = {name = "Test Server", description = "Description"}
local should_hide = prefs:IsNameAndDescriptionHidden(server)

if should_hide then
    print("Server content is filtered")
else
    print("Server content is visible")
end
```

### ServerPreferences:RefreshLastSeen(server_list) {#refresh-last-seen}

**Status:** `stable`

**Description:**
Updates the last seen timestamp for servers in the provided list. This is used for data expiration management.

**Parameters:**
- `server_list` (table): Array of server data tables

**Returns:**
None

**Example:**
```lua
-- Update last seen timestamps
local servers = {
    {name = "Server 1", description = "Desc 1"},
    {name = "Server 2", description = "Desc 2"}
}
prefs:RefreshLastSeen(servers)
```

## Profanity Filtering Methods

### ServerPreferences:ClearProfanityFilteredServers() {#clear-profanity}

**Status:** `stable`

**Description:**
Clears the runtime cache of profanity-filtered servers. This resets automatic profanity detection.

**Parameters:**
None

**Returns:**
None

**Example:**
```lua
-- Clear profanity filter cache
prefs:ClearProfanityFilteredServers()
```

### ServerPreferences:UpdateProfanityFilteredServers(servers) {#update-profanity-multiple}

**Status:** `stable`

**Description:**
Updates profanity filtering status for a list of servers. Servers containing profanity in names or descriptions are automatically flagged if profanity filtering is enabled.

**Parameters:**
- `servers` (table): Array of server data tables to analyze

**Returns:**
None

**Example:**
```lua
-- Update profanity filtering for server list
local server_list = {
    {name = "Clean Server", description = "Family friendly", owner = false},
    {name = "Bad Server", description = "Contains profanity", owner = true}
}
prefs:UpdateProfanityFilteredServers(server_list)
```

### ServerPreferences:UpdateProfanityFilteredServer(server) {#update-profanity-single}

**Status:** `stable`

**Description:**
Updates profanity filtering status for a single server or the current server if nil is passed.

**Parameters:**
- `server` (table|nil): Server data to analyze, or nil for current server

**Returns:**
None

**Example:**
```lua
-- Check single server for profanity
local server = {name = "Test Server", description = "Clean description"}
prefs:UpdateProfanityFilteredServer(server)

-- Check current server
prefs:UpdateProfanityFilteredServer(nil)
```

## Persistence Methods

### ServerPreferences:GetSaveName() {#get-save-name}

**Status:** `stable`

**Description:**
Returns the filename used for saving server preferences. The name varies based on the current branch.

**Parameters:**
None

**Returns:**
- (string): Save file name

**Example:**
```lua
-- Get save file name
local filename = prefs:GetSaveName()
print("Preferences saved to:", filename)
-- Output: "server_preferences" or "server_preferences_dev"
```

### ServerPreferences:Save(callback) {#save}

**Status:** `stable`

**Description:**
Saves current preferences to persistent storage. Automatically expires old data based on `USER_HISTORY_EXPIRY_TIME`.

**Parameters:**
- `callback` (function): Optional callback function called with success status

**Returns:**
None

**Example:**
```lua
-- Save preferences with callback
prefs:Save(function(success)
    if success then
        print("Preferences saved successfully")
    else
        print("Failed to save preferences")
    end
end)

-- Save without callback
prefs:Save()
```

### ServerPreferences:Load(callback) {#load}

**Status:** `stable`

**Description:**
Loads server preferences from persistent storage.

**Parameters:**
- `callback` (function): Optional callback function called with success status

**Returns:**
None

**Example:**
```lua
-- Load preferences
prefs:Load(function(success)
    if success then
        print("Preferences loaded successfully")
    else
        print("Failed to load preferences")
    end
end)
```

### ServerPreferences:OnLoad(str, callback) {#on-load}

**Status:** `stable`

**Description:**
Internal method that processes loaded preference data string. Handles JSON decoding and data validation.

**Parameters:**
- `str` (string): JSON string containing preference data
- `callback` (function): Optional callback function

**Returns:**
None

**Example:**
```lua
-- This method is typically called internally
-- Manual usage would be:
local json_data = '{"ID_12345": {"hidename": true, "lastseen": 1640995200}}'
prefs:OnLoad(json_data, function(success)
    print("Data processed:", success)
end)
```

## Data Structure

### Server ID Generation

Server IDs are generated using the `MakeServerID` function:

```lua
-- Server ID format
local server_id = "ID_" .. tostring(smallhash(tostring(server_name)))
```

### Persistent Data Format

```lua
-- Example persistdata structure
{
    ["ID_12345"] = {
        hidename = true,           -- User chose to hide this server
        lastseen = 1640995200      -- Unix timestamp of last update
    },
    ["ID_67890"] = {
        lastseen = 1640995300      -- Only timestamp if no hiding
    }
}
```

### Profanity Server Cache

```lua
-- Example profanityservers structure
{
    ["ID_12345"] = true,    -- Server is hidden due to profanity
    ["ID_67890"] = false    -- Server contains profanity but is owner's server
}
```

## Usage Patterns

### Basic Server Filtering

```lua
-- Initialize preferences
local prefs = ServerPreferences()

-- Load existing preferences
prefs:Load(function(success)
    if success then
        print("Preferences loaded")
    end
end)

-- Check if server should be hidden
local server = {name = "Test Server", description = "Test Desc"}
if prefs:IsNameAndDescriptionHidden(server) then
    -- Don't display this server
    print("Server is hidden")
else
    -- Display server normally
    print("Server is visible")
end
```

### Manual Server Hiding

```lua
-- Toggle visibility for a server
local server_data = {
    name = "Unwanted Server",
    description = "Server I don't want to see"
}

-- Hide the server
prefs:ToggleNameAndDescriptionFilter(server_data)

-- Save the change
prefs:Save()
```

### Profanity Filter Management

```lua
-- Update profanity filtering for server list
local servers = GetServerListFromNetwork()
prefs:UpdateProfanityFilteredServers(servers)

-- Clear profanity cache when needed
prefs:ClearProfanityFilteredServers()

-- Check individual server
for _, server in ipairs(servers) do
    if not prefs:IsNameAndDescriptionHidden(server) then
        DisplayServer(server)
    end
end
```

## Integration Points

### Profile System Integration

The module integrates with the Profile system to check profanity filtering preferences:

```lua
-- Profanity filtering is enabled based on profile setting
if Profile:GetProfanityFilterServerNamesEnabled() then
    -- Perform profanity checks
end
```

### Network Integration

Works with TheNet for server information:

```lua
-- Get current server information
local name = TheNet:GetServerName()
local desc = TheNet:GetServerDescription()
local is_owner = TheNet:GetIsServerOwner(user_id)
```

### Stats Integration

Reports filtering actions to the stats system:

```lua
-- Metrics are sent when toggling server filters
Stats.PushMetricsEvent("toggleservernamefilter", user_id, data)
```

## Constants

### Data Expiration

- `USER_HISTORY_EXPIRY_TIME`: Controls how long server preference data is retained

### Save Configuration

- `ENCODE_SAVES`: Determines whether save data should be encoded
- `BRANCH`: Current game branch affecting save file naming

## Related Modules

- [Profile](./playerprofile.md): User profile settings including profanity filter preferences
- [Stats](../core-systems/index.md#stats): Metrics reporting for user actions
- [JSON](./json.md): JSON encoding/decoding for persistent storage
- [ProfanityFilter](../core-systems/index.md#profanity-filter): Content filtering system
