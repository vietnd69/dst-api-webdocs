---
id: eventachievements
title: Event Achievements
description: System for managing event-based achievements and quest progression
sidebar_position: 2
slug: game-scripts/core-systems/eventachievements
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Event Achievements

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `EventAchievements` class manages event-based achievements and quest progression for seasonal events in Don't Starve Together. It handles loading achievement data, tracking completion status, and managing quest names for different events and seasons.

## Usage Example

```lua
-- Create event achievements manager
local event_achievements = EventAchievements()

-- Load achievements for an event
local achievement_data = {
    eventid = "winter_feast",
    seasons = {"winter"},
    achievements = {
        {
            name = "Winter Challenges",
            data = {
                {achievementid = "winter_quest_1", daily = false},
                {achievementid = "winter_quest_2", daily = true}
            }
        }
    }
}
event_achievements:LoadAchievementsForEvent(achievement_data)

-- Check if achievement is unlocked
local is_unlocked = event_achievements:IsAchievementUnlocked("winter_feast", "winter", "winter_quest_1")
print("Quest completed:", is_unlocked)
```

## Class: EventAchievements

### Constructor

#### EventAchievements() {#constructor}

**Status:** `stable`

**Description:**
Creates a new EventAchievements instance with empty achievement lists and quest data.

**Parameters:**
None

**Returns:**
- (EventAchievements): New EventAchievements instance

**Example:**
```lua
local event_achievements = EventAchievements()
```

### Methods

#### event_achievements:LoadAchievementsForEvent(data) {#load-achievements-for-event}

**Status:** `stable`

**Description:**
Loads achievement data for a specific event and seasons. If the event is currently active, it also creates a flattened list for quick access and adds test functions if provided.

**Parameters:**
- `data` (table): Achievement data structure containing:
  - `eventid` (string): Unique identifier for the event
  - `seasons` (table): Array of season names this data applies to
  - `achievements` (table): Array of achievement categories with their data
  - `impl` (table, optional): Implementation object with test functions

**Returns:**
None

**Example:**
```lua
local data = {
    eventid = "winter_feast",
    seasons = {"winter"},
    achievements = {
        {
            name = "Daily Challenges",
            data = {
                {achievementid = "daily_1", daily = true},
                {achievementid = "daily_2", daily = true}
            }
        },
        {
            name = "Event Challenges", 
            data = {
                {achievementid = "event_1", daily = false}
            }
        }
    },
    impl = achievement_test_functions
}
event_achievements:LoadAchievementsForEvent(data)
```

#### event_achievements:GetActiveAchievementsIdList() {#get-active-achievements-id-list}

**Status:** `stable`

**Description:**
Returns the flattened list of active achievements indexed by achievement ID. Only populated for the currently active event and season.

**Parameters:**
None

**Returns:**
- (table): Dictionary of achievement data indexed by achievement ID

**Example:**
```lua
local active_achievements = event_achievements:GetActiveAchievementsIdList()
for achievement_id, achievement_data in pairs(active_achievements) do
    print("Active achievement:", achievement_id, achievement_data.daily)
end
```

#### event_achievements:GetAchievementsCategoryList(eventid, season) {#get-achievements-category-list}

**Status:** `stable`

**Description:**
Returns the achievement categories for a specific event and season.

**Parameters:**
- `eventid` (string): The event identifier
- `season` (string): The season identifier

**Returns:**
- (table): Array of achievement categories with their data

**Example:**
```lua
local categories = event_achievements:GetAchievementsCategoryList("winter_feast", "winter")
for _, category in ipairs(categories) do
    print("Category:", category.name)
    for _, achievement in ipairs(category.data) do
        print("  Achievement:", achievement.achievementid)
    end
end
```

#### event_achievements:FindAchievementData(eventid, season, achievementid) {#find-achievement-data}

**Status:** `stable`

**Description:**
Finds and returns the data for a specific achievement within an event and season.

**Parameters:**
- `eventid` (string): The event identifier
- `season` (string): The season identifier
- `achievementid` (string): The achievement identifier to find

**Returns:**
- (table|nil): Achievement data table, or nil if not found

**Example:**
```lua
local achievement = event_achievements:FindAchievementData("winter_feast", "winter", "daily_1")
if achievement then
    print("Found achievement:", achievement.achievementid, "Daily:", achievement.daily)
end
```

#### event_achievements:IsAchievementUnlocked(eventid, season, achievementid) {#is-achievement-unlocked}

**Status:** `stable`

**Description:**
Checks if a specific achievement is unlocked for the given event and season.

**Parameters:**
- `eventid` (string): The event identifier
- `season` (string): The season identifier  
- `achievementid` (string): The achievement identifier to check

**Returns:**
- (boolean): True if the achievement is unlocked, false otherwise

**Example:**
```lua
local unlocked = event_achievements:IsAchievementUnlocked("winter_feast", "winter", "daily_1")
if unlocked then
    print("Achievement completed!")
end
```

#### event_achievements:GetNumAchievementsUnlocked(eventid, season) {#get-num-achievements-unlocked}

