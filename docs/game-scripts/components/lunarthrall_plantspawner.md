---
id: lunarthrall_plantspawner
title: Lunarthrall Plantspawner
description: Manages the spawning and wave-based infestation of Lunarthrall plants by spawning Gestalt entities and infesting target plants during lunar rift events.
tags: [boss, event, world, spawn, lunar]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2f5324bf
system_scope: world
---

# Lunarthrall Plantspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Lunarthrall_plantspawner` is a world-level component responsible for orchestrating lunar thrall infestations during a lunar rift event. It responds to rift progression, manages plant herds and wild plant patches, and spawns `lunarthrall_plant_gestalt` entities to infest target plants. It coordinates timing, spawns, and wave release using tasks and timers, and integrates with the `herd`, `riftspawner`, `timer`, and `witherable` components.

## Usage example
```lua
-- The component is added automatically to TheWorld at runtime.
-- Manual interaction typically occurs during modded events:
TheWorld.components.lunarthrall_plantspawner:RemoveWave()
local herd = TheWorld.components.lunarthrall_plantspawner:FindHerd()
```

## Dependencies & tags
**Components used:** `herd`, `herdmember`, `riftspawner`, `timer`, `witherable`
**Tags:** Adds `knownlocations` and `herdmember` components to plant entities; checks `epiccorpse`, `lunarthrall_plant`, and `wargcorpse` tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `waves_to_release` | number? | `nil` | Remaining number of waves to spawn. |
| `plantherds` | table | `{}` | List of registered `plantherd` entities. |
| `spawntasks` | table | `{}` | Map of active spawn tasks (`task -> true`). |
| `targetedplants` | table | `{}` | Map of plant GUIDs scheduled for infestation (`guid -> true`). |
| `currentrift` | Entity? | `nil` | Reference to the active `lunarrift_portal` entity. |
| `_spawntask` | Task? | `nil` | Internal task scheduling wave release (`setTimeForPoralRelease`). |
| `_nextspawn` | Task? | `nil` | Internal task triggering next `SpawnThralls`. |

## Main functions
### `MoveGestaltToPlant(thrall)`
* **Description:** Moves a spawned `lunarthrall_plant_gestalt` entity to a position just outside player view range, then toward its target plant. Reuses `PLAYER_CAMERA_SEE_DISTANCE_SQ` to compute an offscreen offset.
* **Parameters:** `thrall` (Entity) – the gestalt prefab instance.
* **Returns:** Nothing.
* **Error states:** Removes `thrall` if its `plant_target` is invalid or nil.

### `SpawnGestalt(target, rift)`
* **Description:** Spawns a `lunarthrall_plant_gestalt` either from a rift portal or offscreen (depending on rift presence and player visibility), and assigns the target plant.
* **Parameters:**  
  - `target` (Entity) – the plant to infest.  
  - `rift` (Entity?) – the `lunarrift_portal` to spawn from (optional).
* **Returns:** Nothing.
* **Error states:** Slight positional jitter logic to avoid spawning directly on players.

### `SpawnPlant(target)`
* **Description:** Spawns a `lunarthrall_plant` and immediately infests and animates it.
* **Parameters:** `target` (Entity) – the plant to infest.
* **Returns:** Nothing.

### `InvadeTarget(target)`
* **Description:** Infests a target plant—either directly via `SpawnGestalt` (if visible) or offscreen via `SpawnPlant` (if not visible).
* **Parameters:** `target` (Entity) – the plant to infest.
* **Returns:** Nothing.
* **Error states:** Early exit if `target` is nil or invalid.

### `FindWildPatch()`
* **Description:** Searches up to 10 random land points for a cluster of valid plants (`plant`, `lunarplant_target`) within 20 units, avoiding already-infested plants. Returns the largest found cluster.
* **Parameters:** None.
* **Returns:** table? – array of plant entities, or `nil`.
* **Error states:** Returns `nil` if no suitable patch is found in 10 tries.

### `FindHerd()`
* **Description:** Selects a plant herd with the highest count of infestable plants. Excludes withered or already-infested plants and clusters containing existing thrall husks (`lunarthrall_plant`) within `EXISTING_PLANT_SPACE`.
* **Parameters:** None.
* **Returns:** Entity? – selected `plantherd` entity, or `nil`.
* **Error states:** Returns `nil` if no eligible herds exist.

### `FindPlant()`
* **Description:** Randomly selects a single infestable plant from all registered plant herds.
* **Parameters:** None.
* **Returns:** Entity? – plant entity, or `nil`.
* **Error states:** Excludes plants with `lunarthrall_plant` attribute.

### `RemoveWave()`
* **Description:** Decrements `waves_to_release` and cancels pending tasks if all waves are spent. Triggers `endrift` timer to destroy the rift.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `waves_to_release` is `nil` or `<= 0`.

### `setHerdsOnPlantable(plantable)`
* **Description:** Ensures a new plant entity has `knownlocations` and `herdmember` components, and registers it for herd-based infestations.
* **Parameters:** `plantable` (Entity) – a newly spawned plant entity.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing current state.
* **Parameters:** None.
* **Returns:** string – formatted like `"Waves remaining: 2 | Next Wave: 5.3 | Spawn Wave in: 10.1"`.

### `OnSave()`
* **Description:** Captures serializable state for save games.
* **Parameters:** None.
* **Returns:**  
  - `data` (table) – holds `waves_to_release`, `spawntask`, `nextspawn`, and `currentrift` GUID/times.  
  - `refs` (table) – array of entity GUIDs for persistence (e.g., rift).

### `OnLoad(data)`
* **Description:** Restores `waves_to_release` from saved data.
* **Parameters:** `data` (table) – data returned from `OnSave`.
* **Returns:** Nothing.

### `LoadPostPass(newents, data)`
* **Description:** Reconnects rift entity and reschedules delayed tasks after load.
* **Parameters:**  
  - `newents` (table) – map of GUID → `{entity}` from save.  
  - `data` (table) – loaded `data` from `OnSave`.
* **Returns:** Nothing.

### `LongUpdate(dt)`
* **Description:** Adjusts task timers each frame to maintain accuracy during lag or pause transitions.
* **Parameters:** `dt` (number) – delta time since last frame.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `ms_lunarrift_maxsize` – triggers `OnLunarRiftReachedMaxSize`. Starts wave release when rift reaches full size.  
  - `plantherdspawned` – registers new plant herd for infestation.  
  - `ms_lunarportal_removed` – cancels pending tasks and clears rift state.  
  - `lunarthrallplant_infested` – removes infested plant from `targetedplants`.  
  - `timerdone` – handles `endrift` timer to destroy rift.  
  - `ms_gestalt_possession` – triggers `RemoveWave` if an epic or warg corpse is possessed.
- **Pushes:** None (does not fire custom events itself).
