---
id: carrat
title: Carrat
description: Manages the carrat (a rabbit-like creature) entity, including its burrowing behavior, racing mechanics in the YOTC event, and interaction with other game systems like cooking, inventory, and state transitions.
tags: [entity, yotc, racing, burrow, inventory]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 32ff175f
system_scope: entity
---

# Carrat

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`carrat.lua` defines two prefabs: the active `carrat` and the planted/fixed `carrat_planted`. The carrat functions as a companion creature in Don't Starve Together, with special racing mechanics in the Year of the Carrot (YOTC) event. It supports state transitions between an emerged (mobile) and submerged (buried/carrot) form, integrates with the YOTC race system (including stamina, speed, reaction, and direction stats), and handles interactions such as training, eating seeds (which changes color), dropping prizes on death, and degradation over time. The component is primarily responsible for configuring components, state graphs, brain, and event callbacks—not implementing new components, but orchestrating existing ones to support its dual identity and gameplay features.

## Usage example
```lua
-- Typical usage is internal to the game; creating a carrat involves:
local carrat = SpawnPrefab("carrat")
if IsSpecialEventActive(SPECIAL_EVENTS.YOTC) then
    carrat:DoTaskInTime(0, function() carrat.components.yotc_racestats:AddRandomPointSpread(4) end)
    carrat.components.yotc_racestats:SaveCurrentStatsAsBaseline()
end

-- Later, a player can bury it:
carrat:GoToSubmerged()

-- Or drop it to start a race if near a race start point:
carrat:DoTaskInTime(0, function()
    carrat.Transform:SetPosition(start_point.Transform:GetWorldPosition())
    carrat:PushEvent("drop", {})
end)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `yotc_racestats`, `yotc_racecompetitor`, `entitytracker`, `named`, `health`, `locomotor`, `drownable`, `lootdropper`, `cookable`, `combat`, `burnable`, `propagator`, `sleeper`, `eater`, `inspectable`, `tradable`, `hauntable`, `pickable`, `workable`, `perishable`, `freezable`, `sleeper`.

**Tags added:** `animal`, `canbetrapped`, `catfood`, `cattoy`, `prey`, `smallcreature`, `stunnedbybomb`, `lunar_aligned`, `cookable`, `noauradamage`, `has_no_prize`, `has_prize`, `yotc_racestart`.

**Tags conditionally added:** `strongstomach` (via `eater`), `has_no_prize` / `has_prize` (YOTC), `ignoretalking` (client).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_color` | string or `nil` | `nil` | Current color of carrat (e.g., `"blue"`, `"brown"`, `"NEUTRAL"`, `"RANDOM"`). Used for cosmetic swapping. |
| `_is_burrowed` | boolean | `false` | Tracks whether the carrat is currently in the planted/submerged state. |
| `_trained_today` | boolean | `false` | Tracks whether the carrat has been trained today (YOTC feature). Reset each night. |
| `beefalo_carrat` | boolean | `nil` | True if this carrat is a wild beefalo carrat variant. |
| `_musicstate` | `net_tinybyte` | `CARRAT_MUSIC_STATES.NONE` | Networked value indicating current music state (none, race, etc.). |
| `_planted_ruffle_task` | `Task` | `nil` | Task that periodically plays planted ruffle animation. |
| `_spread_stats_task` | `Task` | `nil` | Task used to randomly spread stats on spawn (YOTC). |

## Main functions
### `GoToSubmerged()`
* **Description:** Transforms the active carrat into a planted, immobile carrot form (submerged). Removes mobility and combat components, adds `pickable` and `workable` components (to dig it up), and enables lighting.
* **Parameters:** None.
* **Returns:** Nothing.

### `GoToEmerged()`
* **Description:** Restores the carrat to its active, mobile form (emerged). Re-adds locomotion, combat, cookable, and other components needed for gameplay.
* **Parameters:** None.
* **Returns:** Nothing.

### `setbeefalocarratrat()`
* **Description:** Marks the carrat as a beefalo carrat variant (wild variant used in YOTC).
* **Parameters:** None.
* **Returns:** Nothing.

### `settrapdata()`
* **Description:** Returns a table containing the carrat's color and YOTC race stats (`speed`, `stamina`, `direction`, `reaction`) for save/restore when trapped.
* **Parameters:** None.
* **Returns:** `{ colour = string or nil, stats = { speed, stamina, direction, reaction } }`

