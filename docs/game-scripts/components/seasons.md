---
id: seasons
title: Seasons
description: Manages seasonal cycles, timing, and clock segment distribution in the game world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 57f26856
---

# Seasons

## Overview
This component orchestrates the game's seasonal system—tracking current season, progression, duration, and clock segment (day/dusk/night) distribution—on the master simulation and master shard. It handles season transitions, mode configuration (cycle/endless/always), and network synchronization between shards.

## Dependencies & Tags
- `inst`: The entity to which the component is attached (typically `TheWorld`).
- Network variables rely on `net_tinybyte`, `net_byte`, `net_ushortint`, and `net_bool` for cross-shard sync.
- No explicit component dependencies are added via `AddComponent`.
- No tags are added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the component is attached to (the world instance). |
| `_season` | `net_tinybyte` | `SEASONS.autumn` | Current season index (1=autumn, 2=winter, 3=spring, 4=summer). |
| `_totaldaysinseason` | `net_byte` | `TUNING.SEASON_LENGTH_FRIENDLY_DEFAULT * 2` | Total days in the current season (doubled for spring/autumn during transition simulation). |
| `_elapseddaysinseason` | `net_ushortint` | `0` | Days elapsed in the current season. |
| `_remainingdaysinseason` | `net_byte` | `TUNING.SEASON_LENGTH_FRIENDLY_DEFAULT` | Days remaining in the current season. |
| `_endlessdaysinseason` | `net_bool` | `false` | Whether the current season is an endless (peak-phase) season. |
| `_lengths[i]` | `net_byte` | `TUNING.{SEASON}_LENGTH` | Per-season length (in days) for each of the 4 seasons. |
| `_segs[i]` | `table` | `DEFAULT_CLOCK_SEGS[SEASON_NAMES[i]]` | Clock segment counts (day/dusk/night) for each season (stored per-season). |
| `_segmod` | `table` | `{day=1, dusk=1, night=1}` | Multiplier applied to clock segments (for per-player or modded modifications). |
| `_mode` | `integer` | `MODES.cycle` | Current season mode: 1=cycle, 2=endless, 3=always. |
| `_premode` | `boolean` | `false` | Whether the current phase is a pre-endless or pre-cycle warm-up period. |
| `_israndom` | `table` | `{}` | Tracks whether a season’s length was set randomly (prevents overwriting). |

## Main Functions
### `GetModifiedSegs(segs, mod)`
* **Description:** Applies segment modifiers to base clock segments, ensuring the total remains exactly 16. Adjusts segments based on priority (dusk > day > night if overflow, or vice versa if underflow).
* **Parameters:**
  - `segs`: Table with `day`, `dusk`, and `night` values.
  - `mod`: Modifier table (e.g., `{day=0.5, dusk=1.2, night=1.0}`).

### `PushSeasonClockSegs()`
* **Description:** Computes interpolated or current clock segments (including modifiers), then broadcasts `ms_setclocksegs` to the world clock to apply the seasonal day/dusk/night split.
* **Parameters:** None.

### `UpdateSeasonMode(modified_season)`
* **Description:** Recalculates the global season mode (cycle/endless/always) based on active (non-zero-length) seasons. Adjusts season durations, pre-mode flags, and endless-mode ramp logic accordingly.
* **Parameters:**
  - `modified_season`: (Optional) Index of a season whose length was just changed; used to refine update logic.

### `PushMasterSeasonData()`
* **Description:** Packages and broadcasts current season state (`season`, `lengths`, `days`, etc.) to other shards via the `master_seasonsupdate` event.
* **Parameters:** None.

### `OnAdvanceSeason()`
* **Description:** Advances the season by one day (or handles pre-mode/endless-ramp logic). Handles season transitions for all modes (cycle/endless/always) and recalculates remaining/elapsed days.
* **Parameters:** None.

### `OnRetreatSeason()`
* **Description:** Reverses season progression by one day (used for time-travel or debugging). Mirrors the logic of `OnAdvanceSeason` in reverse.
* **Parameters:** None.

### `OnSetSeason(src, season)`
* **Description:** Forcefully sets the current season (valid only on master simulation). Resets elapsed days and updates mode/segments as needed.
* **Parameters:**
  - `season`: String name of the season (`"autumn"`, `"winter"`, `"spring"`, `"summer"`).

### `OnSetSeasonClockSegs(src, segs)`
* **Description:** Sets base clock segments for all seasons (valid only on master shard). Uses defaults if partial or invalid data is provided.
* **Parameters:**
  - `segs`: Table mapping season names to segment tables (e.g., `{ autumn = {day=8, dusk=6, night=2}, ... }`).

### `OnSetSeasonLength(src, data)`
* **Description:** Sets the length (in days) of a specific season. Triggers mode recalculation and segment updates if the current season is affected.
* **Parameters:**
  - `data.season`: Season name string.
  - `data.length`: Integer day count (or `0` to disable the season).
  - `data.random`: Boolean flag to prevent accidental override of random length changes.

### `OnSetSeasonSegModifier(src, mod)`
* **Description:** Applies a modifier to all clock segments (e.g., for per-player seasonal mods or anomalies). Only valid on master shard.
* **Parameters:**
  - `mod`: Table of multipliers for `day`, `dusk`, and `night` segments.

### `self:GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing current season, day progress, and mode (e.g., `"autumn 50 -> 50 days (50 %) cycle"`).
* **Parameters:** None.

### `self:OnSave()`
* **Description:** Serializes season state (mode, segments, lengths, flags) for world save.
* **Parameters:** None.

### `self:OnLoad(data)`
* **Description:** Restores season state from a saved data object.
* **Parameters:**
  - `data`: Saved season state object (matches the structure returned by `OnSave()`).

## Events & Listeners
- **Listens to:**
  - `"seasondirty"` → `OnSeasonDirty()`
  - `"lengthsdirty"` → `OnLengthsDirty()`
  - `"ms_cyclecomplete"` → `OnAdvanceSeason()` (via `_world`)
  - `"ms_advanceseason"` → `OnAdvanceSeason()` (via `_world`)
  - `"ms_retreatseason"` → `OnRetreatSeason()` (via `_world`)
  - `"ms_setseason"` → `OnSetSeason()` (via `_world`)
  - `"ms_setseasonlength"` → `OnSetSeasonLength()` (via `_world`)
  - `"ms_setseasonclocksegs"` → `OnSetSeasonClockSegs()` (via `_world`)
  - `"ms_setseasonsegmodifier"` → `OnSetSeasonSegModifier()` (via `_world`)
  - `"secondary_seasonsupdate"` → `OnSeasonsUpdate()` (via `_world`, only on non-master shards)
- **Triggers:**
  - `"seasontick"` (world event with season progress data)
  - `"seasonlengthschanged"` (world event with updated lengths)
  - `"master_seasonsupdate"` (world event with full season state, only on master shard)
  - `"ms_setclocksegs"` (world event with segment data to update the clock)