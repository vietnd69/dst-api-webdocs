---
id: scrapbook-partitions
title: Scrapbook Partitions
description: Data management system for tracking scrapbook discovery progress and synchronization
sidebar_position: 4

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Scrapbook Partitions

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `scrapbookpartitions` module provides a sophisticated data management system for tracking player discovery progress in Don't Starve Together's scrapbook. It handles data partitioning, character-specific inspection tracking, backend synchronization, and persistent storage using compact bit-field encoding.

## Usage Example

```lua
-- Check if a prefab has been seen in game
if TheScrapbookPartitions:WasSeenInGame("wilson") then
    print("Wilson has been encountered")
end

-- Record that a character inspected a prefab
TheScrapbookPartitions:SetInspectedByCharacter("deerclops", "wilson")

-- Check scrapbook viewing status
if TheScrapbookPartitions:WasViewedInScrapbook("beefalo") then
    print("Beefalo entry was viewed in scrapbook")
end

-- Get discovery level (0=unknown, 1=seen, 2=inspected)
local level = TheScrapbookPartitions:GetLevelFor("chester")
print("Chester discovery level:", level)
```

## Architecture

### Data Storage Structure
The system uses a 32-bit integer to store scrapbook data for each prefab:
- **Bits 1-8**: Flags (viewed in scrapbook, etc.)
- **Bits 9-32**: Character inspection mask (24 character slots)

### Partitioning System
Data is distributed across 16 buckets (0-15) using hash-based partitioning to optimize backend storage and reduce load.

## Constants

### FLAGS {#flags-constants}

**Status:** `stable`

**Description:** Bit flags for tracking scrapbook states.

| Flag | Value | Description |
|------|-------|-------------|
| `VIEWED_IN_SCRAPBOOK` | `0x00000001` | Entry was viewed in scrapbook UI |

### LOOKUP_LIST {#lookup-list-constants}

**Status:** `stable`

**Description:** Character bit masks for tracking per-character inspections.

| Character | Bit Mask | Slot |
|-----------|----------|------|
| `wilson` | `0x00000100` | 1 |
| `willow` | `0x00000200` | 2 |
| `wolfgang` | `0x00000400` | 3 |
| `wendy` | `0x00000800` | 4 |
| `wx78` | `0x00001000` | 5 |
| `wickerbottom` | `0x00002000` | 6 |
| `woodie` | `0x00004000` | 7 |
| `wes` | `0x00008000` | 8 |
| `waxwell` | `0x00010000` | 9 |
| `wathgrithr` | `0x00020000` | 10 |
| `webber` | `0x00040000` | 11 |
| `winona` | `0x00080000` | 12 |
| `warly` | `0x00100000` | 13 |
| `wortox` | `0x00200000` | 14 |
| `wormwood` | `0x00400000` | 15 |
| `wurt` | `0x00800000` | 16 |
| `walter` | `0x01000000` | 17 |
| `wanda` | `0x02000000` | 18 |

### BUCKETS_MASK {#buckets-mask}

**Value:** `0xF` (16 buckets)

**Status:** `stable`

**Description:** Mask for distributing data across storage buckets.

## Class: ScrapbookPartitions

### Constructor

```lua
local ScrapbookPartitions = Class(function(self)
    self.storage = {}
    self.dirty_buckets = {}
end)
```

## Core Methods

### scrapbook:RedirectThing(thing) {#redirect-thing}

**Status:** `stable`

**Description:**
Converts entity instances or other objects to their string representation for scrapbook tracking.

**Parameters:**
- `thing` (EntityScript|string): Entity instance or prefab name

**Returns:**
- (string): Prefab name for scrapbook tracking

**Example:**
```lua
-- With entity instance
local prefab_name = TheScrapbookPartitions:RedirectThing(inst)

-- With string
local prefab_name = TheScrapbookPartitions:RedirectThing("wilson")
```

### scrapbook:WasSeenInGame(thing) {#was-seen-in-game}

**Status:** `stable`

**Description:**
Checks if a prefab has been encountered in the game world.

**Parameters:**
- `thing` (string|EntityScript): Prefab name or entity to check

**Returns:**
- (boolean): True if the prefab has been seen

**Example:**
```lua
if TheScrapbookPartitions:WasSeenInGame("deerclops") then
    print("Deerclops has been encountered")
end
```

### scrapbook:SetSeenInGame(thing) {#set-seen-in-game}

**Status:** `stable`

**Description:**
Marks a prefab as having been encountered in the game world.

**Parameters:**
- `thing` (string|EntityScript): Prefab name or entity to mark as seen

**Example:**
```lua
-- When player encounters a new creature
TheScrapbookPartitions:SetSeenInGame("beefalo")
```

