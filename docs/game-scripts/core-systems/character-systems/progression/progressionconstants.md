---
id: progressionconstants
title: Progression Constants
description: Module containing constants and functions for character unlock progression system based on experience points
sidebar_position: 1

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Progression Constants

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `progressionconstants` module manages the character unlock progression system in Don't Starve Together. It provides functions and constants for calculating experience points (XP), character unlock levels, and progression rewards based on gameplay time.

The system is designed around daily XP accumulation, with specific XP thresholds that unlock new playable characters as players progress through the game.

## Constants

### XP_PER_DAY

**Value:** `20`

**Status:** `stable`

**Description:** The base amount of experience points earned per day of gameplay.

### XP_levels

**Type:** `table`

**Status:** `stable`

**Description:** Array containing XP thresholds for each progression level. Values are calculated as multiples of `XP_PER_DAY`.

**Standard Progression:**
- Level 1: 160 XP (8 days)
- Level 2: 320 XP (16 days)  
- Level 3: 640 XP (32 days)
- Level 4: 960 XP (48 days)
- Level 5: 1280 XP (64 days)
- Level 6: 1600 XP (80 days)

**Note:** For players without Don't Starve base game license, only the first level (160 XP) is available.

### Level_rewards

**Type:** `table`

**Status:** `stable`

**Description:** Array of character names that are unlocked at each progression level.

**Character Unlock Order:**
1. `willow` - Level 1
2. `wolfgang` - Level 2
3. `wendy` - Level 3
4. `wx78` - Level 4
5. `wickerbottom` - Level 5
6. `woodie` - Level 6
7. `wathgrithr` - Level 7

**Note:** Wes and Maxwell are unlocked through other gameplay mechanics, not progression levels.

## Functions

### GetXPCap() {#get-xp-cap}

**Status:** `stable`

**Description:**
Returns the maximum XP value in the progression system.

**Returns:**
- (number): The highest XP threshold from the XP_levels table

**Example:**
```lua
local progressionconstants = require("progressionconstants")
local max_xp = progressionconstants.GetXPCap()
-- max_xp = 1600 (for standard progression)
```

### GetRewardsForTotalXP(xp) {#get-rewards-for-total-xp}

**Status:** `stable`

**Description:**
Returns an array of all character names that should be unlocked based on the total XP amount.

**Parameters:**
- `xp` (number): Total experience points accumulated

**Returns:**
- (table): Array of character names available to unlock

**Example:**
```lua
local progressionconstants = require("progressionconstants")
local unlocked_characters = progressionconstants.GetRewardsForTotalXP(650)
-- Returns: {"willow", "wolfgang", "wendy"} (first 3 levels unlocked)
```

### GetRewardForLevel(level) {#get-reward-for-level}

**Status:** `stable`

**Description:**
Returns the character name unlocked at a specific progression level.

**Parameters:**
- `level` (number): Progression level (0-based indexing)

**Returns:**
- (string|nil): Character name for the specified level, or nil if level is invalid

**Example:**
```lua
local progressionconstants = require("progressionconstants")
local character = progressionconstants.GetRewardForLevel(2)
-- Returns: "wendy" (3rd character in unlock order)
```

### GetXPForDays(days) {#get-xp-for-days}

**Status:** `stable`

**Description:**
Calculates the total XP that would be earned over a specified number of days.

**Parameters:**
- `days` (number): Number of gameplay days

**Returns:**
- (number): Total XP earned over the specified days

**Example:**
```lua
local progressionconstants = require("progressionconstants")
local xp_earned = progressionconstants.GetXPForDays(10)
-- Returns: 200 (10 days * 20 XP per day)
```

### GetXPForLevel(level) {#get-xp-for-level}

**Status:** `stable`

**Description:**
Returns the XP requirement information for a specific level.

**Parameters:**
- `level` (number): Target progression level

**Returns:**
- (number): Current XP threshold for the level (0 for level 0)
- (number): XP difference to next level (0 if at max level)

**Example:**
```lua
local progressionconstants = require("progressionconstants")
local current_xp, next_level_xp = progressionconstants.GetXPForLevel(2)
-- current_xp = 320, next_level_xp = 320 (difference to level 3)
```

### GetLevelForXP(xp) {#get-level-for-xp}

**Status:** `stable`

**Description:**
Calculates the current progression level and completion percentage based on total XP.

**Parameters:**
- `xp` (number): Total experience points

**Returns:**
- (number): Current progression level (0-based)
- (number): Progress percentage toward next level (0-1 range)

**Example:**
```lua
local progressionconstants = require("progressionconstants")
local level, progress = progressionconstants.GetLevelForXP(240)
-- level = 1, progress = 0.5 (halfway through level 2)
```

### IsCappedXP(xp) {#is-capped-xp}

**Status:** `stable`

**Description:**
Determines whether the given XP amount has reached the maximum progression cap.

**Parameters:**
- `xp` (number): Experience points to check

**Returns:**
- (boolean): True if XP is at or above the maximum cap

**Example:**
```lua
local progressionconstants = require("progressionconstants")
local is_maxed = progressionconstants.IsCappedXP(1600)
-- Returns: true (at max XP for standard progression)
```

## License Restrictions

The progression system includes special handling for players who don't own the Don't Starve base game. These players have access to only the first progression level (160 XP to unlock Willow), with all other levels disabled.

This restriction is checked using `TheSim:GetUserHasLicenseForApp(DONT_STARVE_APPID)` and automatically adjusts the `XP_levels` table accordingly.

## Progression System Usage

The progression constants are typically used by:

- **Character Selection Screens**: To determine which characters are available
- **Player Profile Systems**: To track and display progression status  
- **Achievement Systems**: To calculate unlock requirements
- **UI Components**: To show progress bars and level information

## Related Modules

- [Player Profile](./playerprofile.md): Uses progression data for character unlock tracking
- [Player History](./playerhistory.md): Stores XP accumulation over time
- [Characters and Mobs](./characters-and-mobs/index.md): Character definitions unlocked through progression
