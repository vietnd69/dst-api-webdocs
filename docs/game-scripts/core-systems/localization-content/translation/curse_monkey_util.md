---
id: curse-monkey-util
title: Curse Monkey Util
description: Utility module for managing monkey curse transformation mechanics and visual effects in Don't Starve Together
sidebar_position: 2

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Curse Monkey Util

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `curse_monkey_util` module provides utility functions for managing the monkey curse transformation system in Don't Starve Together. This module handles the progressive transformation of players into monkey form based on collected monkey tokens, including visual effects and state management.

The monkey curse system is a progressive transformation mechanic where players gradually take on monkey characteristics (feet, hands, tail) before potentially transforming into a full monkey (wonkey). The curse is triggered by collecting cursed monkey tokens and can be reversed by various means.

## Usage Example

```lua
local CURSE_MONKEY_UTIL = require("curse_monkey_util")

-- Apply curse based on player's monkey token count
local token_count = player.components.inventory:GetItemCount("monkeytoken")
CURSE_MONKEY_UTIL.docurse(player, token_count)

-- Remove curse when player loses monkey tokens
local remaining_tokens = player.components.inventory:GetItemCount("monkeytoken")
CURSE_MONKEY_UTIL.uncurse(player, remaining_tokens)
```

## Functions

### docurse(owner, numitems) {#docurse}

**Status:** `stable`

**Description:**
Applies or progresses the monkey curse on a player based on the number of cursed items they possess. Handles progressive transformation through 4 distinct levels with appropriate visual effects and announcements.

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
- Triggers curse announcement for first-time curse application (non-wonkey players)

**Returns:**
- (void): No return value

**Example:**
```lua
local CURSE_MONKEY_UTIL = require("curse_monkey_util")

-- Apply curse based on player's monkey token count
local token_count = player.components.inventory:GetItemCount("monkeytoken")
CURSE_MONKEY_UTIL.docurse(player, token_count)
```

**Version History:**
- Current in build 676042: Progressive 4-level curse system

### uncurse(owner, num) {#uncurse}

**Status:** `stable`

**Description:**
Removes or reduces the monkey curse on a player based on the remaining number of cursed items. Handles reverse transformation with appropriate visual effects and state management.

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

**Returns:**
- (void): No return value

**Example:**
```lua
local CURSE_MONKEY_UTIL = require("curse_monkey_util")

-- Remove curse when player loses monkey tokens
local remaining_tokens = player.components.inventory:GetItemCount("monkeytoken")
CURSE_MONKEY_UTIL.uncurse(player, remaining_tokens)
```

**Version History:**
- Current in build 676042: Supports progressive curse reduction

## Constants

### Curse Level Thresholds

The module relies on tuning constants for curse progression:

| Constant | Purpose | Usage |
|----------|---------|-------|
| `TUNING.MONKEY_TOKEN_COUNTS.LEVEL_1` | Monkey feet threshold | Triggers first curse level |
| `TUNING.MONKEY_TOKEN_COUNTS.LEVEL_2` | Monkey hands threshold | Triggers second curse level |
| `TUNING.MONKEY_TOKEN_COUNTS.LEVEL_3` | Monkey tail threshold | Triggers third curse level |
| `TUNING.MONKEY_TOKEN_COUNTS.LEVEL_4` | Full transformation threshold | Triggers wonkey transformation |

## Events

### "monkeycursehit"

**Status:** `stable`

**Parameters:**
- `data.uncurse` (boolean): `true` when removing curse, `false` when applying curse

**Description:**
Triggered when curse level changes, providing information about the transformation direction.

**Example:**
```lua
inst:ListenForEvent("monkeycursehit", function(inst, data)
    if data.uncurse then
        print("Player curse was reduced")
    else
        print("Player curse was applied/increased")
    end
end)
```

**Version History:**
- Current in build 676042: Provides curse change direction

## Curse Progression System

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

## Transformation Restrictions

The transformation process includes safety checks to prevent transformation during inappropriate states:

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

## Related Modules

- [State Graphs](mdc:dst-api-webdocs/stategraphs/index.md): For transformation animations
- [Components](mdc:dst-api-webdocs/core-systems/componentutil.md): Skinner and Talker components
- [Tuning](mdc:dst-api-webdocs/core-systems/tuning.md): Curse threshold constants
- [Prefabs](mdc:dst-api-webdocs/core-systems/prefabs.md): Visual effect prefabs
