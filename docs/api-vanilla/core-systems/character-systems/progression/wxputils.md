---
id: wxputils
title: WXP Utils
description: Utility functions for managing Winter's Feast Experience Points (WXP) including level calculation, progress tracking, and festival event handling
sidebar_position: 4
slug: core-systems/wxputils
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# WXP Utils

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `wxputils` module provides utility functions for managing Winter's Feast Experience Points (WXP). It handles level calculations, progress tracking, and festival event status management for the seasonal progression system.

## Usage Example

```lua
-- Get current WXP level and progress
local level = wxputils.GetActiveLevel()
local percentage = wxputils.GetLevelPercentage()
local progress_string = wxputils.BuildProgressString()

print(string.format("Level %d (%s)", level, progress_string))
```

## Functions

### GetLevelPercentage() {#get-level-percentage}

**Status:** `stable`

**Description:**
Calculates the progress percentage towards the next level based on current WXP.

**Returns:**
- (number): Progress percentage as a decimal (0.0 to 1.0)

**Example:**
```lua
local progress = wxputils.GetLevelPercentage()
print(string.format("Progress: %.1f%%", progress * 100))
-- Output: "Progress: 67.3%"
```

### BuildProgressString() {#build-progress-string}

**Status:** `stable`

**Description:**
Creates a formatted string showing current progress towards the next level in "current/total" format.

**Returns:**
- (string): Formatted progress string using `STRINGS.UI.XPUTILS.XPPROGRESS` template

**Example:**
```lua
local progress_text = wxputils.BuildProgressString()
print(progress_text)
-- Output: "1,250 / 2,000" (depending on current WXP)
```

### GetLevel(festival_key, season) {#get-level}

**Status:** `stable`

**Description:**
Gets the WXP level for a specific festival event and season.

**Parameters:**
- `festival_key` (string): The festival identifier
- `season` (string): The season identifier

**Returns:**
- (number): WXP level for the specified festival/season

**Example:**
```lua
local winter_level = wxputils.GetLevel("winters_feast", "winter")
print("Winter's Feast level:", winter_level)
```

### GetActiveLevel() {#get-active-level}

**Status:** `stable`

**Description:**
Gets the WXP level for the currently active festival event.

**Returns:**
- (number): Current WXP level

**Example:**
```lua
local current_level = wxputils.GetActiveLevel()
print("Current level:", current_level)
```

### GetLevelForWXP(wxp) {#get-level-for-wxp}

**Status:** `stable`

**Description:**
Calculates what level corresponds to a given WXP amount.

**Parameters:**
- `wxp` (number): The WXP amount to convert

**Returns:**
- (number): The level that corresponds to the given WXP

**Example:**
```lua
local level = wxputils.GetLevelForWXP(5000)
print("5000 WXP equals level:", level)
```

### GetWXPForLevel(level) {#get-wxp-for-level}

**Status:** `stable`

**Description:**
Gets the WXP requirements for a specific level and the next level.

**Parameters:**
- `level` (number): The level to query

**Returns:**
- (number): WXP required for the specified level
- (number): WXP required for the next level

**Example:**
```lua
local current_wxp, next_wxp = wxputils.GetWXPForLevel(5)
print(string.format("Level 5: %d WXP, Level 6: %d WXP", current_wxp, next_wxp))
-- Output: "Level 5: 2000 WXP, Level 6: 3000 WXP"
```

### GetActiveWXP() {#get-active-wxp}

**Status:** `stable`

**Description:**
Gets the current WXP amount for the active festival event.

**Returns:**
- (number): Current WXP amount

**Example:**
```lua
local current_wxp = wxputils.GetActiveWXP()
print("Current WXP:", current_wxp)
```

### GetEventStatus(festival_key, season, cb_fn) {#get-event-status}

**Status:** `stable`

**Description:**
Asynchronously retrieves the status of a festival event.

**Parameters:**
- `festival_key` (string): The festival identifier
- `season` (string): The season identifier  
- `cb_fn` (function): Callback function to receive the event status

**Example:**
```lua
wxputils.GetEventStatus("winters_feast", "winter", function(status)
    if status then
        print("Event is active:", status.is_active)
        print("Event end time:", status.end_time)
    end
end)
```

## Internal Functions

### GetLevelProgressFraction() {#get-level-progress-fraction}

**Status:** `stable` (internal)

