---
id: canopyshadows
title: Canopyshadows
description: Manages the spawning and despawning of leaf canopy shadow tiles around an entity within a configurable radius.
tags: [environment, lighting, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 56402517
system_scope: environment
---

# Canopyshadows

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Canopyshadows` is a world-generation and rendering helper component that controls dynamic leaf canopy shadows for a given entity. It calculates shadow tile positions in a circular area around the entity, tracks shared references to those tiles via a global registry (`Global_Canopyshadows`), and spawns/despawns the visual effects (`SpawnLeafCanopy` / `DespawnLeafCanopy`) when the entity is awake. It also pauses shadow rendering when the entity enters a sleeping state (e.g., during loading or off-screen culling).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("canopyshadows")

-- Shadows are automatically generated and spawned at startup.
-- The component automatically responds to entity sleep/wake states.
-- To remove shadows when the entity is destroyed:
inst.components.canopyshadows:OnRemoveEntity()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | *(passed in)* | The entity instance this component is attached to. |
| `range` | number | `math.floor(TUNING.SHADE_CANOPY_RANGE/4)` | Radius (in tile units) over which shadow positions are computed. |
| `canopy_positions` | table | `{}` | List of `{x, z}` coordinate pairs (aligned to 4-tile grid) where shadows may be spawned. |
| `spawned` | boolean | `false` | Whether canopy shadows are currently visible. |

## Main functions
### `GenerateCanopyShadowPositions()`
* **Description:** Computes a set of circularly distributed tile positions around the entity, aligned to a 4-tile grid, and registers them in the global shadow registry. Each tile is only added with 80% probability.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; silently skips if called on an invalid component instance.

### `RemoveCanopyShadowPositions()`
* **Description:** Removes the component’s registered shadow positions from the global registry, decrementing reference counts and clearing entries when no longer referenced.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnShadows()`
* **Description:** Spawns leaf canopy prefabs (`SpawnLeafCanopy`) at all registered positions, but only if not already spawned and the entity is awake. Uses reference counting to avoid duplicate spawns for overlapping entities.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `self.spawned` is `true` or the entity is not awake.

### `DespawnShadows(ignore_entity_sleep)`
* **Description:** Despawns leaf canopy prefabs (`DespawnLeafCanopy`) using reference counting. If `ignore_entity_sleep` is `true`, it proceeds regardless of sleep state (used during entity removal).
* **Parameters:** `ignore_entity_sleep` (boolean) — if `true`, bypasses the entity-wake check.
* **Returns:** Nothing.
* **Error states:** Returns early if `self.spawned` is `false` or (if `ignore_entity_sleep` is `false`) the entity is currently awake.

### `OnRemoveEntity()`
* **Description:** Cleans up all shadow positions and ensures all associated shadow prefabs are despawned.
* **Parameters:** None.
* **Returns:** Nothing.
* **Notes:** Also assigned to `OnRemoveFromEntity`.

### `OnEntitySleep()`
* **Description:** Pauses shadow rendering by calling `DespawnShadows()` when the entity goes to sleep.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntityWake()`
* **Description:** Restores shadow rendering by calling `SpawnShadows()` when the entity wakes up.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None.  
*(Note: The component uses `inst:DoTaskInTime(0, ...)` in its constructor to trigger one-time initialization, but no event listeners are registered via `inst:ListenForEvent` in this file.)*
