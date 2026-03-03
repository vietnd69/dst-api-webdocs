---
id: clock
title: Clock
description: Manages game time, day/night cycles, and moon phase progression for the world.
tags: [world, time, cycle, moon]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: b5560eee
system_scope: world
---

# Clock

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Clock` is a core world-level component responsible for tracking and synchronizing time progression, including day/night phases, cycle counts, and lunar phases. It handles time discretization into segments (`segs`), maintains phase durations, and manages moon waxing/waning cycles. The component operates differently on master simulation (server), secondary shards, and clients, ensuring consistent state across networked instances. It emits events on time changes and supports save/load functionality for persistent world state.

## Usage example
```lua
-- On an entity (typically TheWorld or a world controller instance)
inst:AddComponent("clock")

-- Query time until a specific phase
local time_until_dusk = inst.components.clock:GetTimeUntilPhase("dusk")

-- Force a phase change (on master simulation)
inst.components.clock.inst:PushEvent("ms_setphase", "night")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `clock` tag to `inst`. No explicit tag operations are performed beyond entity ownership.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance owning this component (typically `TheWorld`). |
| `_segs` | Array of `net_smallbyte` | `[TUNING.DAY_SEGS_DEFAULT, TUNING.DUSK_SEGS_DEFAULT, TUNING.NIGHT_SEGS_DEFAULT]` | Networked segment counts per phase (day/dusk/night). |
| `_cycles` | `net_ushortint` | `0` | Total world cycles elapsed (full moon cycles). |
| `_phase` | `net_tinybyte` | `PHASES.day` (i.e., `1`) | Current phase index (`1=day`, `2=dusk`, `3=night`). |
| `_moonphase` | `net_tinybyte` | `1` (new moon) | Current moon phase index (`1..5`: new, quarter, half, threequarter, full). |
| `_mooniswaxing` | `net_bool` | `true` | Whether the current moon cycle is waxing (`true`) or waning (`false`). |
| `_totaltimeinphase` | `net_float` | `segs[phase] * TUNING.SEG_TIME` | Total duration (in seconds) of the current phase. |
| `_remainingtimeinphase` | `net_float` | `totaltimeinphase` | Remaining time (in seconds) in the current phase. |
| `_moonphasestyle` | `net_tinybyte` | `0` (default) | Current visual style index for moon phases. |

## Main functions
### `GetTimeUntilPhase(phase)`
*   **Description:** Computes the remaining time (in seconds) until the game transitions to the specified phase.  
*   **Parameters:** `phase` (string) — Target phase name: `"day"`, `"dusk"`, or `"night"`.  
*   **Returns:** `number` — Time in seconds until the target phase begins. Returns `0` if the target is invalid or matches the current phase.  
*   **Error states:** Returns `0` if `phase` does not match a known phase name.

### `AddMoonPhaseStyle(style)`
*   **Description:** Registers a new moon phase visual style (for UI or rendering). Modifies the global `MOON_PHASE_STYLE_NAMES` and `MOON_PHASE_STYLES` arrays.  
*   **Parameters:** `style` (string) — Unique identifier for the new style (e.g., `"glassed_alter_active"`).  
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Core time-advancement logic. Runs on master simulation, shards, and clients. Advances `_remainingtimeinphase` based on `dt`, handles phase transitions, moon cycle progression, and emits change events.  
*   **Parameters:** `dt` (number) — Delta time in seconds since the last update.  
*   **Returns:** Nothing.  
*   **Error states:** None.

### `Dump()`
*   **Description:** Prints current clock state (segs, cycles, phase, moon phase, timing) to the console for debugging.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a compact formatted string summarizing the current clock state.  
*   **Parameters:** None.  
*   **Returns:** `string` — e.g., `"4 day: 59.80 : 120.00 (moon cycle: 1)"`.

### `OnSave()`
*   **Description:** Serializes clock state for saving. Only active on master simulation.  
*   **Parameters:** None.  
*   **Returns:** `table` — Save data containing `segs`, `cycles`, `phase` (as string), `mooomphasecycle`, `totaltimeinphase`, `remainingtimeinphase`.

### `OnLoad(data)`
*   **Description:** Restores clock state from save data. Only active on master simulation. Includes fallbacks for legacy save files.  
*   **Parameters:** `data` (table) — Save data from `OnSave()`.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"segsdirty"`, `"cyclesdirty"`, `"phasedirty"`, `"moonphasedirty"`, `"moonphasestyledirty"` — Internal flags reset on sync.  
  - `"playeractivated"` (on `TheWorld`) — Marks all dirty flags true.  
  - `"ms_setclocksegs"` (master) — Updates segment counts.  
  - `"ms_setphase"` (master) — Forces a phase change.  
  - `"ms_nextphase"` (master) — Advances to the next phase.  
  - `"ms_nextcycle"` (master) — Advances to the next cycle (sets phase to `night`).  
  - `"ms_setmoonphase"` (master) — Sets moon phase and waxing state.  
  - `"ms_lockmoonphase"` (master) — Locks/unlocks moon progression.  
  - `"ms_setmoonphasestyle"` (master) — Sets the moon visual style.  
  - `"ms_simunpaused"` (master) — Forces resync of remaining time.  
  - `"secondary_clockupdate"` (non-shard masters) — Syncs clock state from shard.  
- **Pushes:**  
  - `"clocksegschanged"` — When segment counts change.  
  - `"cycleschanged"` — When cycle count increments.  
  - `"phasechanged"` — When phase transitions (deprecated name `"moonphasechanged"` also pushed).  
  - `"moonphasechanged2"` — When moon phase/waxing state changes.  
  - `"moonphasestylechanged"` — When moon visual style changes.  
  - `"clocktick"` — Every frame — provides normalized time data: `{ phase, timeinphase, time }`.  
  - `"ms_cyclecomplete"` (master) — When a full moon cycle completes.  
  - `"master_clockupdate"` (shards) — Broadcasts full clock state to non-shard masters.
