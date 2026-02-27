---
id: yotc_racestats
title: Yotc Racestats
description: Manages a player's race-specific statistical attributes (speed, direction, reaction, stamina) and provides tools to modify, compare, save, and load these stats.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 5196a224
---

# Yotc Racestats

## Overview
This component stores and manipulates a player's core racing statistics—speed, direction, reaction, and stamina—each represented as an integer stat value within configurable min/max bounds. It supports stat modifications via point adjustments, random point distribution, stat degradation (including to baseline), and saving/loading for persistence. It also provides helper methods to compute stat modifiers, retrieve the best stats, and generate debug strings.

## Dependencies & Tags
- Requires `TUNING.RACE_STATS` constants: `INIT_STAT_VALUE`, `MIN_STAT_VALUE`, `MAX_STAT_VALUE`
- Does not add or require any entity components or tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `inst` (passed to constructor) | The entity the component is attached to (typically a player). |
| `speed` | `number` | `TUNING.RACE_STATS.INIT_STAT_VALUE` | Current speed stat value. |
| `direction` | `number` | `TUNING.RACE_STATS.INIT_STAT_VALUE` | Current direction stat value. |
| `reaction` | `number` | `TUNING.RACE_STATS.INIT_STAT_VALUE` | Current reaction stat value. |
| `stamina` | `number` | `TUNING.RACE_STATS.INIT_STAT_VALUE` | Current stamina stat value. |
| `baseline_speed` | `number?` | `nil` | Saved baseline for speed (used in degradation logic); `nil` until `SaveCurrentStatsAsBaseline()` is called. |
| `baseline_direction` | `number?` | `nil` | Saved baseline for direction. |
| `baseline_reaction` | `number?` | `nil` | Saved baseline for reaction. |
| `baseline_stamina` | `number?` | `nil` | Saved baseline for stamina. |

## Main Functions

### `GetSpeedModifier()`
* **Description:** Returns the speed stat as a normalized modifier (ratio to `MAX_STAT_VALUE`).  
* **Returns:** `number` — A float between `0` and `1`, calculated as `speed / MAX_STAT_VALUE`.

### `GetDirectionModifier()`
* **Description:** Returns the direction stat as a normalized modifier.  
* **Returns:** `number` — `direction / MAX_STAT_VALUE`.

### `GetReactionModifier()`
* **Description:** Returns the reaction stat as a normalized modifier.  
* **Returns:** `number` — `reaction / MAX_STAT_VALUE`.

### `GetStaminaModifier()`
* **Description:** Returns the stamina stat as a normalized modifier.  
* **Returns:** `number` — `stamina / MAX_STAT_VALUE`.

### `ModifySpeed(point_mod)`
* **Description:** Adjusts the `speed` stat by `point_mod`, clamped between `baseline_speed` (if set) and `MAX_STAT_VALUE`.  
* **Parameters:**
  * `point_mod` (`number?`) — Signed integer change to apply (e.g., `+2`, `-1`). Ignored if `nil` or `0`.

### `ModifyDirection(point_mod)`
* **Description:** Adjusts the `direction` stat by `point_mod`, clamped between `baseline_direction` (if set) and `MAX_STAT_VALUE`.  
* **Parameters:** Same as `ModifySpeed`.

### `ModifyReaction(point_mod)`
* **Description:** Adjusts the `reaction` stat by `point_mod`, clamped between `baseline_reaction` (if set) and `MAX_STAT_VALUE`.  
* **Parameters:** Same as `ModifySpeed`.

### `ModifyStamina(point_mod)`
* **Description:** Adjusts the `stamina` stat by `point_mod`, clamped between `baseline_stamina` (if set) and `MAX_STAT_VALUE`.  
* **Parameters:** Same as `ModifySpeed`.

### `GetBestStats()`
* **Description:** Returns a list of indices (1–4) corresponding to the highest stat(s). All stats tied for highest are included.  
* **Returns:** `table<number>` — e.g., `{1, 3}` if speed and reaction are tied for highest. Order follows: speed (1), direction (2), reaction (3), stamina (4).

### `GetNumStatPoints()`
* **Description:** Returns the total sum of all stat values.  
* **Returns:** `number` — Sum of `speed + direction + reaction + stamina`.

### `AddRandomPointSpread(num_points)`
* **Description:** Distributes `num_points` randomly among stats *below* `MAX_STAT_VALUE`, using uniform random selection among eligible stats. Modifies stats in-place using `Modify*` methods. Stops when all points are assigned or no stats remain below max.  
* **Parameters:**
  * `num_points` (`number?`) — Number of points to distribute. Ignored if `nil`.

### `DegradePoints(num_points)`
* **Description:** Reduces stats *above* their baseline by up to `num_points`. If `num_points` is `nil`, resets all stats to their baseline values. Returns whether any stats still exceed baseline after degradation.  
* **Parameters:**
  * `num_points` (`number?`) — Max number of points to degrade. If `nil`, reset to baseline.  
* **Returns:** `boolean` — `true` if any stat remains *above* its baseline after operation.

### `SaveCurrentStatsAsBaseline()`
* **Description:** Copies current stat values to the corresponding `baseline_*` fields.  
* **Effect:** Subsequent degradation operations will use these values as the floor.

### `OnSave()`
* **Description:** Returns a serializable table containing all stat values and baseline stats.  
* **Returns:** `table` — Keys: `speed`, `direction`, `reaction`, `stamina`, `baseline_speed`, `baseline_direction`, `baseline_reaction`, `baseline_stamina`.

### `OnLoad(data)`
* **Description:** Loads stat and baseline values from a previously saved `data` table.  
* **Parameters:**
  * `data` (`table?`) — Table returned by `OnSave()`. Ignored if `nil`.

### `GetDebugString()`
* **Description:** Returns a formatted debug string showing all current stats and (if present) their baseline values.  
* **Returns:** `string` — e.g., `"Sp: 10,  Dr:  8,  Re: 12,  St:  7\n        Baseline:     10,        6,        8,        5"`.

## Events & Listeners
None identified.