**Status:** `stable`

**Description:**
Returns the number of unlocked achievements and total achievements for an event and season.

**Parameters:**
- `eventid` (string): The event identifier
- `season` (string): The season identifier

**Returns:**
- (number): Number of unlocked achievements
- (number): Total number of achievements

**Example:**
```lua
local unlocked, total = event_achievements:GetNumAchievementsUnlocked("winter_feast", "winter")
print(string.format("Progress: %d/%d achievements completed", unlocked, total))
```

#### event_achievements:SetAchievementTempUnlocked(achievementid) {#set-achievement-temp-unlocked}

**Status:** `stable`

**Description:**
Temporarily unlocks an achievement for the active event. This is typically used for testing purposes.

**Parameters:**
- `achievementid` (string): The achievement identifier to temporarily unlock

**Returns:**
None

**Example:**
```lua
-- Temporarily unlock for testing
event_achievements:SetAchievementTempUnlocked("daily_1")
```

#### event_achievements:IsActiveAchievement(achievementid) {#is-active-achievement}

**Status:** `stable`

**Description:**
Checks if an achievement ID corresponds to an active achievement in the current event.

**Parameters:**
- `achievementid` (string): The achievement identifier to check

**Returns:**
- (boolean): True if the achievement is part of the active event

**Example:**
```lua
local is_active = event_achievements:IsActiveAchievement("daily_1")
if is_active then
    print("This achievement is part of the current event")
end
```

#### event_achievements:GetAllUnlockedAchievements(eventid, season) {#get-all-unlocked-achievements}

**Status:** `stable`

**Description:**
Returns all unlocked achievements for a specific event and season.

**Parameters:**
- `eventid` (string): The event identifier
- `season` (string): The season identifier

**Returns:**
- (table): Array of unlocked achievement IDs

**Example:**
```lua
local unlocked = event_achievements:GetAllUnlockedAchievements("winter_feast", "winter")
for _, achievement_id in ipairs(unlocked) do
    print("Unlocked:", achievement_id)
end
```

#### event_achievements:SetActiveQuests(quest_data) {#set-active-quests}

**Status:** `stable`

**Description:**
Sets the active quest data used for generating full quest names.

**Parameters:**
- `quest_data` (table): Quest data containing version, days, and special quest information

**Returns:**
None

**Example:**
```lua
local quest_data = {
    version = 1,
    event_day = 5,
    quest_day = 3,
    special1 = {quest = "special_quest_1"},
    special2 = {quest = "special_quest_2"}
}
event_achievements:SetActiveQuests(quest_data)
```

#### event_achievements:BuildFullQuestName(quest_id, character) {#build-full-quest-name}

**Status:** `stable`

**Description:**
Builds a full quest name including version, day, and character information for unique identification.

**Parameters:**
- `quest_id` (string): The base quest identifier
- `character` (string, optional): Character name for character-specific quests

**Returns:**
- (string): Full quest name with versioning and day information

**Example:**
```lua
-- Regular quest
local quest_name = event_achievements:BuildFullQuestName("daily_1")
-- Result: "daily_1-001-003"

-- Character-specific quest
local char_quest = event_achievements:BuildFullQuestName("special_quest_1", "wilson")
-- Result: "special_quest_1-001-003-wilson"
```

#### event_achievements:ParseFullQuestName(quest_name) {#parse-full-quest-name}

**Status:** `stable`

**Description:**
Parses a full quest name back into its component parts.

**Parameters:**
- `quest_name` (string): The full quest name to parse

**Returns:**
- (table): Parsed quest data containing quest_id, version, day, character, and daily flag

**Example:**
```lua
local parsed = event_achievements:ParseFullQuestName("daily_1-001-003-wilson")
print("Quest ID:", parsed.quest_id)        -- "daily_1"
print("Version:", parsed.version)          -- 1
print("Day:", parsed.day)                  -- 3
print("Character:", parsed.character)      -- "wilson"
print("Is Daily:", parsed.daily)           -- true/false
```

## Quest Name Format

Quest names follow a specific format for versioning and tracking:

**Format:** `quest_id-version-day[-character]`

- `quest_id`: Base quest identifier
- `version`: 3-digit version number (e.g., "001")
- `day`: 3-digit day number (event_day for dailies, quest_day for others)
- `character`: Optional character name for character-specific quests

## Integration with Game Systems

### Inventory System

The EventAchievements system integrates with `TheInventory` to:
- Check achievement unlock status
- Set temporary unlocks for testing
- Retrieve server-specific achievement data

### Festival Events

Works with festival event functions:
- `GetFestivalEventSeasons()`: Get seasons for an event
- `GetFestivalEventServerName()`: Get server name for event/season
- `GetActiveFestivalEventServerName()`: Get current active event server name

## Related Modules

- [Achievements](./achievements.md): Core achievement system
- [Events](./events.md): Event handling system used for achievement triggers
- [Player Profile](./playerprofile.md): Player data storage for achievement progress
- [Frontend](./frontend.md): UI components for displaying achievement progress
