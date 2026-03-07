---
id: canopylightrays
title: Canopylightrays
description: Spawns and manages reusable light ray prefabs in a radial area around the owner entity for visual canopy effects.
tags: [environment, fx, lighting, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d4493bdc
system_scope: environment
---

# Canopylightrays

> Based on game build **7140014** | Last updated: 2026-03-03

## Overview
`Canopylightrays` is a map/environment component responsible for procedurally spawning temporary "lightrays_canopy" prefabs in a circular region around its owner entity to simulate lighting effects (e.g., under tree canopies). It implements a reference-counted global pooling system (`Global_Lightrays`) to avoid duplicate light ray prefabs at the same grid-aligned position and properly cleans up those prefabs when the owner is removed.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("canopy_light")
inst:AddComponent("canopylightrays")
-- Light rays spawn automatically after 0 seconds via DoTaskInTime in constructor
-- No further user interaction required; cleanup happens automatically on removal
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None added, removed, or checked by this component. However, prefabs using this component are typically expected to have the `canopy_light` tag.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (set in constructor) | The entity that owns this component. |
| `range` | number | `math.floor(TUNING.SHADE_CANOPY_RANGE/4)` | Radius (in tile units) over which light rays are spawned. |
| `lightray_prefab` | string | `"lightrays_canopy"` | Prefab name used for spawning light ray entities. |
| `lightray_positions` | table of `{x,z}` pairs | `{}` | List of positions (grid-aligned) where this component has spawned light rays. |

## Main functions
### `OnRemoveEntity()`
* **Description:** Cleans up all light rays spawned by this component. Called automatically when the owner entity is removed or the component is detached. Also assigned to `OnRemoveFromEntity`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnLightrays()`
* **Description:** Spawns light ray prefabs within a circular area around the owner’s position. Uses grid-snapped coordinates (4-unit alignment) and reference counting to share rays at the same grid location across multiple owners.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If called after component removal or if `self.inst` is nil, behavior is safe (early exit in `SpawnLightrays` wrapper, `Lightrays` lookup handles missing entries gracefully).

### `DespawnLightrays()`
* **Description:** Decrements reference counts for all previously spawned rays and removes shared prefabs when reference count hits zero.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.

## Notes
- This component uses a global table (`Global_Lightrays`) to cache and reuse light ray prefabs across multiple entities—each ray has a `refs` counter tracking how many `canopylightrays` instances use it.
- Position rounding uses floor division and alignment to 4-unit grid: `math.floor((pos + offset) / 4) * 4 + 2`, ensuring rays align to a 4×4 cell grid centered at mid-cells.
- Initial spawn is deferred via `inst:DoTaskInTime(0, SpawnLightrays)`; `SpawnLightrays` itself is wrapped in a global helper function for the task scheduler.
- No network replication or event signaling is performed—this component operates entirely client- and server-side locally without cross-process impact.
