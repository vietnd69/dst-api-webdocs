---
id: yotc_carrat_race_start
title: Yotc Carrat Race Start
description: A structure that initiates and manages carrat racing events; it spawns racers, triggers race start/end logic, and handles destruction with burn and hammer interactions.
tags: [racing, structure, event, loot, fire]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 46c6ba1c
system_scope: entity
---

# Yotc Carrat Race Start

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`yotc_carrat_race_start` is a prefabricated structure used to begin and manage carrat races. It acts as the race start gate and coordinates with the `yotc_raceprizemanager`, `yotc_racestart`, `yotc_racecompetitor`, and `yotc_racestats` components to register racers, start/end races, and handle race statistics. It supports construction, hammering, burning, and integration with the deployable kit system. When activated, it spawns three ghost racers with randomized but calibrated stat spreads and triggers race-phase transitions.

## Usage example
```lua
local inst = SpawnPrefab("yotc_carrat_race_start")
inst.Transform:SetPosition(x, 0, z)

-- Typically initialized by the game’sPrefab system; not usually instantiated manually in mods.
-- To trigger a race start after placement:
inst:PushEvent("yotc_start_race") -- if such an event is used upstream
-- or directly invoke the racestart component:
if inst.components.yotc_racestart then
    inst.components.yotc_racestart:OnStartRace(inst) -- internal callback, not public API
end
```

## Dependencies & tags
**Components used:**  
- `yotc_racestart` (attached, with callbacks)  
- `lootdropper`  
- `workable`  
- `burnable`  
- `inspectable` (only on master)  
- `small_propagator`  
- `hauntable` (via `MakeHauntableWork`)  

**Tags:**  
- Adds: `structure`, `yotc_racestart`  
- Checks: `burnt` (via `yotc_racestart.onburnt` and `lootdropper.DropLoot`), `yotc_racestart` (tag-based optimization)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `racestartstring` | string | `"ANNOUNCE_CARRAT_START_RACE"` | Localization key used for race start announcements. |

## Main functions
### `OnStartRace(inst)`
*   **Description:** Initiates the race by playing the "use" animation and scheduling the gong hit event. Spawns three ghost racers with stat spreads derived from a reference racer’s stats. Must be called when the race should begin.
*   **Parameters:** `inst` (Entity) — the race start structure instance.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling, but race starts only if `yotc_raceprizemanager` is present (checked via `TheWorld.components.yotc_raceprizemanager`).

### `OnEndRace(inst)`
*   **Description:** Ends the race by resetting animations (to "reset" → "idle"). Calls `yotc_racestart:EndRace()` to remove the `race_on` tag.
*   **Parameters:** `inst` (Entity) — the race start structure instance.
*   **Returns:** Nothing.

### `OnGongHit(inst)`
*   **Description:** Triggered after a fixed delay (`GONG_HIT_DELAY`) from `OnStartRace`. Plays the gong sound and invokes `yotc_raceprizemanager:BeginRace(inst)`.
*   **Parameters:** `inst` (Entity) — the race start structure instance.
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Executed when the structure is fully hammered (workable finishes). Drops loot (adjusted for burn state), spawns a `collapse_big` FX, and removes the entity.
*   **Parameters:**  
  - `inst` (Entity) — the race start structure instance.  
  - `worker` (Entity) — the entity performing the hammering.  
*   **Returns:** Nothing.

### `onburnt(inst)`
*   **Description:** Called when the structure finishes burning. Burns the rug sub-entity, removes the `yotc_racestart` component, sets animation to "burnt", and notifies the rug with `"onburntup"` event.
*   **Parameters:** `inst` (Entity) — the race start structure instance.
*   **Returns:** Nothing.

### `SpawnGhostRacer(inst, num_stat_points)`
*   **Description:** Spawns a `carrat_ghostracer` at a walkable offset from the race start, registers it with the race manager, sets its start point, adds random stat spread based on `num_stat_points`, and saves stats as baseline.
*   **Parameters:**  
  - `inst` (Entity) — the race start structure instance.  
  - `num_stat_points` (number) — desired total stat points to distribute (after clamping to `BAD_STAT_SPREAD`).  
*   **Returns:** Nothing.

### `SpawnGhostRacers(inst, race_data)`
*   **Description:** Helper that calls `SpawnGhostRacer` three times with varying stat formulas when `race_data.num_racers == 1`. Uses stat points from an existing racer to calibrate difficulty.
*   **Parameters:**  
  - `inst` (Entity) — the race start structure instance.  
  - `race_data` (table?) — race metadata containing `num_racers` and optional `racers` list. May be `nil`.  
*   **Returns:** Nothing.

### `MakeRug(inst)`
*   **Description:** Spawns a `yotc_carrat_rug` prefab and parents it to the race start structure for visual placement effect.
*   **Parameters:** `inst` (Entity) — the race start structure instance.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes burn state for persistence: sets `data.burnt = true` if the structure is burnt or currently burning.
*   **Parameters:**  
  - `inst` (Entity) — the race start structure instance.  
  - `data` (table) — the save data table to populate.  
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores burn state during world load: triggers `onburnt` if `data.burnt` is `true`.
*   **Parameters:**  
  - `inst` (Entity) — the race start structure instance.  
  - `data` (table) — the loaded data table (may be `nil`).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onbuilt` — triggers `onbuilt` function to set animation and notify rug.  
  - `yotc_race_over` — triggers `OnRaceOver`, which calls `yotc_racestart:EndRace()`.  

- **Pushes:**  
  - None directly. Internally, via sub-entity rug: `"onbuilt"` and `"onburntup"`.  
  - Internally via `yotc_raceprizemanager`: `"BeginRace"` is invoked when gong hits.