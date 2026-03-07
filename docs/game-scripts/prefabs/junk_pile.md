---
id: junk_pile
title: Junk Pile
description: Manages the interactive junk pile object that players and NPCs can deconstruct to harvest loot, with dynamic health stages, animation updates, and boss mob loot theft detection.
tags: [loot, environment, entity, world]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1ee84892
system_scope: environment
---

# Junk Pile

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `junk_pile` prefab represents a destructible environmental object found in the game world that can be worked on to harvest loot. It uses the `workable` component for structured interaction (stages, callbacks, multiplier logic) and the `pickable` component to trigger work actions. The prefab dynamically updates physics radius, animation state, and sound based on remaining integrity, and supports multiple visual variants. When fully dismantled, it spawns break effects and loots; when used by non-junk mobs near players, it notifies nearby junk mobs of theft.

## Usage example
```lua
local inst = SpawnPrefab("junk_pile")
inst.Transform:SetPosition(x, y, z)
inst.components.workable:SetWorkLeft(3) -- Full health
inst:UpdateArt() -- Sync visual state
```

## Dependencies & tags
**Components used:** `lootdropper`, `inspectable`, `pickable`, `workable`
**Tags:** Adds `junk_pile`, `pickable_rummage_str`, `NPC_workable`; checks `junk`, `junkmob`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `variant_num` | number | `1`–`3` (random) | Visual variant index (affects animation bank selection). |
| `_pickingloop` | boolean? | `nil` | Indicates whether a picking loop animation is playing. |
| `_pickers` | table? | `nil` | Map of entity references to event callbacks for picking state tracking. |
| `_pickingtask` | Task? | `nil` | Delayed task for starting loot-picking loop. |
| `_runcollisions` | table | `{}` | Placeholder for collision tracking; unused in current implementation. |

## Main functions
### `UpdateArt(workleft)`
*   **Description:** Updates the animation and physics to match the current work stage. Called during initialization, damage, and stage transitions.
*   **Parameters:** `workleft` (number, optional) - Remaining work stages; defaults to `components.workable:GetWorkLeft()`.
*   **Returns:** Nothing.

### `Shake(workleft, nosound)`
*   **Description:** Triggers a looping picking animation and optional sound; prevents animation flicker during rapid stages.
*   **Parameters:**  
    `workleft` (number, optional) - Remaining work stages; defaults to `components.workable:GetWorkLeft()`.  
    `nosound` (boolean, optional) - If truthy, suppresses sound playback.
*   **Returns:** Nothing.

### `SetRandomStage(inst)`
*   **Description:** Randomly sets the starting stage (1, 2, or 3) based on weighted probabilities (20%: 1, 20%: 2, 60%: 3). Used for world-generated piles.
*   **Parameters:** `inst` (Entity) - The junk pile instance.
*   **Returns:** Nothing.

### `OnWork(inst, worker, workleft, numwork)`
*   **Description:** Core work callback. Handles stage progression, junk accumulation, break effects, loot generation, and notifies nearby junk mobs of theft when a player is nearby.
*   **Parameters:**  
    `inst` (Entity) - The junk pile instance.  
    `worker` (Entity) - The entity performing work.  
    `workleft` (number) - Current remaining work stages.  
    `numwork` (number) - Work units applied this call.
*   **Returns:** Nothing. Early returns occur on no-op conditions (e.g., junk mob stacking without positional change).

### `SpawnLoot(inst, digger, nopickup)`
*   **Description:** Delegates loot spawning to `junk_common.SpawnJunkLoot`.
*   **Parameters:**  
    `inst` (Entity) - The junk pile instance.  
    `digger` (Entity, optional) - The entity that broke the pile.  
    `nopickup` (boolean, optional) - If truthy, prevents auto-pickup for the digger.
*   **Returns:** Nothing.

### `StartPickingLoot(inst)`
*   **Description:** Begins the looping picking animation and sound when multiple workers are engaged. Called after a short delay.
*   **Parameters:** `inst` (Entity) - The junk pile instance.
*   **Returns:** Nothing.

### `StopPickingLoot(inst, nosound)`
*   **Description:** Stops the picking loop, kills associated sound, and returns to idle animation.
*   **Parameters:**  
    `inst` (Entity) - The junk pile instance.  
    `nosound` (boolean, optional) - If truthy, suppresses the termination sound.
*   **Returns:** Nothing.

### `OnStartPicking(inst, doer)`
*   **Description:** Registers state-change and removal callbacks for a worker (`doer`) to detect when they stop working (e.g., interrupted).
*   **Parameters:**  
    `inst` (Entity) - The junk pile instance.  
    `doer` (Entity) - The worker starting to pick.
*   **Returns:** Nothing.

### `CancelPicking(inst, doer, nosound)`
*   **Description:** Removes a worker's callbacks and stops the picking loop if no workers remain.
*   **Parameters:**  
    `inst` (Entity) - The junk pile instance.  
    `doer` (Entity) - The worker stopping.  
    `nosound` (boolean, optional) - Suppresses termination sound.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `startlongaction` - Triggers `OnStartPicking` when a worker begins a long action on the pile.  
- **Listens to per worker:** `newstate`, `onremove` on the worker entity (removed via `CancelPicking`).  
- **Pushes:** `ms_junkstolen` - Fired on nearby `junkmob` entities when a player dismantles the pile.
