---
id: seasons
title: Seasons
description: Manages seasonal cycles, progression, and world clock segment assignment for the game world.
tags: [seasons, world, network, clock]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 57f26856
system_scope: world
---

# Seasons

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `seasons` component is a master simulation-only component responsible for tracking and advancing seasons, managing their durations, and controlling the day/dusk/night segment distribution in the world clock. It handles both cycle-based and endless seasonal modes, and synchronizes seasonal state across the server and client shards via network variables. It interacts closely with the world's clock system by pushing updated segment configurations when seasons change.

## Usage example
```lua
-- Typically attached automatically to TheWorld; rarely added manually.
-- Example of reading current season and season length:
local season_name = SEASON_NAMES[TheWorld.components.seasons._season:value()]
local remaining = TheWorld.components.seasons._remainingdaysinseason:value()
local total = TheWorld.components.seasons._totaldaysinseason:value()
print("Current season:", season_name, "Days remaining:", remaining, "/", total)
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance (typically `TheWorld`) that owns this component. |
| `_season` | `net_tinybyte` | `SEASONS.autumn` | Networked current season index (`1=autumn`, `2=winter`, `3=spring`, `4=summer`). |
| `_totaldaysinseason` | `net_byte` | `TUNING.SEASON_LENGTH_FRIENDLY_DEFAULT * 2` | Total days scheduled for the current season. |
| `_elapseddaysinseason` | `net_ushortint` | `0` | Days elapsed in the current season. |
| `_remainingdaysinseason` | `net_byte` | `TUNING.SEASON_LENGTH_FRIENDLY_DEFAULT` | Days remaining in the current season. |
| `_endlessdaysinseason` | `net_bool` | `false` | Whether the current season is in endless mode (i.e., ramping toward and maintaining a fixed length). |
| `_lengths` | `array of net_byte` | — | Array indexed by season index, storing user-defined lengths (via `TUNING.*` or mod overrides). |
| `_segs` | `array of tables` | `DEFAULT_CLOCK_SEGS` | Array of day/dusk/night segment distributions per season (e.g., `{day=8, dusk=6, night=2}` for autumn). |
| `_segmod` | `table` | `{day=1, dusk=1, night=1}` | Multipliers applied to each segment duration (used for dynamic clock adjustments). |
| `_mode` | `number` | `MODES.cycle` | Current season mode: `cycle`, `endless`, or `always`. |
| `_premode` | `boolean` | `false` | Whether the world is in a "pre" phase (e.g., pre-endless ramp-up or cycle pre-sequence). |

## Main functions
The `seasons` component does not expose any public methods beyond save/load/debug helpers. All functional logic is implemented internally via private functions and event handlers.

### `GetDebugString()`
* **Description:** Returns a human-readable summary of the current season state for debugging.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"<SeasonName> <elapsed> -> <remaining> days (<progress> %) <Mode> <(PRE)>"`.
* **Error states:** None.

### `OnSave()`
* **Description:** serializes the component’s internal state for world saving.
* **Parameters:** None.
* **Returns:** `table` — containing `mode`, `premode`, `israndom`, `segs`, `season`, `totaldaysinseason`, `elapseddaysinseason`, `remainingdaysinseason`, `lengths`.

### `OnLoad(data)`
* **Description:** restores the component’s internal state from a saved `data` table during world loading.
* **Parameters:** `data` (table) — saved state as produced by `OnSave()`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `seasondirty` — triggers `OnSeasonDirty`, which pushes `seasontick` and (on mastershard) `master_seasonsupdate`.  
  - `lengthsdirty` — triggers `OnLengthsDirty`, which pushes `seasonlengthschanged` and (on mastershard) `master_seasonsupdate`.  
  - `ms_cyclecomplete`, `ms_advanceseason` — invokes `OnAdvanceSeason`.  
  - `ms_retreatseason` — invokes `OnRetreatSeason`.  
  - `ms_setseason` — invokes `OnSetSeason`.  
  - `ms_setseasonlength` — invokes `OnSetSeasonLength`.  
  - `ms_setseasonclocksegs` — invokes `OnSetSeasonClockSegs`.  
  - `ms_setseasonsegmodifier` — invokes `OnSetSeasonSegModifier`.  
  - `secondary_seasonsupdate` (non-mastershard only) — invokes `OnSeasonsUpdate`.  

- **Pushes:**  
  - `seasontick` — fired on season or day change with progress info.  
  - `seasonlengthschanged` — fired when any season length is updated.  
  - `master_seasonsupdate` — fired from mastershard to propagate full season state to other shards.  
  - `ms_setclocksegs` — pushed to the world clock to apply updated day/dusk/night segments.
