---
id: wxputils
title: Wxputils
description: Provides utility functions for querying and formatting seasonal event XP (WXP) progress and status data.
tags: [xp, seasonal, ui, inventory, festival]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: ced27364
system_scope: inventory
---

# Wxputils

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`wxputils` is a utility module containing helper functions for working with seasonal event XP (WXP) data. It abstracts common operations such as retrieving current level, computing XP progress percentage, and formatting progress strings for the UI. It relies on `TheInventory` and `TheItems` global services to access event-related data. This module is not a component and is not attached to entities; it is a standalone namespace of read-only utilities.

## Usage example
```lua
local wxp_utils = require "wxputils"

local current_level = wxp_utils.GetActiveLevel()
local progress_pct = wxp_utils.GetLevelPercentage()
local progress_str = wxp_utils.BuildProgressString()
wxp_utils.GetEventStatus("harvestfestival", 1, function(status) print(status) end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties

## Main functions
### `GetLevelPercentage()`
* **Description:** Returns the fractional progress (0.0 to 1.0) towards the next seasonal event level for the currently active festival.
* **Parameters:** None.
* **Returns:** 
  - `numerator / denominator` (number) — the ratio of XP earned this level to the XP needed to reach the next level.
* **Error states:** Returns `nil` if the denominator is zero (e.g., already at max level or data unavailable).

### `BuildProgressString()`
* **Description:** Returns a localized progress string (e.g., `"X / 100 XP"`) suitable for UI display, using the `STRINGS.UI.XPUTILS.XPPROGRESS` format.
* **Parameters:** None.
* **Returns:** 
  - `string` — formatted progress string with current and max XP values substituted.
* **Error states:** May return a malformed string if the localization token is missing or the XP values are invalid.

### `GetLevel(festival_key, season)`
* **Description:** Returns the current WXP level for a specified festival event and season.
* **Parameters:** 
  - `festival_key` (string) — internal key for the festival (e.g., `"harvestfestival"`).
  - `season` (number) — season index (e.g., `1`).
* **Returns:** 
  - `number` — the current level for the specified event and season.
* **Error states:** Returns `0` if the event or season is invalid or no XP data exists.

### `GetActiveLevel()`
* **Description:** Returns the current WXP level for the currently active festival event.
* **Parameters:** None.
* **Returns:** 
  - `number` — the current level of the active festival.

### `GetLevelForWXP(wxp)`
* **Description:** Determines which level corresponds to a given raw WXP value.
* **Parameters:** 
  - `wxp` (number) — a raw XP amount (can be fractional).
* **Returns:** 
  - `number` — the level index (starting at `1`) that the given XP falls within.
* **Error states:** Returns `0` if `wxp` is negative or no level mapping exists.

### `GetWXPForLevel(level)`
* **Description:** Returns the XP thresholds for a given level: XP required to reach that level, and XP required to reach the next level.
* **Parameters:** 
  - `level` (number) — the level index.
* **Returns:** 
  - `current_level_wxp` (number) — XP needed to reach `level`.
  - `next_level_wxp` (number) — XP needed to reach `level + 1`.
* **Error states:** Returns `0, 0` if `level` is invalid or not found in XP tables.

### `GetActiveWXP()`
* **Description:** Returns the total accumulated WXP for the currently active festival event.
* **Parameters:** None.
* **Returns:** 
  - `number` — total WXP earned in the active festival.

### `GetEventStatus(festival_key, season, cb_fn)`
* **Description:** Asynchronously retrieves the status (e.g., completed/in-progress) of a specified festival event and invokes the provided callback with the result.
* **Parameters:** 
  - `festival_key` (string) — internal key for the festival.
  - `season` (number) — season index.
  - `cb_fn` (function) — callback function that receives the status string as its first argument.
* **Returns:** Nothing (asynchronous).
* **Error states:** Callback is not invoked if `cb_fn` is not a function or if no matching event exists.

## Events & listeners
Not applicable