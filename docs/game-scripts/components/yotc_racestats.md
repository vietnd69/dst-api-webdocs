---
id: yotc_racestats
title: Yotc Racestats
description: Manages point-based racing statistics for entities, including stats modification, random point allocation, degradation, and baseline tracking.
tags: [race, stats, entity, combat]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5196a224
system_scope: entity
---

# Yotc Racestats

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`YOTC_RaceStats` is an entity component that stores and manipulates four core racing statistics—speed, direction, reaction, and stamina—as integer point values within configurable bounds defined in `TUNING.RACE_STATS`. It supports dynamic modification via additive adjustments, random point distribution, and point degradation, while preserving a configurable baseline for reset functionality. The component also provides serialization support via `OnSave`/`OnLoad` and includes debugging utilities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("yotc_racestats")

-- Set stats via additive modification
inst.components.yotc_racestats:ModifySpeed(5)
inst.components.yotc_racestats:ModifyDirection(-2)

-- Allocate random point spread
inst.components.yotc_racestats:AddRandomPointSpread(3)

-- Save current stats as baseline
inst.components.yotc_racestats:SaveCurrentStatsAsBaseline()

-- Degrade 2 points randomly from stats above baseline
local remaining = inst.components.yotc_racestats:DegradePoints(2)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `speed` | number | `TUNING.RACE_STATS.INIT_STAT_VALUE` | Current speed stat value. |
| `direction` | number | `TUNING.RACE_STATS.INIT_STAT_VALUE` | Current direction stat value. |
| `reaction` | number | `TUNING.RACE_STATS.INIT_STAT_VALUE` | Current reaction stat value. |
| `stamina` | number | `TUNING.RACE_STATS.INIT_STAT_VALUE` | Current stamina stat value. |
| `baseline_speed` | number \| nil | `nil` | Saved baseline for speed; `nil` until explicitly set. |
| `baseline_direction` | number \| nil | `nil` | Saved baseline for direction; `nil` until explicitly set. |
| `baseline_reaction` | number \| nil | `nil` | Saved baseline for reaction; `nil` until explicitly set. |
| `baseline_stamina` | number \| nil | `nil` | Saved baseline for stamina; `nil` until explicitly set. |

## Main functions
### `GetSpeedModifier()`
* **Description:** Returns the speed stat normalized as a decimal modifier between 0 and 1, based on `TUNING.RACE_STATS.MAX_STAT_VALUE`.
* **Parameters:** None.
* **Returns:** number — `speed / MAX_STAT_VALUE`.
* **Error states:** Returns `0` if `speed` is `0`.

### `GetDirectionModifier()`
* **Description:** Returns the direction stat normalized as a decimal modifier.
* **Parameters:** None.
* **Returns:** number — `direction / MAX_STAT_VALUE`.

### `GetReactionModifier()`
* **Description:** Returns the reaction stat normalized as a decimal modifier.
* **Parameters:** None.
* **Returns:** number — `reaction / MAX_STAT_VALUE`.

### `GetStaminaModifier()`
* **Description:** Returns the stamina stat normalized as a decimal modifier.
* **Parameters:** None.
* **Returns:** number — `stamina / MAX_STAT_VALUE`.

### `ModifySpeed(point_mod)`
* **Description:** Adjusts the speed stat by the given point modifier, clamped between baseline (or `MIN_STAT_VALUE`) and `MAX_STAT_VALUE`.
* **Parameters:** `point_mod` (number) — amount to add to `speed`. Must be non-zero and non-`nil`.
* **Returns:** Nothing.
* **Error states:** No-op if `point_mod` is `nil` or `0`. Clamps the resulting value to `[min, MAX_STAT_VALUE]`.

### `ModifyDirection(point_mod)`
* **Description:** Adjusts the direction stat with clamping behavior identical to `ModifySpeed`.
* **Parameters:** `point_mod` (number).
* **Returns:** Nothing.

### `ModifyReaction(point_mod)`
* **Description:** Adjusts the reaction stat with clamping behavior identical to `ModifySpeed`.
* **Parameters:** `point_mod` (number).
* **Returns:** Nothing.

### `ModifyStamina(point_mod)`
* **Description:** Adjusts the stamina stat with clamping behavior identical to `ModifySpeed`.
* **Parameters:** `point_mod` (number).
* **Returns:** Nothing.

### `GetBestStats()`
* **Description:** Identifies which stat(s) hold the highest current value.
* **Parameters:** None.
* **Returns:** table — a list of stat indices (1 = speed, 2 = direction, 3 = reaction, 4 = stamina) that tie for highest value. Returns empty table if all stats are `0` (edge case).
* **Error states:** May return a multi-element list for ties.

### `GetNumStatPoints()`
* **Description:** Computes the total sum of all stat points.
* **Parameters:** None.
* **Returns:** number — sum of `speed`, `direction`, `reaction`, and `stamina`.

### `AddRandomPointSpread(num_points)`
* **Description:** Distributes `num_points` randomly among stats that are below `MAX_STAT_VALUE`, incrementing each by `1`. Skips stats already at max.
* **Parameters:** `num_points` (number) — number of points to distribute.
* **Returns:** Nothing.
* **Error states:** No-op if `num_points` is `nil` or `0`. Stops distributing if no stats remain below `MAX_STAT_VALUE`.

### `DegradePoints(num_points)`
* **Description:** Reduces points from stats that exceed the current baseline (or initial default values if baseline is unset), either up to `num_points` or down to the baseline.
* **Parameters:** `num_points` (number) — number of points to degrade (if `nil`, degrades all excess points to baseline).
* **Returns:** boolean — `true` if any stats remain above their baseline after degradation; otherwise `false`.
* **Error states:** Degradation stops early if no stats are above baseline; returns `false` in that case.

### `SaveCurrentStatsAsBaseline()`
* **Description:** Saves the current stat values as new baselines for use during future degradation.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns a serializable table containing current and baseline stat values for persistence.
* **Parameters:** None.
* **Returns:** table — `{ speed, direction, reaction, stamina, baseline_speed, baseline_direction, baseline_reaction, baseline_stamina }`.

### `OnLoad(data)`
* **Description:** Loads stat and baseline values from a saved table.
* **Parameters:** `data` (table) — deserialized data from `OnSave`.
* **Returns:** Nothing.
* **Error states:** No-op if `data` is `nil`. Does not validate contents.

### `GetDebugString()`
* **Description:** Formats current and baseline stat values as a multi-line debug string.
* **Parameters:** None.
* **Returns:** string — e.g., `"Sp: 10,  Dr: 12,  Re:  8,  St: 10\n        Baseline:     10,       10,       10,       10"`.
* **Error states:** Omits the baseline line if `baseline_speed` is `nil` (assumes other baselines are also `nil`).

## Events & listeners
None identified
