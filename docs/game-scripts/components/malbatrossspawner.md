---
id: malbatrossspawner
title: Malbatrossspawner
description: Manages the spawning and tracking of Malbatross entities near fish shoals in the game world.
tags: [boss, spawner, world, event]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: cc00bb11
system_scope: world
---

# Malbatrossspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Malbatrossspawner` is a master simulation–only component responsible for orchestrating Malbatross appearances in response to fish shoals and player proximity. It tracks fish shoals, monitors timer-based delays, and spawns a Malbatross when conditions (player proximity, successful luck roll, or debug override) are met. It interacts closely with the `worldsettingstimer`, `knownlocations`, and `entitytracker` components to persist state, remember locations, and manage entity references.

This component exists solely on the master simulation (i.e., server or single-player), enforced by an assertion in its constructor.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("malbatrossspawner")

-- Optional: Trigger debug spawn near a specific entity
inst.components.malbatrossspawner:Summon(some_target_entity)

-- Optional: Force relocation (e.g., after killing current Malbatross)
inst.components.malbatrossspawner:Relocate(current_malbatross)
```

## Dependencies & tags
**Components used:**  
- `worldsettingstimer` — to schedule and manage spawn timers.  
- `knownlocations` (on spawned Malbatross) — to remember the Malbatross’s home shoal position.  
- `entitytracker` (on spawned Malbatross) — to track the target feeding shoal.

**Tags:** None added or checked by this component itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity instance this component is attached to (required, set in constructor). |
| `_fishshoals` | `table` | `{}` | Internal map of registered fish shoal entities (`[shoal] = true`). |
| `_firstspawn` | `boolean` | `true` | Tracks whether this is the first Malbatross spawn attempt. |
| `_spawnpending` | `boolean` | `false` | Indicates whether a spawn attempt is currently in progress. |
| `_shuffled_shoals_for_spawning` | `table` | `nil` | List of shuffled shoal keys used during spawning scan loop. |
| `_activemalbatross` | `Entity?` | `nil` | Reference to the currently active Malbatross entity. |

## Main functions
### `OnUpdate(dt)`
* **Description:** Periodically checks registered fish shoals for player proximity. If a shoal has a nearby player and no active Malbatross, it triggers a spawn. Runs only while waiting to spawn or during the scanning phase.
* **Parameters:** `dt` (number) — time delta since last frame (unused internally but required by ECS update loop).
* **Returns:** Nothing.
* **Error states:** None explicitly handled; skips inactive or finished timers.

### `Relocate(target_malbatross)`
* **Description:** Resets the spawn timer and shoal list to restart or accelerate spawning. If a `target_malbatross` is provided, it removes that entity and ensures its home shoal is deprioritized in the next spawn selection. Typically used when a Malbatross is killed.
* **Parameters:**  
  - `target_malbatross` (`Entity?`) — optional existing Malbatross to remove and deprioritize.  
* **Returns:** Nothing.
* **Error states:** No-op if no fish shoals are registered (`next(_fishshoals) == nil`).

### `Summon(_slow_debug_target_entity)`
* **Description:** Manually initiates a spawn sequence by pre-selecting shoals. If a debug target entity is provided, it prioritizes shoals based on distance to that entity (ascending). Used for testing or debug-force spawns.
* **Parameters:**  
  - `_slow_debug_target_entity` (`Entity?`) — optional entity to sort shoals by proximity for debug purposes.  
* **Returns:** Nothing.
* **Error states:** No-op if no fish shoals are registered.

### `OnSave()`
* **Description:** Prepares serializable data for persistence, including spawn timer state, first-spawn flag, and active Malbatross GUID (if any).
* **Parameters:** None.
* **Returns:**  
  - `data` (table) — contains `_firstspawn` (boolean) and `_timerfinished` (boolean), plus `activeguid` (GUID string) if Malbatross exists.  
  - Optional second return value (`ents`) — table of GUIDs for external save handling (only when Malbatross is active).  
* **Error states:** Returns `nil` `activeguid` if no active Malbatross.

### `OnLoad(data)`
* **Description:** Restores internal state from saved data. Handles timer resumption, timer completion callbacks, and first-spawn flag restoration.
* **Parameters:**  
  - `data` (table) — saved state from `OnSave()`.  
* **Returns:** Nothing.
* **Error states:** Uses min-clamped time if `data._time_until_spawn` exceeds maximum delay.

### `LoadPostPass(newents, data)`
* **Description:** Finalizes post-load object resolution by restoring `_activemalbatross` from saved GUID.
* **Parameters:**  
  - `newents` (table) — map of GUID → `{ entity = entity }` after loading.  
  - `data` (table) — original saved data.  
* **Returns:** Nothing.
* **Error states:** Does nothing if `data.activeguid` is missing or `newents[data.activeguid]` is invalid.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string describing current spawn state, timer progress, and number of tracked shoals.
* **Parameters:** None.
* **Returns:** `string` — formatted debug info (e.g., `"Malbatross is coming in 23.42 || Number of tracked shoals: 5"`).

## Events & listeners
- **Listens to:**  
  - `ms_registerfishshoal` — adds a fish shoal and initiates spawns if no active Malbatross.  
  - `ms_unregisterfishshoal` — removes a fish shoal and regenerates spawn list if needed.  
  - `ms_shoalfishhooked` — triggers conditional spawn on hooking a fish (via legacy event).  
  - `ms_shoalfishhooked_redux` — triggers conditional spawn with richer data (player, shoal).  
  - `malbatrossremoved` — clears active spawn state and restarts timer if needed.  
  - `malbatrosskilled` — same as `malbatrossremoved`.  
- **Pushes:** None (does not fire custom events).
