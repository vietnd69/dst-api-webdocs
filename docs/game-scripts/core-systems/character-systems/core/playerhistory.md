---
id: playerhistory
title: PlayerHistory
description: System for tracking and managing history of players encountered during gameplay
sidebar_position: 3
slug: game-scripts/core-systems/playerhistory
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# PlayerHistory

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `PlayerHistory` class tracks and manages information about players encountered during gameplay sessions. It automatically records player interactions, tracks time played together, and maintains a persistent history database. The system supports automatic cleanup of old data and provides multiple sorting options for player records.

## Usage Example

```lua
-- Create a new PlayerHistory instance
local history = PlayerHistory()

-- Start tracking players automatically
history:StartListening()

-- Get player history sorted by most recent
local recent_players = history:GetRows()

-- Get players sorted by most time played together
local frequent_players = history:GetRowsMostTime()
```

## Class Methods

### PlayerHistory() {#playerhistory-constructor}

**Status:** `stable`

**Description:**
Creates a new PlayerHistory instance with initialized tracking data and configuration settings.

**Returns:**
- (PlayerHistory): New PlayerHistory instance

**Properties Initialized:**
- `target_max_entries`: 100 (maximum number of player records to maintain)

**Example:**
```lua
local history = PlayerHistory()
```

### history:StartListening() {#startlistening}

**Status:** `stable`

**Description:**
Begins automatic tracking of players in the current game session. Updates player information every 60 seconds.

**Example:**
```lua
local history = PlayerHistory()
history:StartListening()
-- Now automatically tracks players every 60 seconds
```

### history:Reset() {#reset}

**Status:** `stable`

**Description:**
Clears all stored player history data and saves the empty dataset to persistent storage.

**Example:**
```lua
history:Reset()
-- All player history is now cleared
```

### history:DiscardOldData() {#discardolddata}

**Status:** `stable`

**Description:**
Removes expired player entries and enforces the maximum entry limit. Automatically called during updates and loading.

**Cleanup Rules:**
- Removes entries older than `USER_HISTORY_EXPIRY_TIME`
- Keeps only the most recent `target_max_entries` (100) records
- Prioritizes recent activity over older records

**Example:**
```lua
-- This is typically called automatically
history:DiscardOldData()
```

### history:UpdateHistoryFromClientTable() {#updatehistoryfromclienttable}

**Status:** `stable`

**Description:**
Updates player history based on the current client table. Tracks time played together and updates last seen information.

**Tracking Features:**
- Records time played with each player
- Updates player names and character information
- Tracks server names where players were encountered
- Excludes the current player and dedicated server hosts

**Example:**
```lua
-- Called automatically by StartListening(), but can be called manually
history:UpdateHistoryFromClientTable()
```

### history:GetRows() {#getrows}

**Status:** `stable`

**Description:**
Returns all player history records sorted by most recently seen, then by time played together.

**Returns:**
- (table): Array of player history records sorted by recency

**Sort Priority:**
1. Last seen date (most recent first)
2. Time played together (most time first)  
3. Player name (alphabetical)

**Example:**
```lua
local recent_players = history:GetRows()
for i, player in ipairs(recent_players) do
    print("Player:", player.name, "Last seen:", player.last_seen_date)
end
```

### history:GetRowsMostTime() {#getrowsmosttime}

**Status:** `stable`

**Description:**
Returns all player history records sorted by time played together, then by recency.

**Returns:**
- (table): Array of player history records sorted by time played together

**Sort Priority:**
1. Time played together (most time first)
2. Last seen date (most recent first)
3. Player name (alphabetical)

**Example:**
```lua
local frequent_players = history:GetRowsMostTime()
for i, player in ipairs(frequent_players) do
    print("Player:", player.name, "Time played:", player.time_played_with, "seconds")
end
```

### history:RemoveUser(userid) {#removeuser}

**Status:** `stable`

**Description:**
Removes a specific player from the history database and saves the changes.

**Parameters:**
- `userid` (string): User ID of the player to remove

**Example:**
```lua
-- Remove a specific player from history
history:RemoveUser("KU_12345678")
```

### history:GetSaveName() {#getsavename}

**Status:** `stable`

**Description:**
Returns the filename used for persistent storage. Uses different names for different branches.

**Returns:**
- (string): Save file name ("player_history" for release, "player_history_BRANCH" for others)

