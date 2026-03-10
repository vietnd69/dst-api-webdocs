---
id: progressionconstants
title: Progressionconstants
description: Defines XP progression constants, level progression logic, and reward unlocking rules for the game's progression system.
tags: [progression, xp, rewards]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: a9cf7296
system_scope: world
---

# Progressionconstants

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`progressionconstants.lua` defines static constants and utility functions used to calculate experience points (XP), determine player progression levels, and retrieve unlocked character rewards based on accumulated XP. It is used by the game's progression UI and backend logic to manage the unlockable content (e.g., characters like Willow, Wolfgang, etc.) as the player accumulates days survived. The XP curve is linear in days (20 XP per day), with fixed thresholds for each level.

## Usage example
```lua
local progress = require("progressionconstants")

local xp = progress.GetXPForDays(25) -- 500 XP
local level, percent = progress.GetLevelForXP(xp)
local rewards = progress.GetRewardsForTotalXP(xp)
local unlocked_char = progress.GetRewardForLevel(0) -- returns "willow"
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `GetXPCap()`
*   **Description:** Returns the maximum XP value required to reach the final progression level (level cap).
*   **Parameters:** None.
*   **Returns:** number — the XP cap value.

### `GetRewardsForTotalXP(xp)`
*   **Description:** Returns a list of unlocked character rewards based on total XP earned.
*   **Parameters:** `xp` (number) — total accumulated XP.
*   **Returns:** table — array of strings (character names) unlocked up to the current level.
*   **Error states:** Returns an empty table if `xp` is less than the first level threshold.

### `GetRewardForLevel(level)`
*   **Description:** Returns the character reward associated with a specific level index (0-based).
*   **Parameters:** `level` (number) — 0-based level index (e.g., `0` = first reward).
*   **Returns:** string? — character name (e.g., `"willow"`), or `nil` if level is out of bounds.

### `GetXPForDays(days)`
*   **Description:** Converts number of days survived into XP.
*   **Parameters:** `days` (number) — days survived.
*   **Returns:** number — XP earned (`20 * days`).

### `GetXPForLevel(level)`
*   **Description:** Returns the total XP required to reach the given level and the XP difference to the next level (for progress bar display).
*   **Parameters:** `level` (number) — target level index (0-based).
*   **Returns:** number, number — `total_xp` to reach this level, and `delta_xp` needed to reach next level (or `0` if at cap).

### `GetLevelForXP(xp)`
*   **Description:** Returns the current progression level (0-based integer) and the percentage progress toward the next level.
*   **Parameters:** `xp` (number) — current total XP.
*   **Returns:** number, number — `level`, `percent` — where `percent` is a fraction in `[0, 1)`.

### `IsCappedXP(xp)`
*   **Description:** Checks whether the given XP is at or above the progression cap.
*   **Parameters:** `xp` (number) — current XP.
*   **Returns:** boolean — `true` if at or beyond the cap, otherwise `false`.

## Events & listeners
None identified