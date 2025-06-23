---
title: Achievements System
description: Documentation of the Don't Starve Together achievements system for tracking player accomplishments
sidebar_position: 1
slug: /achievements
last_updated: 2024-12-19
build_version: 675312
change_status: stable
---

# Achievements System

The Achievements system in Don't Starve Together tracks and recognizes player accomplishments across different platforms. This system provides a standardized way to define, track, and award achievements for various gameplay milestones, from basic survival goals to complex challenges.

## Version History

| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 675312 | 2024-12-19 | stable | Updated documentation to match current implementation |
| 642130 | 2023-06-10 | added | Initial comprehensive achievements system documentation |

## Overview

The achievements system serves multiple purposes:
- **Player Progression**: Provides clear goals and milestones for players
- **Platform Integration**: Supports multiple gaming platforms (Steam, PlayStation, etc.)
- **Gameplay Motivation**: Encourages exploration of different game mechanics
- **Community Features**: Enables comparison and sharing of accomplishments

The system is designed to be platform-agnostic while providing platform-specific integration for services like Steam Achievements and PlayStation trophies.

## Core Architecture

### Achievement Definition

Each achievement is defined using a standardized structure that supports multiple platforms:

```lua
local function ACHIEVEMENT(id, name)
    return { 
        name = name, 
        id = {
            steam = tostring(id) .. "_" .. name, 
            psn = id 
        } 
    }
end
```

### Achievement Structure

| Property | Type | Description |
|----------|------|-------------|
| `name` | String | Internal code name used to reference the achievement |
| `id` | Table | Platform-specific identifiers |
| `id.steam` | String | Steam achievement ID (format: "number_name") |
| `id.psn` | Number | PlayStation Network trophy ID |

## Achievement Categories

### Survival Achievements

Basic survival milestones that track player longevity:

| Achievement | ID | Name | Description |
|-------------|----|----- |-------------|
| Survival Novice | 1 | `survive_20` | Survive for 20 days |
| Getting Warmer | 2 | `survive_35` | Survive for 35 days |
| Alive and Kicking | 3 | `survive_55` | Survive for 55 days |
| The Warrior | 4 | `survive_70` | Survive for 70 days |

### Research & Technology

Achievements related to technological progression:

| Achievement | ID | Name | Description |
|-------------|----|----- |-------------|
| Science Machine | 5 | `build_researchlab` | Build a Science Machine |
| Alchemy Engine | 6 | `build_researchlab2` | Build an Alchemy Engine |
| Shadow Manipulator | 7 | `build_researchlab3` | Build a Shadow Manipulator |
| Prestihatitator | 8 | `build_researchlab4` | Build a Prestihatitator |

### Exploration & Discovery

Achievements for discovering game mechanics and locations:

| Achievement | ID | Name | Description |
|-------------|----|----- |-------------|
| Wormhole Explorer | 9 | `wormhole_used` | Use a wormhole |
| Royal Trade | 10 | `pigking_trader` | Trade with the Pig King |
| Flower Power | 11 | `growfrombutterfly` | Grow flowers from butterflies |
| Sweet Harvest | 12 | `honey_harvester` | Harvest honey |
| Cave Opener | 18 | `cave_entrance_opened` | Open cave entrance |
| Underground | 20 | `tentacle_pillar_hole_used` | Use tentacle pillar hole |

### Crafting & Building

Achievements for creating specific items or structures:

| Achievement | ID | Name | Description |
|-------------|----|----- |-------------|
| Tailor | 13 | `sewing_kit` | Craft a sewing kit |
| Snail Armor | 21 | `snail_armour_set` | Equip full snail armor set |
| Fashion Victim | 27 | `equip_skin_clothing` | Equip skin clothing |

### Social & Companions

Achievements involving NPCs, allies, and multiplayer interactions:

| Achievement | ID | Name | Description |
|-------------|----|----- |-------------|
| Pig Posse | 14 | `pigman_posse` | Recruit pig followers |
| Rock Posse | 15 | `rocky_posse` | Recruit rock lobster followers |
| Parent | 16 | `hatch_tallbirdegg` | Hatch a tallbird egg |
| Guardian | 17 | `pacify_forest` | Pacify the forest |
| Beefalo Rider | 35 | `domesticated_beefalo` | Domesticate a beefalo |

### Multiplayer Achievements

Achievements specific to multiplayer gameplay:

| Achievement | ID | Name | Description |
|-------------|----|----- |-------------|
| Joining | 22 | `join_game` | Join a multiplayer game |
| Hosting | 23 | `host_for_days` | Host for multiple days |
| Reviver | 24 | `hasrevivedplayer` | Revive another player |
| Helper | 25 | `helping_hand` | Provide helping hand |
| Party Time | 26 | `party_time` | Participate in party |

### Combat Achievements

Achievements for defeating major bosses:

| Achievement | ID | Name | Description |
|-------------|----|----- |-------------|
| Giant Slayer I | 29 | `deerclops_killed` | Defeat Deerclops |
| Giant Slayer II | 30 | `spiderqueen_killed` | Defeat Spider Queen |
| Giant Slayer III | 31 | `minotaur_killed` | Defeat Ancient Guardian |
| Giant Slayer IV | 32 | `moosegoose_killed` | Defeat Moose/Goose |
| Giant Slayer V | 33 | `bearger_killed` | Defeat Bearger |
| Giant Slayer VI | 34 | `dragonfly_killed` | Defeat Dragonfly |

### Special Events

Achievements for surviving special events:

| Achievement | ID | Name | Description |
|-------------|----|----- |-------------|
| Earthquake Survivor | 19 | `survive_earthquake` | Survive an earthquake |
| Inn Trader | 28 | `trade_inn` | Trade at an inn |

