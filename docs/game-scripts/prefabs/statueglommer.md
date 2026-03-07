---
id: statueglommer
title: Statueglommer
description: A decorative and functional statue that spawns Glommer-related entities during full moons and responds to player interactions such as mining and flower picking.
tags: [boss, environment, entity, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e08d5061
system_scope: environment
---

# Statueglommer

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`statueglommer` is a prefabricated entity that functions as both a decorative structure and a dynamic gameplay element tied to lunar cycles. It spawns `glommer` followers and `glommerflower` glands on full moons, and behaves like a mineable rock when interacted with. It integrates with multiple systems: `workable` for mining, `pickable` for flower harvesting, `lootdropper` for marble drops, `leader` and `follower` for Glommer entity relationships, and `inspectable` for UI status reporting. Lighting effects modulate dynamically via networked properties to indicate active flower status.

## Usage example
```lua
local inst = SpawnPrefab("statueglommer")
inst.Transform:SetPosition(x, y, z)
inst.components.workable:SetWorkLeft(10)
inst.components.lootdropper:DropLoot(inst:GetPosition())
```

## Dependencies & tags
**Components used:** `inspectable`, `leader`, `pickable`, `workable`, `lootdropper`, `pointofinterest`, `light`, `animstate`, `transform`, `soundemitter`, `minimapentity`, `network`  
**Tags:** Adds `statue`; listens to `isfullmoon` world state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lightval` | `net_tinybyte` | `0` | Tracks current light level (0 to `LIGHT_FRAMES = 6`) for animation and rendering interpolation. |
| `islighton` | `net_bool` | `false` | Boolean flag indicating whether the light is active. |
| `lighttask` | `task` | `nil` | Reference to the periodic task managing light transitions. |
| `spawned` | `boolean` | `false` | Tracks whether Glommer-related entities have been spawned for the current full moon cycle. |

## Main functions
### `SpawnGlommer(inst)`
*   **Description:** Spawns a `glommer` prefab at a safe offset near the statue and sets the statue as its leader. Only runs on the master simulation.
*   **Parameters:** `inst` (entity) — the statueglommer entity instance.
*   **Returns:** `glommer` (entity or `nil`) — the spawned Glommer entity, or `nil` on failure.
*   **Error states:** Returns `nil` if `SpawnPrefab("glommer")` fails.

### `SpawnGland(inst)`
*   **Description:** Ensures a `glommerflower` gland is active (via `pickable:Regen`) and spawns or reactivates a `glommer` follower if missing or dead. Prevents duplicate spawns within the same full moon cycle.
*   **Parameters:** `inst` (entity) — the statueglommer entity instance.
*   **Returns:** Nothing.

### `RemoveGland(inst)`
*   **Description:** Deactivates the `glommerflower` gland (`pickable:MakeEmpty`) and signals associated `glommer` to leave the world. Resets the spawn flag.
*   **Parameters:** `inst` (entity) — the statueglommer entity instance.
*   **Returns:** Nothing.

### `OnLightDirty(inst)`
*   **Description:** Ensures a periodic task exists to update the light animation frame(s). Also triggers an immediate update.
*   **Parameters:** `inst` (entity) — the statueglommer entity instance.
*   **Returns:** Nothing.

### `OnWorked(inst, worker, workleft)`
*   **Description:** Handles mining interactions. When `workleft <= 0`, drops marble loot, plays break sound, hides workable/lootdropper components, and animates to `"low"` state.
*   **Parameters:**  
  - `inst` (entity) — the statueglommer instance.  
  - `worker` (entity) — the entity performing the work.  
  - `workleft` (number) — remaining work ticks before completion.
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Provides status text for inspection UI (e.g., `InspectPage`). Returns `"EMPTY"` when the statue has been mined and the `workable` component removed.
*   **Parameters:** `inst` (entity) — the statueglommer instance.
*   **Returns:** `"EMPTY"` (string) if mined, otherwise `nil`.

### `OnSave(inst, data)`
*   **Description:** Serializes internal state for world persistence. Records whether the statue has been mined (`worked`) and whether the full moon gland was spawned (`spawned`).
*   **Parameters:**  
  - `inst` (entity) — the statueglommer instance.  
  - `data` (table) — the save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores state on load. Applies mined state and respawn tracking, and reactivates light if needed.
*   **Parameters:**  
  - `inst` (entity) — the statueglommer instance.  
  - `data` (table) — the loaded save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `lightdirty` — triggers `OnLightDirty` to update light animation.  
  - World state `"isfullmoon"` — triggers `OnIsFullmoon` to spawn or remove `glommer`/`glommerflower` entities.  
  - `onremove` (via `follower`) — triggers `OnLoseChild` when a follower is removed (e.g., leaves).  
- **Pushes:** None directly.