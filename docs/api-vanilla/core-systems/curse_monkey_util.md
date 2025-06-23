---
title: "Curse Monkey Util"
description: "Utility module for managing monkey curse transformation mechanics and visual effects in Don't Starve Together"
sidebar_position: 8
slug: /api-vanilla/core-systems/curse_monkey_util
last_updated: "2024-12-28"
build_version: "675312"
change_status: "stable"
---

# Curse Monkey Util

The `curse_monkey_util` module provides utility functions for managing the monkey curse transformation system in Don't Starve Together. This module handles the progressive transformation of players into monkey form based on collected monkey tokens, including visual effects and state management.

## Overview

The monkey curse system is a progressive transformation mechanic where players gradually take on monkey characteristics (feet, hands, tail) before potentially transforming into a full monkey (wonkey). The curse is triggered by collecting cursed monkey tokens and can be reversed by various means.

## API Reference

### Functions

#### `docurse(owner, numitems)`

Applies or progresses the monkey curse on a player based on the number of cursed items they possess.

**Parameters:**
- `owner` (EntityScript): The player entity to apply the curse to
- `numitems` (number): The total number of cursed monkey tokens the player has

**Behavior:**
- **Level 1** (> `TUNING.MONKEY_TOKEN_COUNTS.LEVEL_1`): Applies monkey feet
- **Level 2** (> `TUNING.MONKEY_TOKEN_COUNTS.LEVEL_2`): Adds monkey hands
- **Level 3** (> `TUNING.MONKEY_TOKEN_COUNTS.LEVEL_3`): Adds monkey tail
- **Level 4** (≥ `TUNING.MONKEY_TOKEN_COUNTS.LEVEL_4`): Triggers full wonkey transformation

**Visual Effects:**
- Spawns `monkey_morphin_power_players_fx` particle effect
- Triggers curse announcement for first-time curse application

**Example:**
```lua
local CURSE_MONKEY_UTIL = require("curse_monkey_util")

-- Apply curse based on player's monkey token count
local token_count = player.components.inventory:GetItemCount("monkeytoken")
CURSE_MONKEY_UTIL.docurse(player, token_count)
```

#### `uncurse(owner, num)`

Removes or reduces the monkey curse on a player.

**Parameters:**
- `owner` (EntityScript): The player entity to remove curse from
- `num` (number): The remaining number of cursed items after removal

**Behavior:**
- **num = 0**: Completely removes all curse effects
- **num ≤ 2**: Reduces to monkey feet only
- **num ≤ 5**: Reduces to monkey feet and hands
- **num > 5**: Maintains full curse (feet, hands, tail)

**Special Cases:**
- For wonkey players: Triggers transformation back to human form when `num > 0`
- For wonkey players: Initiates delayed transformation when `num = 0`

**Visual Effects:**
- Spawns `monkey_de_morphin_fx` particle effect

**Example:**
```lua
local CURSE_MONKEY_UTIL = require("curse_monkey_util")

-- Remove curse when player loses monkey tokens
local remaining_tokens = player.components.inventory:GetItemCount("monkeytoken")
CURSE_MONKEY_UTIL.uncurse(player, remaining_tokens)
```

## Curse Levels

### Level 1: Monkey Feet
- **Trigger**: More than `TUNING.MONKEY_TOKEN_COUNTS.LEVEL_1` tokens
- **Effects**: 
  - Sets `owner.monkeyfeet = true`
  - Applies "MONKEY_CURSE_1" skin set
  - Adds "MONKEY_CURSE_1" tag
  - Triggers curse announcement (for non-wonkey players)

### Level 2: Monkey Hands
- **Trigger**: More than `TUNING.MONKEY_TOKEN_COUNTS.LEVEL_2` tokens
- **Effects**:
  - Sets `owner.monkeyhands = true`
  - Applies "MONKEY_CURSE_2" skin set
  - Removes "MONKEY_CURSE_1" tag, adds "MONKEY_CURSE_2" tag

### Level 3: Monkey Tail
- **Trigger**: More than `TUNING.MONKEY_TOKEN_COUNTS.LEVEL_3` tokens
- **Effects**:
  - Sets `owner.monkeytail = true`
  - Applies "MONKEY_CURSE_3" skin set
  - Removes "MONKEY_CURSE_2" tag, adds "MONKEY_CURSE_3" tag

### Level 4: Full Transformation
- **Trigger**: `TUNING.MONKEY_TOKEN_COUNTS.LEVEL_4` or more tokens
- **Effects**:
  - Initiates full wonkey transformation
  - Uses state graph transition to "monkeychanger_pre"

## Transformation Logic

### Transformation Restrictions

The transformation process includes several safety checks to prevent transformation during inappropriate states:

- **nomorph**: Prevents any morphing
- **silentmorph**: Prevents morphing but without announcement
- **busy**: Player is performing an action
- **pinned**: Player is immobilized
- **dead**: Player is dead

### Special Character Handling

For Woodie character, transformation is prevented during were-forms:
- **weregoose**: Goose form
- **weremoose**: Moose form  
- **beaver**: Beaver form

### Delayed Transformation

When transformation conditions aren't met, the system uses a periodic task (`_trymonkeychangetask`) that retries transformation every 0.1 seconds until conditions are suitable.

## Events

### monkeycursehit

Triggered when curse level changes, providing information about the transformation:

```lua
owner:PushEvent("monkeycursehit", { uncurse = boolean })
```

- `uncurse`: `true` when removing curse, `false` when applying curse

## Dependencies

### Required Components
- `skinner`: For applying visual curse effects
- `talker`: For curse announcements
- `inventory`: For tracking monkey tokens (external usage)

### Required Systems
- State graph system for transformation states
- Tuning constants for curse thresholds
- Prefab system for visual effects

## Usage Examples

### Basic Curse Application
```lua
local CURSE_MONKEY_UTIL = require("curse_monkey_util")

-- Check player's monkey token count and apply appropriate curse level
local function UpdateMonkeyCurse(player)
    local token_count = player.components.inventory:GetItemCount("monkeytoken")
    CURSE_MONKEY_UTIL.docurse(player, token_count)
end
```

### Curse Removal
```lua
local CURSE_MONKEY_UTIL = require("curse_monkey_util")

-- Remove curse when player drops or loses monkey tokens
local function OnTokenLost(player)
    local remaining_tokens = player.components.inventory:GetItemCount("monkeytoken")
    CURSE_MONKEY_UTIL.uncurse(player, remaining_tokens)
end
```

### Event Handling
```lua
-- Listen for curse changes
local function OnMonkeyCurseHit(player, data)
    if data.uncurse then
        print("Player curse was reduced")
    else
        print("Player curse was applied/increased")
    end
end

player:ListenForEvent("monkeycursehit", OnMonkeyCurseHit)
```

## Version History

| Version | Changes |
|---------|---------|
| 675312  | Current implementation with 4-level curse system |

## Related Systems

- [State Graphs](/api-vanilla/stategraphs/) - For transformation animations
- [Components](/api-vanilla/core-systems/components/) - Skinner and Talker components
- [Tuning](/api-vanilla/core-systems/tuning/) - Curse threshold constants
- [Prefabs](/api-vanilla/core-systems/prefabs/) - Visual effect prefabs

## Notes

- The curse system is designed to be progressive and reversible
- Visual effects are automatically handled by the utility functions
- Transformation safety checks prevent issues during combat or other activities
- The system integrates with the existing character skin system for visual changes
