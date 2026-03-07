---
id: beequeenhive
title: Beequeenhive
description: Serves as the initial dormant hive entity that grows over time and eventually spawns a Bee Queen when destroyed; manages hive growth states, honey level visuals, and work-based spawning logic.
tags: [hive, boss, growth, progression]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f6acd662
system_scope: world
---

# Beequeenhive

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`beequeenhive` is the初始 (pristine) state of the Bee Queen's hive. It exists as a passive, non-blocking hole in the ground and grows over time in discrete stages (hole → small → medium → large). When a player hammers it to completion (or with sufficient chance), it transforms into `beequeenhivegrown`, which spawns the Bee Queen upon destruction. The component coordinates growth timers, honey-level animations, physics size adjustments, and queen-spawning logic via the `workable`, `timer`, `entitytracker`, `inspectable`, and `pointofinterest` components. It functions as a world-state trigger for boss encounters in the Bee Queen event.

## Usage example
```lua
-- The component is instantiated automatically when the game loads the `beequeenhive` prefab.
-- Modders typically interact with it indirectly by:
--   - Monitoring hive growth via `beequeenhive.components.timer` timers
--   - Hooking into `beequeenhivegrown`'s workable callbacks (not directly on the base hive)
--   - Checking `beequeenhive.components.entitytracker:GetEntity("hive")` for spawned hive stages
```

## Dependencies & tags
**Components used:** `timer`, `workable`, `entitytracker`, `inspectable`, `pointofinterest`, `physics` (for `beequeenhivegrown`), `animstate` (for state synchronization), `soundemitter`, `minimapentity`, `transform`.  
**Tags added (base hive):** `blocker`, `event_trigger`, `antlion_sinkhole_blocker`.  
**Tags added (`beequeenhivegrown`):** `FX` (for internal physics entities only, not the prefab itself).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `queenkilled` | boolean | `false` | Tracks whether the Bee Queen was previously spawned and killed (used to reset growth timers correctly). |
| `phystask` | task reference | `nil` | Temporary task used to reset `physrad` after visual/physics size changes. |
| `_honeytask` | task reference | `nil` | Temporary task used to delay honey-level animation updates. |
| `physrad` | `net_tinybyte` | `0` (initial) | Networked property controlling physical radius of spawned physics entities and hive size stages. |

## Main functions
### `PushPhysRad(inst, rad)`
*   **Description:** Initiates a temporary physical size change (e.g., small/medium/large) for the hive and schedules a cleanup that resets `physrad` after 0.5 seconds. Triggers immediate visual update via `OnPhysRadDirty`.
*   **Parameters:** `rad` (number) – target radius level: `1` (small), `2` (medium), `3` (large).
*   **Returns:** Nothing.

### `SetHoneyLevel(inst, honeylevel, delay)`
*   **Description:** Controls which honey overlay animation (`honey0`, `honey1`, `honey2`, `honey3`) is visible, reflecting the work progress toward spawning the Bee Queen. If `delay` is provided, animates the transition with a lag.
*   **Parameters:**  
    `honeylevel` (number) – integer from `0` (none) to `3` (full).  
    `delay` (number, optional) – seconds to delay the change.
*   **Returns:** Nothing.

### `DoSpawnQueen(inst, worker, x1, y1, z1)`
*   **Description:** Destroys the current hive entity, spawns `beequeen`, positions and orients it, sets the attacking worker as the target (if valid), and transitions the queen to the "emerge" state. Registers cleanup hooks with the hive base.
*   **Parameters:**  
    `worker` (entity) – the player who hammered the hive to spawn the queen.  
    `x1, y1, z1` (numbers) – world position to face.
*   **Returns:** Nothing.

### `OnHiveGrowthTimer(inst, data)`
*   **Description:** Handles timer completion events for hive growth (`hivegrowth1`, `hivegrowth2`, `hivegrowth`, `shorthivegrowth`, `firsthivegrowth`). Spawns `beequeenhivegrown` at the appropriate stage with matching animations and physics.
*   **Parameters:** `data` (table) – timer data object containing `name` (string).
*   **Returns:** Nothing.

### `OnWorked(inst, worker, workleft)`
*   **Description:** Callback for when the hive is hammered. Triggers sound/anim feedback, spawns honey/honeycomb loot based on progress, calculates spawn chance for the Bee Queen, and initiates queen emergence if successful.
*   **Parameters:**  
    `worker` (entity) – player performing the work.  
    `workleft` (number) – current work remaining.
*   **Returns:** Nothing.

### `StartHiveGrowthTimer(inst)`
*   **Description:** Resets and starts the appropriate growth timer based on whether a queen was previously killed (`BEEQUEEN_RESPAWN_TIME`) or this is initial growth (`10` seconds for short phase).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopHiveGrowthTimer(inst)`
*   **Description:** Stops all growth-related timers, resets animations to the idle "hole" state, hides honey overlays, and clears `queenkilled` flag.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RefreshHoneyState(inst)`
*   **Description:** Recalculates the honey level from current `workleft` using `CalcHoneyLevel` and updates visual overlays via `SetHoneyLevel`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `EnableBase(inst, enable)`
*   **Description:** Toggles visibility and physics activity of the hive base. Used during transitions to/from growing state.
*   **Parameters:** `enable` (boolean) – whether to activate the base.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `timerdone` – triggers `OnHiveRegenTimer` and `OnHiveGrowthTimer`.  
  `physraddirty` – triggers `OnPhysRadDirty` (client-side only, for physics sync).  
  `animover` – triggers `OnHiveShortGrowAnimOver` or `OnHiveLongGrowAnimOver` during growth animations.  
  `onremove` – triggers `OnQueenRemoved` or `OnHiveRemoved` to detect when spawned hive/queen is removed and restart growth.  
  `OnLoad` / `OnLoadPostPass` / `OnSave` – handles state persistence and re-initialization.  
- **Pushes:** None directly. Event handling is entirely callback-driven.