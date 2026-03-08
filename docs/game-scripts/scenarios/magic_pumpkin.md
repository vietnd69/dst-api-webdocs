---
id: magic_pumpkin
title: Magic Pumpkin
description: A scenario-triggered trap that triggers when a pumpkin carver is picked up, growing the pumpkin into an oversized state and spawning crows and a shadow effect.
tags: [scenario, trap, halloween, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: b890418b
system_scope: world
---

# Magic Pumpkin

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`magic_pumpkin` is a scenario callback module that defines behavior for a special pumpkin trap. It waits for a pumpkin carver to be placed into an inventory (typically by the player), then triggers a trap: the pumpkin rapidly grows to its oversized state, emits sound effects, spawns shadow FX, and summons a flock of crows. It uses the `growable` component to force growth and the `pumpkincarver` component to detect the required triggering item. It is designed to be used as a one-time scenario event during Halloween or similar themed scenarios.

## Usage example
```lua
-- Typically invoked by the scenario runner when placing the pumpkin in the world
local pumpkin = SpawnPrefab("magic_pumpkin")
pumpkin.Transform:SetPosition(x, y, z)
-- Later, when a carver is placed in the pumpkin's inventory slot, the trap triggers automatically
```

## Dependencies & tags
**Components used:** `growable`, `pumpkincarver`  
**Tags checked:**  
- Must-have tags for carver: `_inventoryitem`  
- Forbidden tags for carver: `FX`, `NOCLICK`, `DECOR`, `INLIMBO`  
- Bird blocker check uses: `birdblocker`

## Properties
No public properties — this module exports only function callbacks (`OnLoad`, `OnDestroy`) and uses instance-local state.

## Main functions
### `OnLoad(inst, scenariorunner)`
*   **Description:** Initializes the trap upon pumpkin spawn. Locates a nearby pumpkin carver, sets up a callback to trigger the trap when the carver is picked up, and pauses the pumpkin’s growth.  
*   **Parameters:**  
  - `inst` (entity) — the magic pumpkin instance.  
  - `scenariorunner` (object) — scenario runner instance, used to abort the scenario if setup fails.  
*   **Returns:** Nothing.  
*   **Error states:** Returns early if the pumpkin lacks a `growable` component or no valid carver is found within range (5 units), in which case it clears the scenario.

### `OnDestroy(inst)`
*   **Description:** Cleanup callback invoked when the pumpkin is destroyed. Removes the event listener for `onputininventory` to prevent memory leaks or stale callbacks.  
*   **Parameters:**  
  - `inst` (entity) — the magic pumpkin instance.  
*   **Returns:** Nothing.

### `TriggerTrap(inst, scenariorunner)`
*   **Description:** Internal handler that executes the trap sequence: forces oversized growth, plays sounds, spawns shadow FX, and spawns crows.  
*   **Parameters:**  
  - `inst` (entity) — the magic pumpkin instance.  
  - `scenariorunner` (object) — scenario runner instance (used only to clear scenario initially).  
*   **Returns:** Nothing.  
*   **Error states:** Returns early if `inst.components.growable` is missing.

### `IsPumpkinCarver(carver)`
*   **Description:** Predicate function used to identify valid pumpkin carvers during entity search.  
*   **Parameters:**  
  - `carver` (entity or nil) — candidate entity to test.  
*   **Returns:** `true` if `carver.components.pumpkincarver` exists; otherwise `false`.

### `GetCrowSpawnPoint(x, z)`
*   **Description:** Finds a valid spawn position for crows around the trap origin using a radial fan search. Ensures the spot is passable, free of creep, and clear of birdblockers.  
*   **Parameters:**  
  - `x`, `z` (numbers) — world coordinates for the trap center.  
*   **Returns:** `Vector3` position if valid spawn point found; `nil` otherwise.

### `SpawnCrows(x, z)`
*   **Description:** Spawns 8–14 crows near the trap with staggered delays and alternating rotations.  
*   **Parameters:**  
  - `x`, `z` (numbers) — world coordinates to spawn crows around.  
*   **Returns:** Nothing.

### `SpawnShadowEffect(x, z)`
*   **Description:** Spawns a `statue_transition` FX at the trap location.  
*   **Parameters:**  
  - `x`, `z` (numbers) — world coordinates for FX placement.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onputininventory` — fired on the pumpkin carver when placed into the pumpkin’s inventory slot; triggers `TriggerTrap`.
- **Pushes:** None.