---
id: trap_starfish
title: Trap Starfish
description: A deployable trap prefab that detains and damages entities upon stepping on it, then resets after a delay; functions as a mine with custom trigger logic and AOE attack.
tags: [trap, combat, deployable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 50a98dbd
system_scope: world
---

# Trap Starfish

> Based on game build **7140014** | Last updated: 2026-03-07

## Overview
The `trap_starfish` prefab is a passive trap entity that detects and attacks entities stepping within its radius. It uses the `mine` component to monitor for valid targets, triggers an AOE damage event, transitions to a visual trap state, and automatically resets after a randomized delay. It supports deactivation (via digging), saving/loading state, and interacts with `inspectable`, `workable`, `lootdropper`, and `hauntable` components. Two prefabs are defined: the active `trap_starfish` and its dug-up inventory form `dug_trap_starfish`.

## Usage example
```lua
-- Spawn and deploy a trap starfish
local trap = SpawnPrefab("trap_starfish")
trap.Transform:SetPosition(x, y, z)

-- Later, a player can dig it up
local dug_item = SpawnPrefab("dug_trap_starfish")
dug_item.Transform:SetPosition(x, y, z)

-- Deploy from inventory
dug_item.components.deployable:Deploy(targetpos, deployer)
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `workable`, `hauntable`, `mine`, `inventoryitem`, `stackable`, `deployable`, `health`, `combat`, `burnable` (via lootdropper chain), `inventoryitemmoisture`
**Tags added:** `trap`, `trapdamage`, `birdblocker`, `wet` (active form only)
**Tags checked during triggering:** `monster`, `character`, `animal` (via test_tags)
**Tags excluded during triggering:** `notraptrigger`, `flying`, `ghost`, `playerghost`
**Tags removed on reusable mines:** `mine_not_reusable` (by default, trap is non-reusable)

## Properties
No public properties are initialized directly on the `trap_starfish` prefab itself. Task handles are stored as instance fields (`inst._reset_task`, `inst._snap_task`) but are internal implementation details.

## Main functions
### `do_snap(inst)`
*   **Description:** Executes the trap's attack logic when sprung: plays a sound, finds all entities in radius using `TheSim:FindEntities`, and deals damage via `combat:GetAttacked`. Cancels any pending snap task.
*   **Parameters:** `inst` (Entity) — the trap instance.
*   **Returns:** Nothing.

### `reset(inst)`
*   **Description:** Resets the mine component state and clears tracking fields (`_reset_task`, `_snap_task`). Typically called via a delayed task after springing.
*   **Parameters:** `inst` (Entity) — the trap instance.
*   **Returns:** Nothing.

### `start_reset_task(inst)`
*   **Description:** Schedules a delayed call to `reset` using a randomized time from `TUNING.STARFISH_TRAP_NOTDAY_RESET`. Replaces any existing reset task.
*   **Parameters:** `inst` (Entity) — the trap instance.
*   **Returns:** Nothing.

### `on_explode(inst, target)`
*   **Description:** Called when the mine springs. Plays the trap animation, schedules a delayed `do_snap` if needed, and starts the reset task.
*   **Parameters:**  
    `inst` (Entity) — the trap instance.  
    `target` (Entity or nil) — the first entity that triggered the mine (if any).
*   **Returns:** Nothing.

### `on_reset(inst)`
*   **Description:** Resets animation and sound when the trap re-arms. Restores idle animation and starts characterizing idle variations.
*   **Parameters:** `inst` (Entity) — the trap instance.
*   **Returns:** Nothing.

### `on_sprung(inst)`
*   **Description:** Finalizes the sprung state visually and schedules reset. Removes the animover callback and sets a random frame.
*   **Parameters:** `inst` (Entity) — the trap instance.
*   **Returns:** Nothing.

### `on_deactivate(inst)`
*   **Description:** Spawns `dug_trap_starfish` loot if possible, then removes the trap instance entirely.
*   **Parameters:** `inst` (Entity) — the trap instance.
*   **Returns:** Nothing.

### `get_status(inst)`
*   **Description:** Returns `"CLOSED"` if the trap is currently sprung; otherwise returns `nil`.
*   **Parameters:** `inst` (Entity) — the trap instance.
*   **Returns:** `"CLOSED"` or `nil`.

### `on_starfish_dug_up(inst, digger)`
*   **Description:** Handler for the `workable` component’s finish callback. Triggers `on_deactivate` when the trap is dug up.
*   **Parameters:**  
    `inst` (Entity) — the trap instance.  
    `digger` (Entity) — the entity that finished the DIG action.
*   **Returns:** Nothing.

### `calculate_mine_test_time()`
*   **Description:** Returns a randomized delay time (seconds) for the next mine test cycle, using `TUNING.STARFISH_TRAP_TIMING`.
*   **Parameters:** None.
*   **Returns:** number — randomized test interval in seconds.

### `on_save(inst, data)`
*   **Description:** Saves remaining reset time for persistence across sessions.
*   **Parameters:**  
    `inst` (Entity) — the trap instance.  
    `data` (table) — the table to serialize state into.
*   **Returns:** Nothing.

### `on_load(inst, data)`
*   **Description:** Restores a pending reset task based on saved remaining time.
*   **Parameters:**  
    `inst` (Entity) — the trap instance.  
    `data` (table) — the deserialized save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `animover` — to continue randomized idle animations and switch back to idle.
- **Pushes:**  
  None directly. Uses events handled by components (e.g., `loot_prefab_spawned`, `on_loot_dropped` via `lootdropper`).
