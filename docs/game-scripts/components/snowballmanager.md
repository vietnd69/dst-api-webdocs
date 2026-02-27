---
id: snowballmanager
title: Snowballmanager
description: Manages the spawning, despawning, and density regulation of snowballs in the world during winter.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: fe680a1c
---

# Snowballmanager

## Overview
This component controls the dynamic generation and removal of snowball items in the world during winter. It enforces spatial density limits using a grid-based system, ensures snowballs only spawn on valid snow-covered terrain, and synchronizes snowball lifecycle with world weather and seasonal state (e.g., Winter's Feast). It operates exclusively on the server (master) simulation.

## Dependencies & Tags
- `TheWorld.ismastersim` — Asserted to ensure the component only exists on the master simulation.
- Components on the owner `inst` (typically `TheWorld`): None explicitly added by this script.
- Tags: None added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The owning entity (typically `TheWorld`). |
| `accumulator` | `number` | `0` | Time accumulator used to gate snowball spawn/despawn cycles. |
| `enabled` | `boolean` | `false` | Whether the snowball spawner is active. |
| `snowballs` | `table` | `{}` | Map of snowball entity references to grid indices. |
| `snowballscount` | `number` | `0` | Total count of registered snowballs. |
| `snowballgrid` | `DataGrid` | `nil` | Grid for tracking snowball density per region. |
| `issnowing` | `boolean` | `nil` | Latest world snowing state (set via `WatchWorldState`). |
| `issnowcovered` | `boolean` | `nil` | Latest world snow-covered state (set via `WatchWorldState`). |

## Main Functions

### `GetGridCoordsForSnowball(x, z)`
* **Description:** Computes the lower-left grid coordinate (grid-aligned origin) for a given world position, based on the configured region size.
* **Parameters:**
  - `x` (`number`): World X coordinate.
  - `z` (`number`): World Z coordinate.

### `UnregisterSnowball(snowball)`
* **Description:** Removes a snowball from management: decrements its grid cell density, clears tracking, and removes listeners/melting suppression.
* **Parameters:**
  - `snowball` (`Entity`): The snowball entity to unregister.

### `RegisterSnowball(snowball)`
* **Description:** Adds a snowball to management: increments its grid cell density, records its mapping, and suppresses its melting while in the world.
* **Parameters:**
  - `snowball` (`Entity`): The snowball entity to register.

### `NoSnowballTest(map, x, y, z)`
* **Description:** Validation function used to determine if a snowball may spawn at a location. Checks for land tile, absence of ground overlays, empty physics radius, and local snowball density threshold.
* **Parameters:**
  - `map` (`Map`): The world map instance.
  - `x`, `y`, `z` (`number`): World coordinates to test.

### `TryToCreateSnowballAtPoint(x, y, z, skipsnowballtest)`
* **Description:** Attempts to spawn a snowball at the specified point. Bypasses test if `skipsnowballtest` is true.
* **Parameters:**
  - `x`, `y`, `z` (`number`): Spawn coordinates.
  - `skipsnowballtest` (`boolean`): If true, skips the `NoSnowballTest`.

### `TryToCreateSnowballAnywhere()`
* **Description:** Finds a random valid location within ~50 units using `NoSnowballTest`, and attempts to spawn a snowball there.
* **Parameters:** None.

### `TryToCreateSnowballForEachPlayer()`
* **Description:** For each live player not on a platform, generates up to 10 randomly offset snowballs around them, clustering closer to the player.
* **Parameters:** None.

### `SetEnabled(enabled)`
* **Description:** Enables or disables the component’s spawner functionality, starting or stopping its update loop accordingly.
* **Parameters:**
  - `enabled` (`boolean`): Desired state.

### `TryToEnable()`
* **Description:** Conditionally enables the component if Winter's Feast is active and both snowing and snow-covered states are true.
* **Parameters:** None. Returns `true` if successfully enabled, otherwise `false`.

### `OnIsSnowing(issnowing)`
* **Description:** Updates the component’s `issnowing` state and attempts to enable/disable the spawner.
* **Parameters:**
  - `issnowing` (`boolean`): Current world snowing state.

### `OnIsSnowCovered(issnowcovered)`
* **Description:** Updates the component’s `issnowcovered` state and attempts to enable/disable the spawner.
* **Parameters:**
  - `issnowcovered` (`boolean`): Current world snow-covered state.

### `OnPostInit()`
* **Description:** Initializes `issnowing` and `issnowcovered` state based on the world at startup.

### `OnUpdate(dt)`
* **Description:** Main update loop. Handles either:
  - Despawning (when disabled): removes one snowball per `SNOWBALL_SECONDS_PER_DESPAWN` if not snow-covered.
  - Spawning (when enabled): spawns one snowball anywhere and one per player every `SNOWBALL_SECONDS_PER_SPAWN`.
* **Parameters:**
  - `dt` (`number`): Delta time since last frame.

### `OnSave()`
* **Description:** Returns serializable data for saving: a table of snowball GUIDs and an entities list.
* **Parameters:** None.

### `LoadPostPass(newents, savedata)`
* **Description:** Reloads registered snowballs from saved data during world load.
* **Parameters:**
  - `newents` (`table`): Map of GUID → `{entity}` from loaded entities.
  - `savedata` (`table`): Saved data, expected to contain `savedata.snowballs` array of GUIDs.

## Events & Listeners
- Listens to `worldmapsetsize` on `TheWorld` to initialize the snowball grid.
- Watches `issnowing` via `WatchWorldState("issnowing", ...)` and triggers `OnIsSnowing`.
- Watches `issnowcovered` via `WatchWorldState("issnowcovered", ...)` and triggers `OnIsSnowCovered`.
- For each registered snowball:
  - Listens to `"onremove"` and `"onputininventory"` to unregister the snowball.
  - Calls `UnregisterSnowball` on removal or inventory placement.
- Calls `inst:StartUpdatingComponent(self)` or `inst:StopUpdatingComponent(self)` as needed to manage `OnUpdate`.