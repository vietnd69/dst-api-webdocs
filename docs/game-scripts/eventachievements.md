---
id: eventachievements
title: Eventachievements
description: Manages event-specific achievement data andquest tracking for seasonal festivals.
tags: [achievement, event, quest, inventory, festival]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 17f01b78
system_scope: world
---

# Eventachievements

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Eventachievements` is a singleton-style component that stores, organizes, and provides access to achievement and quest data associated with seasonal festival events (e.g., Festival of the Deep). It maintains hierarchical achievement structures (grouped by categories and seasons) and supports dynamic loading/unloading of event-specific achievements based on the active event and season. It relies on `TheInventory` for unlocked status checks and temporary unlocks.

## Usage example
```lua
-- Example: Load achievements for the current active festival event
local data = {
    eventid = "WORLD_FESTIVAL_EVENT",
    achievements = {
        {
            name = "Festival Tasks",
            data = {
                { achievementid = "festival_fish_1", name = "First Catch" },
                { achievementid = "festival_fish_5", name = "Fish Master" }
            }
        }
    },
    seasons = {"season_one"}
}
TheFrontEnd.components.eventachievements:LoadAchievementsForEvent(data)

-- Example: Check if an achievement is unlocked
local is_unlocked = TheFrontEnd.components.eventachievements:IsAchievementUnlocked("WORLD_FESTIVAL_EVENT", "season_one", "festival_fish_1")
```

## Dependencies & tags
**Components used:** `TheInventory` (used for checking/unlocking achievements)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_achievement_list` | table | `{}` | Hierarchical map: `eventid -> season -> category list`. Stores grouped achievements. |
| `_achievement_list_byid` | table | `{}` | Flattened lookup map: `achievementid -> achievement data`. Only populated for active event + season. |
| `_quest_data` | table | `{}` | Stores current quest configuration data (e.g., version, day, special quests). |

## Main functions
### `LoadAchievementsForEvent(data)`
*   **Description:** Loads achievement data for a specific event, season(s), and implementation (if provided). Builds both the hierarchical `_achievement_list` and the flattened `_achievement_list_byid` map (only for the currently active event and season).
*   **Parameters:** `data` (table) - a table containing:
    *   `eventid` (string): Identifier of the event (e.g., `"WORLD_FESTIVAL_EVENT"`).
    *   `achievements` (table): List of achievement category tables, each with `name` and `data` (list of achievement objects).
    *   `seasons` (table): List of season identifiers (strings).
    *   `impl` (optional, table): Optional module with `AddTestFunctions()` for test mode.
*   **Returns:** Nothing.
*   **Error states:** No-op if event/season is not active — `_achievement_list_byid` remains unchanged.

### `GetActiveAchievementsIdList()`
*   **Description:** Returns the flattened achievement list for the currently active event and season.
*   **Parameters:** None.
*   **Returns:** table (`_achievement_list_byid`) — map from `achievementid` (string) to achievement data (table).

### `GetAchievementsCategoryList(eventid, season)`
*   **Description:** Returns the list of achievement categories for a given event and season.
*   **Parameters:** 
    *   `eventid` (string) — event identifier.
    *   `season` (string) — season identifier.
*   **Returns:** table — list of category tables (each containing `name` and `data`), or `nil` if not found.

### `FindAchievementData(eventid, season, achievementid)`
*   **Description:** Searches for and returns the full achievement data table by `achievementid` within a given event/season.
*   **Parameters:** 
    *   `eventid` (string)
    *   `season` (string)
    *   `achievementid` (string)
*   **Returns:** table (achievement data) or `nil` if not found.

### `IsAchievementUnlocked(eventid, season, achievementid)`
*   **Description:** Checks whether an achievement is unlocked for the given event and season.
*   **Parameters:** 
    *   `eventid` (string)
    *   `season` (string)
    *   `achievementid` (string)
*   **Returns:** boolean — `true` if unlocked, `false` otherwise.

### `GetNumAchievementsUnlocked(eventid, season)`
*   **Description:** Counts total and unlocked achievements for the given event and season.
*   **Parameters:** 
    *   `eventid` (string)
    *   `season` (string)
*   **Returns:** 
    *   `unlocked` (number) — count of unlocked achievements.
    *   `total` (number) — total number of achievements.

### `SetAchievementTempUnlocked(achievementid)`
*   **Description:** Temporarily unlocks an achievement for the active festival event (e.g., for testing).
*   **Parameters:** `achievementid` (string).
*   **Returns:** Nothing.
*   **Error states:** Prints debug output indicating success/failure.

### `IsActiveAchievement(achievementid)`
*   **Description:** Checks whether an achievement is currently loaded for the active festival event (i.e., present in `_achievement_list_byid`).
*   **Parameters:** `achievementid` (string).
*   **Returns:** boolean — `true` if present, `false` otherwise.

### `GetAllUnlockedAchievements(eventid, season)`
*   **Description:** Retrieves all unlocked achievements for the given event and season.
*   **Parameters:** 
    *   `eventid` (string)
    *   `season` (string)
*   **Returns:** table — list of unlocked achievement IDs (strings), or empty table `{}`.

### `SetActiveQuests(quest_data)`
*   **Description:** Sets the current quest configuration data (e.g., version, day).
*   **Parameters:** `quest_data` (table) — expected to contain `version`, `event_day`, `quest_day`, `special1.quest`, `special2.quest`.
*   **Returns:** Nothing.

### `BuildFullQuestName(quest_id, character)`
*   **Description:** Constructs a full quest instance name using version, day, and optional character suffix (for special quests).
*   **Parameters:** 
    *   `quest_id` (string) — base quest identifier.
    *   `character` (string or `nil`) — character name (e.g., `"WX78"`) for special quests.
*   **Returns:** string — formatted quest name (e.g., `"quest_fish-001-005-WX78"`).

### `ParseFullQuestName(quest_name)`
*   **Description:** Parses a full quest name into structured data.
*   **Parameters:** `quest_name` (string).
*   **Returns:** table with fields:
    *   `quest_id` (string)
    *   `version` (number)
    *   `day` (number)
    *   `character` (string or `nil`)
    *   `daily` (boolean or `nil`, inferred from `_achievement_list_byid`).
*   **Error states:** Includes legacy support for older formats (where `version` may be absent or at a different index).

## Events & listeners
None identified.