### scrapbook:WasViewedInScrapbook(thing) {#was-viewed-in-scrapbook}

**Status:** `stable`

**Description:**
Checks if a prefab entry was viewed in the scrapbook UI.

**Parameters:**
- `thing` (string|EntityScript): Prefab name or entity to check

**Returns:**
- (boolean): True if viewed in scrapbook

**Example:**
```lua
if not TheScrapbookPartitions:WasViewedInScrapbook("chester") then
    -- Show "new" indicator in scrapbook
    ShowNewEntryIndicator("chester")
end
```

### scrapbook:SetViewedInScrapbook(thing, value) {#set-viewed-in-scrapbook}

**Status:** `stable`

**Description:**
Marks a prefab entry as viewed or unviewed in the scrapbook UI.

**Parameters:**
- `thing` (string|EntityScript): Prefab name or entity
- `value` (boolean): True to mark as viewed, false to mark as unviewed (optional, defaults to true)

**Example:**
```lua
-- Mark as viewed when player opens scrapbook entry
TheScrapbookPartitions:SetViewedInScrapbook("spider", true)

-- Mark as new when content is updated
TheScrapbookPartitions:SetViewedInScrapbook("spider", false)
```

### scrapbook:WasInspectedByCharacter(thing, character) {#was-inspected-by-character}

**Status:** `stable`

**Description:**
Checks if a specific character has personally inspected a prefab.

**Parameters:**
- `thing` (string|EntityScript): Prefab name or entity to check
- `character` (string): Character prefab name

**Returns:**
- (boolean): True if the character has inspected this prefab

**Example:**
```lua
if TheScrapbookPartitions:WasInspectedByCharacter("tentacle", "wilson") then
    print("Wilson has inspected a tentacle")
end
```

### scrapbook:SetInspectedByCharacter(thing, character) {#set-inspected-by-character}

**Status:** `stable`

**Description:**
Records that a specific character has inspected a prefab.

**Parameters:**
- `thing` (string|EntityScript): Prefab name or entity
- `character` (string): Character prefab name

**Example:**
```lua
-- When player inspects something
local function OnInspect(inst, prefab)
    TheScrapbookPartitions:SetInspectedByCharacter(prefab, inst.prefab)
end
```

### scrapbook:GetLevelFor(thing) {#get-level-for}

**Status:** `stable`

**Description:**
Returns the discovery level for a prefab.

**Parameters:**
- `thing` (string|EntityScript): Prefab name or entity to check

**Returns:**
- (number): Discovery level
  - `0`: Unknown/never seen
  - `1`: Seen but not inspected
  - `2`: Seen and inspected

**Example:**
```lua
local level = TheScrapbookPartitions:GetLevelFor("koalefant_summer")
if level == 0 then
    print("Never encountered")
elseif level == 1 then
    print("Seen but not inspected")
elseif level == 2 then
    print("Fully discovered")
end
```

## Teaching/Learning Methods

### scrapbook:TryToTeachScrapbookData_Random(numofentries) {#teach-random}

**Status:** `stable`

**Description:**
Randomly teaches a specified number of unknown scrapbook entries.

**Parameters:**
- `numofentries` (number): Number of entries to teach

**Returns:**
- (boolean): True if any entries were taught

**Example:**
```lua
-- Give player some random scrapbook knowledge
local learned = TheScrapbookPartitions:TryToTeachScrapbookData_Random(3)
if learned then
    print("Learned new scrapbook entries!")
end
```

### scrapbook:TryToTeachScrapbookData_Special(index) {#teach-special}

**Status:** `stable`

**Description:**
Teaches scrapbook entries from a special page collection.

**Parameters:**
- `index` (number): Special page index to teach from

**Returns:**
- (boolean): True if any entries were taught

### scrapbook:TryToTeachScrapbookData_Note(entry) {#teach-note}

**Status:** `stable`

**Description:**
Teaches a specific scrapbook entry and opens it in the UI.

**Parameters:**
- `entry` (string): Prefab name to teach and display

**Returns:**
- (boolean): Always returns true

**Example:**
```lua
-- When player finds a scrapbook note
TheScrapbookPartitions:TryToTeachScrapbookData_Note("ancient_statue")
```

### scrapbook:TryToTeachScrapbookData(is_server, inst) {#teach-scrapbook-data}

**Status:** `stable`

**Description:**
Main teaching function that determines what type of scrapbook data to teach based on the item.

**Parameters:**
- `is_server` (boolean): Whether this is running on the server
- `inst` (EntityScript): The scrapbook item entity

**Returns:**
- (boolean): True if any entries were taught

## Storage and Synchronization

### scrapbook:Save(force_save) {#save}

