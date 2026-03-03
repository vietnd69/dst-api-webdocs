---
id: deerherding
title: Deerherding
description: Manages collective behavior and movement logic for deer herds, including grazing, roaming, spook responses, and herd cohesion.
tags: [locomotion, ai, group]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 8a372280
system_scope: world
---

# Deerherding

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Deerherding` component governs the emergent flocking behavior of deer groups. It computes herd-level movement, maintains spatial relationships between deer, determines grazing vs. roaming states, and reacts to threats (e.g., fire damage, enemy targets, or hauntable panic). It interacts closely with `deerherdspawner` for herd membership, `knownlocations` to cache positional offsets, and `combat`/`health`/`hauntable` to detect spook conditions. This component is typically attached to the world or a central entity managing the deer population.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("deerherding")
inst.components.deerherding:Init(starting_position, TheWorld.components.deerherdspawner)
inst.components.deerherding:SetValidAareaCheckFn(function(inst, x, y, z) return not IsWet(x, y, z) end)
```

## Dependencies & tags
**Components used:** `combat`, `deerherdspawner`, `hauntable`, `health`, `knownlocations`  
**Tags:** Checks tags like `"INLIMBO"`, `"fire"`, `"burnt"`, `"wall"`, `"structure"`, `"saltlick"` via `TheSim:FindEntities`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set via constructor) | Reference to the owning entity. |
| `herdhomelocation` | `Vector3` or `nil` | `nil` | Initial center point for the herd. |
| `herdlocation` | `Vector3` | `Vector3(0,0,0)` | Current target location for herd movement. |
| `herdheading` | number | `0` | Current heading direction in degrees. |
| `herdspawner` | component or `nil` | `nil` | Reference to `deerherdspawner` component; required for herd membership. |
| `isspooked` | boolean | `false` | Whether the herd is currently fleeing (read-only; set internally). |
| `isgrazing` | boolean | `false` | Whether the herd is currently in grazing mode. |
| `grazetimer` | number | `GRAZING_TIME` | Time remaining (in seconds) before switching between grazing/roaming. |
| `grazing_time` | number | `20` | Duration (seconds) of a grazing phase. |
| `roaming_time` | number | `20` | Duration (seconds) of a roaming phase. |
| `keepheading` | boolean or `nil` | `nil` | If `true`, forces herd heading; set during spook or when alert targets exist. |
| `alerttargets` | table | `{}` | Map of `deer -> target` for alert behavior; used to compute shared spook direction. |

## Main functions
### `Init(startingpt, herdspawner)`
*   **Description:** Initializes the component with a starting herd position and a reference to the `deerherdspawner` component. Must be called before other logic can operate.
*   **Parameters:**  
    `startingpt` (`Vector3`) — starting location (usually spawn point).  
    `herdspawner` (`Component`) — component managing the herd member table.
*   **Returns:** Nothing.

### `CalcHerdCenterPoint(detailedinfo)`
*   **Description:** Computes the average position, heading, max distance, and list of active deer within `ACTIVE_HERD_RADIUS` (25 units). Used to determine flock center and movement offset.
*   **Parameters:**  
    `detailedinfo` (`boolean`) — if `true`, populates and returns the `activedeer` list and facing angle.
*   **Returns:**  
    `center` (`Vector3` or `nil`) — average position of active deer.  
    `facing` (`number`) — average heading (in degrees).  
    `max_dist` (`number`) — squared max distance of any active deer from center (≥ 3).  
    `activedeer` (`table` or omitted) — list of deer entities if `detailedinfo == true`.
*   **Error states:** Returns `nil` if no active deer are found.

### `UpdateHerdLocation(radius)`
*   **Description:** Calculates a new walkable target position for the herd center using `FindWalkableOffset`, applies flocking offsets to individual deer via `knownlocations`, and forces brain updates. Respects `keepheading` and avoids walls/water.
*   **Parameters:**  
    `radius` (`number`) — movement radius (e.g., `TUNING.DEER_HERD_MOVE_DIST`).
*   **Returns:** Nothing.

### `UpdateDeerHerdingStatus()`
*   **Description:** Updates the `wasactive` status of each deer in the herd based on distance, urban structure density, and saltlick proximity. Marks deer inactive if too far (`INACTIVE_HERD_RADIUS`), in high-structure zones, or near saltlicks.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CalcIsHerdSpooked()`
*   **Description:** Checks whether *any* active deer in the herd is taking fire damage, has a combat target, or is panicking (via `hauntable.panic`). Returns `true` if spooked.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if spooked, otherwise `false`.

### `IsAnyEntityAsleep()`
*   **Description:** Returns `true` if *any* active deer in the herd is currently sleeping.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `OnUpdate(dt)`
*   **Description:** Main update loop. Handles spook detection, grazing/roaming state transitions, and periodic herd movement. Called automatically via `StartUpdatingComponent`.
*   **Parameters:**  
    `dt` (`number`) — time delta since last frame.
*   **Returns:** Nothing.

### `SetHerdAlertTarget(deer, target)`
*   **Description:** Registers a target entity for a specific deer. If the deer is in the herd, stores the mapping and may set `keepheading = true` if this is the first alert.
*   **Parameters:**  
    `deer` (`Entity`) — deer entity.  
    `target` (`Entity`) — alert target (e.g., player or predator).
*   **Returns:** Nothing.

### `GetClosestHerdAlertTarget(deer)`
*   **Description:** Returns the nearest alert target for a given deer, searching the `alerttargets` map.
*   **Parameters:**  
    `deer` (`Entity`) — deer entity.
*   **Returns:**  
    `target` (`Entity` or `nil`) — closest valid target, or `nil` if none.

### `HerdHasAlertTarget()`
*   **Description:** Returns whether *any* alert targets have been registered for the herd.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `IsAHerdAlertTarget(target)`
*   **Description:** Checks if the given entity is registered as an alert target for *any* deer.
*   **Parameters:**  
    `target` (`Entity`) — entity to check.
*   **Returns:** `boolean`.

### `OnSave()`
*   **Description:** Serializes critical state (location, timer, grazing status) for world saving.
*   **Parameters:** None.
*   **Returns:**  
    `data` (`table`) — map with `herdhomelocation`, `herdlocation`, `grazetimer`, `isgrazing`.

### `OnLoad(data)`
*   **Description:** Restores state from `OnSave` data during world load.
*   **Parameters:**  
    `data` (`table` or `nil`) — saved data from `OnSave`.
*   **Returns:** Nothing.

### `LoadPostPass(newents, data)`
*   **Description:** Finalizes post-load setup; assigns `herdspawner` to the global spawner if not already set.
*   **Parameters:**  
    `newents` (`table`) — entity map (unused here).  
    `data` (`table`) — load data (unused here).
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string (e.g., `"Roaming: 12.34 : 1, not spooked"`), useful for debugging UI or logs.
*   **Parameters:** None.
*   **Returns:** `string`.

### `SetValidAareaCheckFn(fn)`
*   **Description:** Sets a custom validation function for checking whether a potential movement point is valid (e.g., not in water or lava). Used by `FindWalkableOffset`.
*   **Parameters:**  
    `fn` (`function`) — function with signature `function(inst, x, y, z) return bool end`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly — uses `StartUpdatingComponent` to poll `OnUpdate(dt)`.  
- **Pushes:** None — does not dispatch custom events.