**Example:**
```lua
local save_name = history:GetSaveName()
-- Returns "player_history" or "player_history_dev" depending on BRANCH
```

### history:Save(callback) {#save}

**Status:** `stable`

**Description:**
Saves player history to persistent storage if data has been modified.

**Parameters:**
- `callback` (function, optional): Function called after save completion

**Storage Format:**
- Version 2 format with seen_players data structure
- Only saves if data has been marked as dirty

**Example:**
```lua
history:Save(function()
    print("Player history saved")
end)
```

### history:Load(callback) {#load}

**Status:** `stable`

**Description:**
Loads player history from persistent storage and handles version migration.

**Parameters:**
- `callback` (function, optional): Function called with success status after load completion

**Version Support:**
- Supports migration from version 1 (date-based) to version 2 (timestamp-based)
- Automatically discards old data after loading

**Example:**
```lua
history:Load(function(success)
    if success then
        print("Player history loaded successfully")
        local players = history:GetRows()
        print("Loaded", #players, "player records")
    else
        print("Failed to load player history")
    end
end)
```

### history:LoadDataVersion1(data) {#loaddataversion1}

**Status:** `stable`

**Description:**
Handles migration from version 1 player history format to current format. Converts date strings to timestamps.

**Parameters:**
- `data` (table): Version 1 format player history data

**Migration Process:**
- Converts string dates (YYYYMMDD) to Unix timestamps
- Preserves most recent data for duplicate players
- Updates data structure to version 2 format

**Example:**
```lua
-- This is called automatically during Load() for version 1 data
-- Not typically called manually
```

## Properties

### history.seen_players {#seen-players}

**Type:** `table`

**Description:** Dictionary of player data indexed by user ID

### history.seen_players_updatetime {#seen-players-updatetime}

**Type:** `table`

**Description:** Tracking table for when each player was last updated

### history.task {#task}

**Type:** `Task`

**Description:** Periodic task handle for automatic player tracking updates

### history.dirty {#dirty}

**Type:** `boolean`

**Description:** Flag indicating whether data has been modified and needs saving

### history.target_max_entries {#target-max-entries}

**Type:** `number`

**Description:** Maximum number of player records to maintain (default: 100)

## Player Record Structure

Each player record contains the following information:

```lua
{
    userid = "KU_12345678",        -- Klei user ID
    netid = "123",                 -- Network ID for current session
    name = "PlayerName",           -- Display name
    time_played_with = 3600,       -- Total seconds played together
    prefab = "wilson",             -- Character prefab name
    server_name = "Server Name",   -- Name of server where encountered
    last_seen_date = 1640995200    -- Unix timestamp of last encounter
}
```

## Storage Versioning

### Version 1 (Legacy)
- Used string-based dates (YYYYMMDD format)
- Limited tracking capabilities
- Automatically migrated to Version 2

### Version 2 (Current)
- Uses Unix timestamps for precise tracking
- Enhanced player data structure
- Supports time played together tracking

## Common Usage Patterns

### Setting Up Player Tracking
```lua
local history = PlayerHistory()

-- Load existing data
history:Load(function(success)
    if success then
        print("Loaded existing player history")
    end
    
    -- Start automatic tracking
    history:StartListening()
end)
```

### Finding Frequent Players
```lua
local history = PlayerHistory()
history:Load(function(success)
    if success then
        local frequent = history:GetRowsMostTime()
        
        -- Get top 5 most played with players
        for i = 1, math.min(5, #frequent) do
            local player = frequent[i]
            local hours = math.floor(player.time_played_with / 3600)
            print(string.format("%s: %d hours", player.name, hours))
        end
    end
end)
```

### Recent Player Activity
```lua
local history = PlayerHistory()
local recent = history:GetRows()

-- Check recent activity
for _, player in ipairs(recent) do
    local days_ago = (os.time() - player.last_seen_date) / (24 * 60 * 60)
    if days_ago < 7 then
        print(player.name, "seen", math.floor(days_ago), "days ago")
    end
end
```

## Constants

### USER_HISTORY_EXPIRY_TIME

**Description:** Time limit for keeping player history records (referenced but not defined in this module)

## Related Modules

- [PlayerDeaths](./playerdeaths.md): Tracks player death records and statistics
- [PlayerProfile](./playerprofile.md): Manages player preferences and customization data
- [TheNet](../networking.md): Provides client table information for player tracking
