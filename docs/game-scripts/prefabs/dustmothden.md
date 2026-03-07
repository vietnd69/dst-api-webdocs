---
id: dustmothden
title: Dustmothden
description: Acts as a structure that spawns dustmoths after being repaired; manages its own durability, regenerative child-spawning, and loot drops upon destruction.
tags: [structure, spawn, boss, combat, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 710eba9e
system_scope: environment
---

# Dustmothden

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`dustmothden` is a structurally complex prefabricated object (a "den") that serves as a boss or challenge structure in DST. It begins in a damaged state and must be repaired before it begins spawning `dustmoth` entities. It uses multiple core components to manage its state: `childspawner` for controlled enemy generation, `workable` for durability and repair progression, `timer` to manage repair cycles, `entitytracker` to track who repaired it, and `lootdropper` to handle loot generation upon destruction. It interacts with world settings to allow server-side configuration of spawning behavior.

## Usage example
```lua
local den = SpawnPrefab("dustmothden")
den.Transform:SetPosition(x, y, z)

-- Manually trigger repair to begin spawning
den._start_repairing_fn(den, player)

-- Once repaired, the den begins spawning dustmoths automatically.
-- Repair progress can be updated via standard Workable actions.
```

## Dependencies & tags
**Components used:** `childspawner`, `workable`, `timer`, `entitytracker`, `lootdropper`, `inspectable`  
**Tags added:** `structure`  
**Tags checked:** `burnt` (via `lootdropper`), `structure`  
**World settings used:** `DUSTMOTHDEN_ENABLED`, `DUSTMOTHDEN_RELEASE_TIME`, `DUSTMOTHDEN_REGEN_TIME`, `DUSTMOTHDEN_MAX_CHILDREN`, `DUSTMOTHDEN_MAXWORK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_start_repairing_fn` | function | `StartRepairing` | Reference to the repair-start function, exposed for external calling. |
| `_pause_repairing_fn` | function | `PauseRepairing` | Reference to the repair-pause function, exposed for external calling. |

## Main functions
### `StartRepairing(inst, repairer)`
* **Description:** Begins the repair process for the den. Starts the repair timer and plays the repair animation. Tracks the entity performing the repair.
* **Parameters:**  
  `repairer` (entity instance) — The entity repairing the den (typically a player).
* **Returns:** Nothing.
* **Error states:** If a repair timer already exists and is not paused, calling this again has no effect beyond ensuring the timer is active.

### `PauseRepairing(inst)`
* **Description:** Pauses the repair timer and removes the repairer tracking. Returns the den to idle animation unless it's fully broken.
* **Parameters:** None.
* **Returns:** Nothing.

### `MakeWhole(inst, play_growth_anim)`
* **Description:** Restores the den to its full working state. Plays appropriate animation and notifies the repairer. Resets `workable` and `workleft` as needed.
* **Parameters:**  
  `play_growth_anim` (boolean) — If true, plays a growth animation sequence followed by thulite idle; otherwise just plays idle.
* **Returns:** Nothing.

### `OnFinishWork(inst, worker)`
* **Description:** Called when the den is fully worked down (i.e., destroyed). Drops loot, removes workability, plays break sound, and sets animation to idle.
* **Parameters:**  
  `worker` (entity instance) — The entity performing the final hit that destroyed the den.
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Event callback triggered when the repair timer completes. Calls `MakeWhole` with growth animation to fully restore the den.
* **Parameters:**  
  `data` (table) — Contains timer info; only processes when `data.name == "repair"`.
* **Returns:** Nothing.

### `OnLoadPostPass(inst, ents, data)`
* **Description:** Handles post-load restoration of den state. Determines whether den is whole or broken and initializes animations and timers accordingly.
* **Parameters:**  
  `ents` (table) — Entity references from save data.  
  `data` (table) — Save state data.
* **Returns:** Nothing.

### `OnPreLoad(inst, data)`
* **Description:** Prepares the child spawner component before save data is applied (e.g., adjusting world-settings-dependent periods).
* **Parameters:**  
  `data` (table) — Save state data.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` — triggers `OnTimerDone` to complete the repair process.
- **Pushes:** `dustmothden_repaired` — pushed to the repairer entity when the den is fully repaired.