**Description:**
Internal function that calculates the raw progress numbers for the current level.

**Returns:**
- (number): Current progress amount towards next level
- (number): Total amount needed for next level

**Example:**
```lua
-- Internal usage within wxputils
local function GetLevelProgressFraction()
    local level = TheInventory:GetWXPLevel(GetActiveFestivalEventServerName())
    local wxp = TheInventory:GetWXP(GetActiveFestivalEventServerName())
    
    local curr_level_wxp = TheItems:GetWXPForLevel(level)
    local next_level_wxp = TheItems:GetWXPForLevel(level+1)
    return (wxp - curr_level_wxp), (next_level_wxp - curr_level_wxp)
end
```

## WXP System Architecture

### Level Progression

The WXP system uses a progressive leveling structure:
- Each level requires a specific amount of WXP
- WXP requirements typically increase with higher levels
- Progress is tracked per festival event and season

### Festival Integration

WXP is tied to seasonal festival events:
- Different festivals have separate WXP pools
- Each season within a festival can have its own progression
- The "active" event refers to the currently running festival

### Data Sources

WXP data comes from several game systems:
- `TheInventory`: Player's WXP amounts and levels
- `TheItems`: Level requirements and WXP thresholds
- Festival event system: Active event determination

## Common Usage Patterns

### Creating Progress Displays

```lua
-- Basic progress display
local level = wxputils.GetActiveLevel()
local progress = wxputils.BuildProgressString()
local percentage = wxputils.GetLevelPercentage()

local display_text = string.format("Level %d - %s (%.1f%%)", 
    level, progress, percentage * 100)
```

### Level Requirement Calculations

```lua
-- Calculate how much WXP is needed to reach a target level
local current_wxp = wxputils.GetActiveWXP()
local target_level = 10
local required_wxp = wxputils.GetWXPForLevel(target_level)

local wxp_needed = required_wxp - current_wxp
if wxp_needed > 0 then
    print(string.format("Need %d more WXP to reach level %d", wxp_needed, target_level))
else
    print("Already at or above target level")
end
```

### Festival Event Monitoring

```lua
-- Monitor multiple festival events
local festivals = {
    {"winters_feast", "winter"},
    {"year_of_the_pig", "spring"},
    {"forge", "summer"}
}

for _, festival_data in ipairs(festivals) do
    local festival_key, season = festival_data[1], festival_data[2]
    wxputils.GetEventStatus(festival_key, season, function(status)
        local level = wxputils.GetLevel(festival_key, season)
        print(string.format("%s (%s): Level %d, Active: %s", 
            festival_key, season, level, tostring(status and status.is_active)))
    end)
end
```

### Progress Tracking

```lua
-- Track progress over time
local function trackProgress()
    local current_level = wxputils.GetActiveLevel()
    local current_wxp = wxputils.GetActiveWXP()
    local current_percentage = wxputils.GetLevelPercentage()
    
    -- Store or display progress data
    local progress_data = {
        level = current_level,
        wxp = current_wxp,
        percentage = current_percentage,
        timestamp = os.time()
    }
    
    return progress_data
end
```

## Integration Points

### TheInventory Integration

WXP utilities rely heavily on `TheInventory` for player data:
- `TheInventory:GetWXPLevel(event_name)`: Gets player's level for event
- `TheInventory:GetWXP(event_name)`: Gets player's WXP for event

### TheItems Integration

Level calculations use `TheItems` for thresholds:
- `TheItems:GetLevelForWXP(wxp)`: Converts WXP to level
- `TheItems:GetWXPForLevel(level)`: Gets WXP requirement for level

### Festival Event System

Festival utilities integrate with the event system:
- `GetActiveFestivalEventServerName()`: Gets current active event
- `GetFestivalEventServerName(key, season)`: Builds event names

## Error Handling

WXP utilities include basic error handling:

```lua
-- Safe level checking
local function safeGetLevel(festival_key, season)
    local success, level = pcall(wxputils.GetLevel, festival_key, season)
    return success and level or 0
end

-- Safe progress calculation
local function safeGetProgress()
    local success, percentage = pcall(wxputils.GetLevelPercentage)
    return success and percentage or 0
end
```

## Related Modules

- [TheInventory](./inventory.md): Player inventory and progression data
- [TheItems](./items.md): Item definitions and level requirements
- [Festival Events](./festivals.md): Seasonal event management system
