---
id: achievements
title: Achievements
description: Achievement definitions and platform integration for Don't Starve Together
sidebar_position: 1
slug: /game-scripts/core-systems/achievements
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Achievements

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `achievements.lua` module defines all available achievements in Don't Starve Together and provides platform-specific identifiers for Steam and PlayStation Network integration. It contains a simple array of achievement definitions used by the game's achievement tracking system.

## Usage Example

```lua
-- Access the achievements table
local achievements = require("achievements")

-- Iterate through all achievements
for i, achievement in ipairs(achievements) do
    print("Achievement:", achievement.name)
    print("Steam ID:", achievement.id.steam)
    print("PSN ID:", achievement.id.psn)
end

-- Find specific achievement
local function FindAchievement(name)
    for _, achievement in ipairs(Achievements) do
        if achievement.name == name then
            return achievement
        end
    end
    return nil
end
```

## Functions

### ACHIEVEMENT(id, name) {#achievement}

**Status:** `stable`

**Description:**
Helper function that creates an achievement definition with platform-specific identifiers.

**Parameters:**
- `id` (string): Numeric ID as string, used for PSN trophy ID
- `name` (string): Achievement code name used to reference the achievement

**Returns:**
- (table): Achievement definition with name and platform IDs

**Example:**
```lua
local achievement = ACHIEVEMENT("1", "survive_20")
-- Returns: { 
--     name = "survive_20", 
--     id = { 
--         steam = "1_survive_20", 
--         psn = 1 
--     } 
-- }
```

**Version History:**
- Current implementation in build 676042

## Data Structures

### Achievement Definition

```lua
{
    name = "achievement_name",        -- Code name for referencing
    id = {
        steam = "id_name",           -- Steam achievement ID format
        psn = number                 -- PlayStation Network trophy ID
    }
}
```

### Achievements Table

The module exports an array containing all 35 achievement definitions:

| Index | ID | Name | Steam ID | PSN ID |
|-------|----|----- |----------|--------|
| 1 | 1 | `survive_20` | `1_survive_20` | 1 |
| 2 | 2 | `survive_35` | `2_survive_35` | 2 |
| 3 | 3 | `survive_55` | `3_survive_55` | 3 |
| 4 | 4 | `survive_70` | `4_survive_70` | 4 |
| 5 | 5 | `build_researchlab` | `5_build_researchlab` | 5 |
| 6 | 6 | `build_researchlab2` | `6_build_researchlab2` | 6 |
| 7 | 7 | `build_researchlab3` | `7_build_researchlab3` | 7 |
| 8 | 8 | `build_researchlab4` | `8_build_researchlab4` | 8 |
| 9 | 9 | `wormhole_used` | `9_wormhole_used` | 9 |
| 10 | 10 | `pigking_trader` | `10_pigking_trader` | 10 |
| 11 | 11 | `growfrombutterfly` | `11_growfrombutterfly` | 11 |
| 12 | 12 | `honey_harvester` | `12_honey_harvester` | 12 |
| 13 | 13 | `sewing_kit` | `13_sewing_kit` | 13 |
| 14 | 14 | `pigman_posse` | `14_pigman_posse` | 14 |
| 15 | 15 | `rocky_posse` | `15_rocky_posse` | 15 |
| 16 | 16 | `hatch_tallbirdegg` | `16_hatch_tallbirdegg` | 16 |
| 17 | 17 | `pacify_forest` | `17_pacify_forest` | 17 |
| 18 | 18 | `cave_entrance_opened` | `18_cave_entrance_opened` | 18 |
| 19 | 19 | `survive_earthquake` | `19_survive_earthquake` | 19 |
| 20 | 20 | `tentacle_pillar_hole_used` | `20_tentacle_pillar_hole_used` | 20 |
| 21 | 21 | `snail_armour_set` | `21_snail_armour_set` | 21 |
| 22 | 22 | `join_game` | `22_join_game` | 22 |
| 23 | 23 | `host_for_days` | `23_host_for_days` | 23 |
| 24 | 24 | `hasrevivedplayer` | `24_hasrevivedplayer` | 24 |
| 25 | 25 | `helping_hand` | `25_helping_hand` | 25 |
| 26 | 26 | `party_time` | `26_party_time` | 26 |
| 27 | 27 | `equip_skin_clothing` | `27_equip_skin_clothing` | 27 |
| 28 | 28 | `trade_inn` | `28_trade_inn` | 28 |
| 29 | 29 | `deerclops_killed` | `29_deerclops_killed` | 29 |
| 30 | 30 | `spiderqueen_killed` | `30_spiderqueen_killed` | 30 |
| 31 | 31 | `minotaur_killed` | `31_minotaur_killed` | 31 |
| 32 | 32 | `moosegoose_killed` | `32_moosegoose_killed` | 32 |
| 33 | 33 | `bearger_killed` | `33_bearger_killed` | 33 |
| 34 | 34 | `dragonfly_killed` | `34_dragonfly_killed` | 34 |
| 35 | 35 | `domesticated_beefalo` | `35_domesticated_beefalo` | 35 |

## Implementation Details

### Platform ID Generation

- **Steam IDs**: Generated as `"id_name"` format (e.g., `"1_survive_20"`)
- **PSN IDs**: Use the numeric ID directly as integer (e.g., `1`)
- **Sequential Numbering**: IDs run from 1 to 35 with no gaps

### Module Structure

```lua
-- Local helper function
local function ACHIEVEMENT(id, name)
    return { 
        name = name, 
        id = {
            steam = tostring(id) .. "_" .. name, 
            psn = id 
        } 
    }
end

-- Global achievements table
Achievements = {
    ACHIEVEMENT("1", "survive_20"),
    ACHIEVEMENT("2", "survive_35"),
    -- ... all 35 achievements
}

-- Module return
return Achievements
```

### Access Patterns

```lua
-- Access by index
local first_achievement = Achievements[1]  -- survive_20

-- Search by name
local function GetAchievementByName(target_name)
    for _, achievement in ipairs(Achievements) do
        if achievement.name == target_name then
            return achievement
        end
    end
    return nil
end

-- Get platform-specific ID
local function GetSteamID(achievement_name)
    local achievement = GetAchievementByName(achievement_name)
    return achievement and achievement.id.steam or nil
end
```

### Adding New Achievements

To add a new achievement, append to the Achievements table:

```lua
Achievements = {
    -- ... existing achievements ...
    ACHIEVEMENT("36", "new_achievement_name"),
}
```

**Requirements:**
- Use next sequential numeric ID
- Use descriptive, lowercase name with underscores
- Follow existing naming conventions

## Related Modules

- [Event Achievements](eventachievements.md): Dynamic achievement tracking system
- [Player Profile](playerprofile.md): Achievement unlock status tracking
- [Networking](networking.md): Achievement synchronization across clients