## Implementation Usage

### Accessing Achievements

```lua
-- Get all achievements
local achievements = require("achievements")

-- Iterate through achievements
for i, achievement in ipairs(achievements) do
    print("Achievement:", achievement.name)
    print("Steam ID:", achievement.id.steam)
    print("PSN ID:", achievement.id.psn)
end
```

### Platform-Specific Access

```lua
-- Get Steam achievement ID
local function GetSteamAchievementId(achievement_name)
    for _, achievement in ipairs(Achievements) do
        if achievement.name == achievement_name then
            return achievement.id.steam
        end
    end
    return nil
end

-- Get PSN achievement ID
local function GetPSNAchievementId(achievement_name)
    for _, achievement in ipairs(Achievements) do
        if achievement.name == achievement_name then
            return achievement.id.psn
        end
    end
    return nil
end
```

### Achievement Validation

```lua
-- Check if achievement exists
local function IsValidAchievement(achievement_name)
    for _, achievement in ipairs(Achievements) do
        if achievement.name == achievement_name then
            return true
        end
    end
    return false
end
```

## Adding New Achievements

### Basic Achievement

```lua
-- Add to achievements table
ACHIEVEMENT("36", "new_achievement_name")
```

### Multi-Platform Achievement

```lua
-- Custom achievement with specific platform IDs
{
    name = "custom_achievement",
    id = {
        steam = "CUSTOM_STEAM_ID",
        psn = 999,
        xbox = "CUSTOM_XBOX_ID"  -- Additional platforms can be added
    }
}
```

## Best Practices

### 1. Naming Conventions

```lua
-- Good: Descriptive, consistent naming
ACHIEVEMENT("37", "survive_100_days")
ACHIEVEMENT("38", "craft_luxury_fan")

-- Bad: Unclear or inconsistent naming
ACHIEVEMENT("39", "thing1")
ACHIEVEMENT("40", "AchievementTwo")
```

### 2. Platform Compatibility

```lua
-- Ensure all platforms are supported
local achievement = {
    name = "my_achievement",
    id = {
        steam = "999_my_achievement",  -- Required for Steam
        psn = 999,                     -- Required for PlayStation
        -- Add other platforms as needed
    }
}
```

### 3. ID Management

```lua
-- Keep IDs sequential and unique
ACHIEVEMENT("1", "first_achievement")   -- ID 1
ACHIEVEMENT("2", "second_achievement")  -- ID 2
-- Never reuse IDs, even for removed achievements
```

### 4. Achievement Categories

Organize achievements logically:
- **Survival**: Time-based survival goals
- **Combat**: Boss defeats and combat milestones
- **Exploration**: Discovery and travel achievements
- **Social**: Multiplayer and NPC interactions
- **Crafting**: Item creation and technology
- **Special**: Event-specific or unique challenges

## Platform Integration

### Steam Integration

Steam achievements use string IDs in the format `"number_name"`:

```lua
-- Steam achievement ID: "1_survive_20"
ACHIEVEMENT("1", "survive_20")
```

### PlayStation Network

PSN achievements use numeric trophy IDs:

```lua
-- PSN trophy ID: 1
ACHIEVEMENT("1", "survive_20")  -- psn = 1
```

### Custom Platforms

Additional platforms can be supported by extending the ID structure:

```lua
local achievement = {
    name = "example",
    id = {
        steam = "1_example",
        psn = 1,
        xbox = "XBOX_EXAMPLE_ID",
        nintendo = "NINTENDO_EXAMPLE"
    }
}
```

## Achievement Tracking

### Server-Side Tracking

Achievements are typically tracked server-side to prevent cheating:

```lua
-- Example achievement tracking
local function CheckSurvivalAchievement(player, days_survived)
    if days_survived >= 20 and not player:HasAchievement("survive_20") then
        player:UnlockAchievement("survive_20")
    end
    -- Check other survival milestones...
end
```

### Event-Based Triggers

```lua
-- Achievement unlock on specific events
player:ListenForEvent("killed_boss", function(player, data)
    if data.boss == "deerclops" then
        player:UnlockAchievement("deerclops_killed")
    end
end)
```

## Performance Considerations

### Memory Efficiency

- Achievement definitions are loaded once at startup
- Minimal memory footprint for achievement tracking
- Platform-specific IDs cached for quick lookup

### Network Optimization

- Achievement unlocks sent as lightweight network messages
- Batch achievement updates when possible
- Platform APIs called asynchronously to avoid blocking

## Troubleshooting

### Common Issues

**Achievement not unlocking**: Check that the achievement name matches exactly

```lua
-- Correct
player:UnlockAchievement("survive_20")

-- Incorrect (case sensitive)
player:UnlockAchievement("Survive_20")
```

**Platform integration problems**: Verify platform-specific IDs are correct

```lua
-- Check Steam achievement ID format
local steam_id = achievement.id.steam  -- Should be "number_name"
```

**Missing achievements**: Ensure achievement is properly registered

```lua
-- Verify achievement exists in table
local found = false
for _, ach in ipairs(Achievements) do
    if ach.name == target_name then
        found = true
        break
    end
end
```

### Debugging

```lua
-- Debug achievement system
local function DebugAchievements()
    print("Total achievements:", #Achievements)
    for i, achievement in ipairs(Achievements) do
        print(string.format("ID: %d, Name: %s, Steam: %s, PSN: %d", 
            i, achievement.name, achievement.id.steam, achievement.id.psn))
    end
end
```

## See Also

- [Character Systems](character-systems/) - Player progression and statistics
- [Networking](networking) - Achievement synchronization
- [Game Mechanics](game-mechanics/) - Systems that trigger achievements