**Status:** `stable`

**Description:**
Saves scrapbook data to local persistent storage.

**Parameters:**
- `force_save` (boolean): Whether to force saving all buckets (optional)

### scrapbook:Load() {#load}

**Status:** `stable`

**Description:**
Loads scrapbook data from local persistent storage.

### scrapbook:ApplyOnlineProfileData() {#apply-online-profile-data}

**Status:** `stable`

**Description:**
Merges online profile data with local scrapbook data.

**Returns:**
- (boolean): True if synchronization was successful

### scrapbook:UpdateStorageData(hashed, newdata) {#update-storage-data}

**Status:** `stable`

**Description:**
Updates a single storage entry and marks it for synchronization.

**Parameters:**
- `hashed` (number): Hash of the prefab name
- `newdata` (number): New bit-field data value

## Debug Methods

### scrapbook:DebugDeleteAllData() {#debug-delete-all}

**Status:** `stable`

**Description:**
Debug function to delete all scrapbook data.

**Example:**
```lua
-- WARNING: This erases all scrapbook progress
TheScrapbookPartitions:DebugDeleteAllData()
```

### scrapbook:DebugSeenEverything() {#debug-seen-everything}

**Status:** `stable`

**Description:**
Debug function to mark all prefabs as seen.

### scrapbook:DebugUnlockEverything() {#debug-unlock-everything}

**Status:** `stable`

**Description:**
Debug function to fully unlock all scrapbook entries.

## Global Instance

### TheScrapbookPartitions {#global-instance}

**Type:** `ScrapbookPartitions`

**Status:** `stable`

**Description:** Global instance of the scrapbook partitions system.

## Common Usage Patterns

### Player Discovery Tracking
```lua
-- When player encounters a new entity
local function OnEntitySeen(inst, viewer)
    if inst.prefab and viewer == ThePlayer then
        TheScrapbookPartitions:SetSeenInGame(inst.prefab)
    end
end

-- When player inspects something
local function OnEntityInspected(inst, viewer)
    if inst.prefab and viewer == ThePlayer then
        TheScrapbookPartitions:SetInspectedByCharacter(inst.prefab, viewer.prefab)
    end
end
```

### Scrapbook UI Integration
```lua
-- Check if entry should show "new" indicator
local function ShouldShowNewIndicator(prefab)
    return TheScrapbookPartitions:WasSeenInGame(prefab) and
           not TheScrapbookPartitions:WasViewedInScrapbook(prefab)
end

-- When player views an entry in scrapbook
local function OnScrapbookEntryViewed(prefab)
    TheScrapbookPartitions:SetViewedInScrapbook(prefab, true)
end
```

### Progress Calculation
```lua
-- Calculate completion statistics
local function GetScrapbookStats()
    local total = 0
    local seen = 0
    local inspected = 0
    
    local scrapbook_prefabs = require("scrapbook_prefabs")
    for prefab, included in pairs(scrapbook_prefabs) do
        if included then
            total = total + 1
            local level = TheScrapbookPartitions:GetLevelFor(prefab)
            if level >= 1 then
                seen = seen + 1
            end
            if level >= 2 then
                inspected = inspected + 1
            end
        end
    end
    
    return {
        total = total,
        seen = seen,
        inspected = inspected,
        seen_percent = math.floor((seen / total) * 100),
        inspected_percent = math.floor((inspected / total) * 100)
    }
end
```

### Modded Character Support
```lua
-- Modded characters fall back to Wilson for tracking
local function GetEffectiveCharacterForScrapbook(character)
    if table.contains(MODCHARACTERLIST, character) then
        return "wilson"
    end
    return character
end
```

## Technical Details

### Bit Field Structure
```lua
-- 32-bit storage layout:
-- 0x???????? = [CHARACTER_MASK:24][FLAGS:8]
-- 
-- Example for Wilson inspecting a spider:
-- 0x00000101 = Wilson bit (0x100) + Viewed flag (0x001)
```

### Hash Distribution
```lua
-- Prefabs are distributed across 16 buckets
local bucket = hash("spider") & 0xF  -- Bucket 0-15
```

### Storage Keys
```lua
-- Local storage: "scrapbook_0" through "scrapbook_15"
-- Backend storage: "SCRAPBOOK0" through "SCRAPBOOK15"
```

## Integration Notes

- Character inspection data is merged when switching between characters
- Modded characters use Wilson as a fallback for data storage
- Backend synchronization occurs with configurable delays
- Local storage provides offline functionality

## Related Modules

- [Scrapbook Prefabs](./scrapbook_prefabs.md): Registry of trackable prefabs
- [Class](./class.md): Base class system
- [Constants](./constants.md): Character list and configuration values