### `restoredatafromtrap(inst, data)`
* **Description:** Restores carrat's color and YOTC stats from trap data during load.
* **Parameters:** `inst` (Entity), `data` (table) — contains `colour` and `stats`.
* **Returns:** Nothing.

### `common_setcolor(inst, color)`
* **Description:** Applies a color swap to the carrat or planted carrat, updating animation symbols and inventory image name.
* **Parameters:** `color` (string) — `"RANDOM"`, `"NEUTRAL"`, or one of `"blue"`, `"brown"`, `"green"`, `"pink"`, `"purple"`, `"white"`, `"yellow"`.
* **Returns:** Nothing.

### `docarratfailtalk(inst, stat)`
* **Description:** Informs the trainer (via talker) when carrat fails a race stat check (direction, reaction, speed, stamina).
* **Parameters:** `stat` (string) — `"direction"`, `"reaction"`, `"speed"`, or `"stamina"`.
* **Returns:** Nothing.

### `yotc_on_inventory(inst, owner)`
* **Description:** Called when carrat is added to an inventory. Removes `yotc_racecompetitor` if present (e.g., when picked up), gives back prize if needed, and clears name/training overrides.
* **Parameters:** `owner` (Entity) — the inventory owner (usually a player).
* **Returns:** Nothing.

### `yotc_oneatfn(inst, data)`
* **Description:** Handles color change when carrat eats food (e.g., vegetable seeds). The food type determines the resulting color.
* **Parameters:** `data.food` (Entity or `nil`) — the food item.
* **Returns:** Nothing.

### `on_dropped(inst)`
* **Description:** Handles carrat when dropped on the ground. Attempts to add the carrat to an existing race (if near a race start point), or puts it into stunned or idle state.
* **Parameters:** None.
* **Returns:** Nothing.

### `race_begun(inst)`
* **Description:** Initializes carrat for a race: sets stamina, speed, and reaction states, stuns or delays start based on reaction stat, and configures physics.
* **Parameters:** None.
* **Returns:** Nothing.

### `reached_finish_line(inst)`
* **Description:** Stops race-specific movement speed and restores standard character physics upon finishing a race.
* **Parameters:** None.
* **Returns:** Nothing.

### `full_race_over(inst)`
* **Description:** After race concludes, makes the carrat pickable again if in post-race or pre-race state.
* **Parameters:** None.
* **Returns:** Nothing.

### `spread_stats(inst)`
* **Description:** Randomly distributes stats (based on wild or tamed variant) and saves them as baseline for future degradation.
* **Parameters:** None.
* **Returns:** Nothing.

### `_dospeedgym(inst)`, `_dodirectiongym(inst)`, `_doreactiongym(inst)`, `_dostaminagym(inst)`
* **Description:** Increases a single race stat by 1 point and sets `_trained_today` flag to `true`.
* **Parameters:** None.
* **Returns:** Nothing.

### `yotc_nighttime_degrade_test(inst, isnight)`
* **Description:** Called each night. If not trained today and not actively racing, degrades race stats. Resets `_trained_today` if trained.
* **Parameters:** `isnight` (boolean) — true if night cycle.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `musicstatedirty` — triggers play racemusic event for nearby players when music state changes to race.  
  - `death` — drops race prize if the carrat has one.  
  - `oneat` — triggers color change upon eating.  
  - `carrat_error_direction`, `carrat_error_walking`, `carrat_error_sleeping` — triggers trainer feedback via talker.  
  - `isnight` (WorldState) — used to degrade stats at night.  
  - `onignite` (via `burnable`) — transitions to emerged state if ignited while planted.  
  - `onpicked` (via `pickable`) — transitions to emerged state if picked while planted.  
  - `onfinish` (via `workable`) — transitions to emerged and calls dug_up callback when dug up.  
  - `haunt` (via `hauntable`) — always returns true for planted carrat.

- **Pushes:**  
  - `playracemusic` — to the local player when in race music state and nearby.  
  - `perishchange` — via `perishable` (not directly called, but used internally).  
  - `imagechange` — via `inventoryitem` when color changes.  
  - Race/brain state events (`SGcarrat`), not directly in this file.
