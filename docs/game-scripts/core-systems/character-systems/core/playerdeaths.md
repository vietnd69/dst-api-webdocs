---
id: playerdeaths
title: PlayerDeaths
description: System for tracking and managing player death records and statistics
sidebar_position: 4
slug: game-scripts/core-systems/playerdeaths
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# PlayerDeaths

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `PlayerDeaths` class provides a system for tracking and managing player death records. It maintains a persistent database of player deaths, including information such as days survived, cause of death, and killer details. The system automatically manages storage limits and provides sorting capabilities for death records.

## Usage Example

```lua
-- Create a new PlayerDeaths instance
local deaths = PlayerDeaths()

-- Record a player death
local death_data = {
    days_survived = 25,
    killed_by = "Spider Warrior",
    character = "wilson",
    pk = true
}
deaths:OnDeath(death_data)

-- Get all death records
local death_records = deaths:GetRows()
```

## Class Methods

### PlayerDeaths() {#playerdeaths-constructor}

**Status:** `stable`

**Description:**
Creates a new PlayerDeaths instance with initialized persistent data storage and default sorting configuration.

**Returns:**
- (PlayerDeaths): New PlayerDeaths instance

**Example:**
```lua
local deaths = PlayerDeaths()
```

### deaths:Reset() {#reset}

**Status:** `stable`

**Description:**
Clears all stored death records and saves the empty data to persistent storage.

**Example:**
```lua
deaths:Reset()
-- All death records are now cleared
```

### deaths:OnDeath(row) {#ondeath}

**Status:** `stable`

**Description:**
Records a new player death event. On Xbox One, automatically attempts to resolve killer network IDs for PvP deaths.

**Parameters:**
- `row` (table): Death record data containing information about the death event

**Death Record Structure:**
- `days_survived` (number): Number of days the player survived
- `killed_by` (string): Name or description of what killed the player
- `character` (string): Character prefab name
- `pk` (boolean): Whether this was a player kill
- `netid` (string): Network ID of killer (set automatically on XB1)

**Example:**
```lua
local death_record = {
    days_survived = 42,
    killed_by = "Deerclops",
    character = "wendy",
    pk = false
}
deaths:OnDeath(death_record)
```

### deaths:GetRows() {#getrows}

**Status:** `stable`

**Description:**
Returns all stored death records in their current sorted order.

**Returns:**
- (table): Array of death record tables

**Example:**
```lua
local all_deaths = deaths:GetRows()
for i, death in ipairs(all_deaths) do
    print("Death", i, "Days survived:", death.days_survived)
end
```

### deaths:Sort(field) {#sort}

**Status:** `stable`

**Description:**
Sorts death records by the specified field. Automatically determines sort order based on field type (string vs number).

**Parameters:**
- `field` (string, optional): Field name to sort by. If nil, uses default sorting by days_survived

**Sorting Behavior:**
- **String fields**: Sorted alphabetically (ascending)
- **Number fields**: Sorted numerically (descending)
- **Default**: Sorts by `days_survived` in descending order

**Example:**
```lua
-- Sort by days survived (default)
deaths:Sort()

-- Sort by character name
deaths:Sort("character")

-- Sort by killer name
deaths:Sort("killed_by")
```

### deaths:GetSaveName() {#getsavename}

**Status:** `stable`

**Description:**
Returns the filename used for persistent storage. Uses different names for development and release branches.

**Returns:**
- (string): Save file name ("morgue" for release, "morgue_dev" for development)

**Example:**
```lua
local save_name = deaths:GetSaveName()
-- Returns "morgue" or "morgue_dev" depending on BRANCH
```

### deaths:Save(callback) {#save}

**Status:** `stable`

**Description:**
Saves death records to persistent storage. Automatically sorts records and enforces the 40-record limit before saving.

**Parameters:**
- `callback` (function, optional): Function called after save completion with success status

**Storage Management:**
- Records are sorted before saving
- Maximum of 40 records are kept (oldest removed if exceeded)
- Only saves if data has been modified (dirty flag)

**Example:**
```lua
-- Save with callback
deaths:Save(function(success)
    if success then
        print("Death records saved successfully")
    else
        print("Failed to save death records")
    end
end)

-- Save without callback
deaths:Save()
```

### deaths:Load(callback) {#load}

**Status:** `stable`

**Description:**
Loads death records from persistent storage.

**Parameters:**
- `callback` (function, optional): Function called after load completion with success status

**Example:**
```lua
deaths:Load(function(success)
    if success then
        print("Death records loaded successfully")
        local records = deaths:GetRows()
        print("Loaded", #records, "death records")
    else
        print("Failed to load death records")
    end
end)
```

### deaths:Set(str, callback) {#set}

**Status:** `stable`

**Description:**
Sets death records from a JSON string. Used internally by the Load system.

**Parameters:**
- `str` (string): JSON-encoded death records data
- `callback` (function, optional): Function called after processing with success status

**Example:**
```lua
-- This is typically used internally
local json_data = '[]' -- Empty death records
deaths:Set(json_data, function(success)
    print("Set operation completed:", success)
end)
```

## Properties

### deaths.persistdata {#persistdata}

**Type:** `table`

**Description:** Array containing all death record entries

### deaths.dirty {#dirty}

**Type:** `boolean`

**Description:** Flag indicating whether data has been modified and needs saving

### deaths.sort_function {#sort-function}

**Type:** `function`

**Description:** Default sorting function that sorts by days_survived in descending order

## Storage Format

Death records are stored as JSON arrays with the following structure:

```lua
{
    {
        days_survived = 25,
        killed_by = "Spider Warrior",
        character = "wilson",
        pk = false
    },
    {
        days_survived = 42,
        killed_by = "Deerclops", 
        character = "wendy",
        pk = false,
        netid = "12345" -- On Xbox One for PvP deaths
    }
}
```

## Common Usage Patterns

### Recording Multiple Deaths
```lua
local deaths = PlayerDeaths()

-- Record various death events
deaths:OnDeath({days_survived = 10, killed_by = "Hounds", character = "wilson"})
deaths:OnDeath({days_survived = 25, killed_by = "Deerclops", character = "wendy"})
deaths:OnDeath({days_survived = 5, killed_by = "Starvation", character = "wickerbottom"})

-- Get sorted records (by days survived, descending)
local records = deaths:GetRows()
```

### Analyzing Death Statistics
```lua
local deaths = PlayerDeaths()
deaths:Load(function(success)
    if success then
        local records = deaths:GetRows()
        
        -- Find best survival record
        local best_survival = records[1] -- Already sorted by days_survived desc
        print("Best survival:", best_survival.days_survived, "days")
        
        -- Count deaths by character
        local character_deaths = {}
        for _, death in ipairs(records) do
            character_deaths[death.character] = (character_deaths[death.character] or 0) + 1
        end
    end
end)
```

## Related Modules

- [PlayerHistory](./playerhistory.md): Tracks players encountered during gameplay
- [PlayerProfile](./playerprofile.md): Manages player preferences and customization data
