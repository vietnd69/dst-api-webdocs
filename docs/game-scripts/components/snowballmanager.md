---
id: snowballmanager
title: Snowballmanager
description: Manages snowball spawn, despawn, and density distribution in the world during winter events.
tags: [environment, winter, world]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: fe680a1c
system_scope: world
---
# Snowballmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SnowballManager` is a server-side component responsible for dynamically managing the spawn and despawn of `snowball_item` prefabs in the world. It enforces density limits using a spatial grid, ensures snowballs only spawn under appropriate conditions (e.g., during Winter's Feast and while snowing/snow-covered), and coordinates melting behavior via the `snowballmelting` component. It only exists on the mastersim and does not run on clients.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("snowballmanager")
inst.components.snowballmanager:SetEnabled(true)
-- Snowballs will spawn/despawn automatically based on world state and tuning values
```

## Dependencies & tags
**Components used:** `snowballmelting` (via external reference)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `accumulator` | number | `0` | Accumulates time elapsed between spawn/despawn checks. |
| `enabled` | boolean | `false` | Whether the manager is actively spawning snowballs. |
| `snowballs` | table | `{}` | Maps snowball entities to their grid index. |
| `snowballscount` | number | `0` | Total count of registered snowballs. |
| `snowballgrid` | DataGrid | `nil` | Spatial grid for tracking snowball density per region. |

## Main functions
### `SetEnabled(enabled)`
*   **Description:** Enables or disables snowball management. When enabled, the component begins updating and spawning snowballs; when disabled, it begins despawning.
*   **Parameters:** `enabled` (boolean) — target state.
*   **Returns:** `enabled` (boolean) — the resulting state.
*   **Error states:** Calls `StartUpdatingComponent`/`StopUpdatingComponent` appropriately.

### `TryToEnable()`
*   **Description:** Attempts to enable snowball management only if Winter's Feast is active and both `issnowing` and `issnowcovered` world states are true.
*   **Parameters:** None.
*   **Returns:** `true` if successfully enabled, `false` otherwise.

### `RegisterSnowball(snowball)`
*   **Description:** Registers a snowball entity for tracking, updates the spatial grid's density count, and stops its melting behavior.
*   **Parameters:** `snowball` (Entity) — the snowball entity to register.
*   **Returns:** Nothing.
*   **Error states:** Registers `onremove` and `onputininventory` callbacks to automatically unregister later.

### `UnregisterSnowball(snowball)`
*   **Description:** Unregisters a snowball entity, decrements its grid's density count, and allows melting to resume. Removes event callbacks.
*   **Parameters:** `snowball` (Entity) — the snowball entity to unregister.
*   **Returns:** Nothing.
*   **Error states:** Safely cancels callbacks and handles invalid entities.

### `NoSnowballTest(map, x, y, z)`
*   **Description:** Validation function used to determine if a snowball can be placed at a given point. Checks land tile, absence of ground overlays, no overlapping physics, and grid density limits.
*   **Parameters:** 
  - `map` (WorldMap) — world map instance.
  - `x`, `y`, `z` (numbers) — world coordinates.
*   **Returns:** `true` if placement is valid, `false` otherwise.

### `TryToCreateSnowballAtPoint(x, y, z, skipsnowballtest)`
*   **Description:** Attempts to spawn a snowball at a specific point, optionally bypassing the placement test.
*   **Parameters:** 
  - `x`, `y`, `z` (numbers) — spawn coordinates.
  - `skipsnowballtest` (boolean?) — if truthy, skips `NoSnowballTest`.
*   **Returns:** `true` if a snowball was spawned, `false` otherwise.

### `TryToCreateSnowballAnywhere()`
*   **Description:** Attempts to find and spawn a snowball at a random location satisfying `NoSnowballTest`.
*   **Parameters:** None.
*   **Returns:** `true` if successful, `false` otherwise.

### `TryToCreateSnowballForEachPlayer()`
*   **Description:** Spawns up to 10 snowballs near each player who is not standing on a platform, using a biased distribution (closer to the player).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Drives spawn/despawn logic based on `accumulator` and game state. When enabled, spawns periodically; when disabled, deserializes and removes snowballs one at a time if snow is not covered.
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes snowball entity GUIDs for world save.
*   **Parameters:** None.
*   **Returns:** `{snowballs = {guid1, guid2, ...}}, {guid1, guid2, ...}` on success; `nil` if none.

### `LoadPostPass(newents, savedata)`
*   **Description:** Re-registers snowball entities after loading from save.
*   **Parameters:** 
  - `newents` (table) — map of GUID to entity.
  - `savedata` (table) — saved component data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  - `worldmapsetsize` (via `_world`) — initializes the spatial grid.
  - `onremove` — registered per snowball to auto-unregister.
  - `onputininventory` — registered per snowball to auto-unregister.
- **World state watches:** 
  - `issnowing` — triggers `OnIsSnowing`.
  - `issnowcovered` — triggers `OnIsSnowCovered`.
- **Pushes:** None.

