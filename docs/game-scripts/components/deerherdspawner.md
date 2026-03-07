---
id: deerherdspawner
title: Deerherdspawner
description: Manages seasonal spawning, migration, and population control of deer herds in the world.
tags: [ecology, ai, seasonal, population]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9699abe3
system_scope: world
---

# Deerherdspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Deerherdspawner` is a world-scoped component responsible for orchestrating deer herd behavior across seasons. It spawns new herds in autumn, tracks active deer, and migrates them in winter. It relies on the `deerherding` component to record the herd's central location and uses `knownlocations` to store relative positions for each deer. This component only exists on the master simulation and coordinates spawning logic, timing, and persistence.

## Usage example
```lua
-- Typically added to a world-level prefab (e.g., world spawner)
inst:AddComponent("deerherdspawner")

-- Debug trigger (for testing)
inst.components.deerherdspawner:DebugSummonHerd(5) -- summon herd in 5 seconds
```

## Dependencies & tags
**Components used:** `deerherding`, `knownlocations`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this component is attached to. |

*Note: Internal state variables (e.g., `_spawners`, `_activedeer`, `_timetospawn`, etc.) are not part of the public API and should not be accessed directly.*

## Main functions
### `SpawnDeer(pos, center)`
*   **Description:** Spawns a single `deer` prefab at the specified world position and records its relative offset from the herd center using `knownlocations`.
*   **Parameters:**
    *   `pos` (`Vector3`) – World position to place the deer.
    *   `center` (`Vector3`) – Reference point used to calculate and store the deer's offset.
*   **Returns:** Nothing.
*   **Error states:** If `SpawnPrefab("deer")` fails, no deer is spawned and no error is raised.

### `GetDeer()`
*   **Description:** Returns the internal table of currently active deer entities.
*   **Parameters:** None.
*   **Returns:** `table` – A dictionary mapping deer entities to `true`. Only contains valid deer still in the world.

### `OnUpdate(dt)`
*   **Description:** Handles countdown timers for herd summoning and migration. Called via `LongUpdate` during simulation.
*   **Parameters:**
    *   `dt` (`number`) – Time elapsed since last update in seconds.
*   **Returns:** Nothing.
*   **Error states:** Stops updating when no timers are active (`_timetospawn == nil` and `_timetomigrate == nil`).

### `DebugSummonHerd(time)`
*   **Description:** Forces immediate preparation for a herd summon after `time` seconds, bypassing seasonal/timer logic.
*   **Parameters:**
    *   `time` (`number`, optional) – Delay in seconds before summoning. Defaults to `1`.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes timer and active deer state for world persistence.
*   **Parameters:** None.
*   **Returns:** `table` – Save data containing `_timetospawn`, `_prevherdsummonday`, `_timetomigrate`, and `_activedeer` (as GUIDs).
    *   Second return value: list of GUIDs (also included in first return), likely for legacy sync or save format reasons.

### `OnLoad(data)`
*   **Description:** Restores timer state from saved world data.
*   **Parameters:**
    *   `data` (`table`, optional) – Saved component state. May include `_timetospawn`, `_prevherdsummonday`, `_timetomigrate`, and deprecated `_lastherdsummonday`.
*   **Returns:** Nothing.

### `LoadPostPass(newents, data)`
*   **Description:** Reconnects saved deer entities after world load completes and resumes updates if needed.
*   **Parameters:**
    *   `newents` (`table`) – Mapping of GUIDs to loaded entities.
    *   `data` (`table`, optional) – Loaded component data containing `_activedeer` GUIDs.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable status string for debugging tools.
*   **Parameters:** None.
*   **Returns:** `string` – Describes current phase (dormant, summoning, migrated, migrating) with timing or deer count.

## Events & listeners
- **Listens to:**  
    `ms_registerdeerspawningground` – Fired by spawning ground entities to register themselves. Triggers `OnRegisterDeerSpawningGround`.
- **Pushes:**  
    None. The component does not fire custom events.

## Notes
- The component is restricted to the master simulation (`TheWorld.ismastersim`), and will assert on the client.
- Seasonal scheduling uses `TheWorld.state.isautumn`, `TheWorld.state.iswinter`, and `TheWorld.state.cycles`.
- Deer herd size is randomized using `HERD_SPAWN_SIZE (5)` and `HERD_SPAWN_SIZE_VARIANCE (1)`, capped by `HERD_OVERPOPULATION_SIZE`.
- Offscreen spawn positions are determined via `FindWalkableOffset` with fallbacks to avoid water or walls.
- Migrated deer receive the `"queuegrowantler"` and `"deerherdmigration"` events.
