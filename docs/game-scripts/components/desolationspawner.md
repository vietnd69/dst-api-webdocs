---
id: desolationspawner
title: Desolationspawner
description: This component manages the desolation regrowth mechanic, allowing certain natural resources to respawn over time in areas away from player activity.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# Desolationspawner

## Overview
The `Desolationspawner` component is a world-level system responsible for the "desolation regrowth" mechanic in Don't Starve Together. Its primary responsibility is to periodically check designated map areas and, if certain conditions are met (e.g., no existing resources of that type nearby, not near player structures), spawn natural resources like trees and plants to prevent areas far from players from becoming permanently barren. It leverages world density data and internal timers to manage this regrowth for various prefabs, adapting spawn rates based on world state (e.g., season, moon phase).

## Dependencies & Tags
This component explicitly relies on global `TheWorld` objects for state, map, and topology information. It requires the `map/terrain` module. `RoadManager` is also implicitly checked if available.

*   **Required Modules:** `map/terrain`
*   **Global Dependencies:** `TheWorld` (for `state`, `Map`, `topology`, `generated`), `TheSim`, `TUNING`, `ENTITY_POPOUT_RADIUS`
*   **Tags used for exclusion in spawn checks:** `structure`, `wall`
*   **Tags used for searching existing entities:** Configurable via `SetSpawningForType` (e.g., `evergreen`, `rock_tree`)

## Properties
No public properties were clearly identified from the source other than `self.inst`.
The component initializes several internal tables and constants that dictate its behavior:

| Property            | Type     | Default Value                                | Description                                                               |
| :------------------ | :------- | :------------------------------------------- | :------------------------------------------------------------------------ |
| `self.inst`         | `Entity` | (reference to owner)                         | A reference to the entity this component is attached to.                  |
| `UPDATE_PERIOD`     | `number` | `11`                                         | The frequency (in seconds) at which the component performs its update checks. |
| `SEARCH_RADIUS`     | `number` | `50`                                         | Radius for `FindEntities` to check if a resource type is already "seeded" nearby, preventing over-spawning. |
| `BASE_RADIUS`       | `number` | `20`                                         | Radius for `FindEntities` to check for player structures or walls, preventing spawns inside bases. |
| `EXCLUDE_RADIUS`    | `number` | `3`                                          | Radius for `FindEntities` to check for any existing entities, preventing spawns in overly dense areas. |
| `MIN_PLAYER_DISTANCE`| `number` | `ENTITY_POPOUT_RADIUS`                      | Minimum distance a player must be from a spawn point for regrowth to occur. (Currently commented out in `DoRegrowth`). |
| `SKIP_PLANT_CHECK`  | `table`  | `{["tree_rock_sapling"] = true}`             | A list of prefab types that will bypass the standard `_map:CanPlantAtPoint` and `_map:CanPlacePrefabFilteredAtPoint` checks. |
| `_worldstate`       | `table`  | `TheWorld.state`                             | A reference to the global `TheWorld.state` object for world information. |
| `_map`              | `table`  | `TheWorld.Map`                               | A reference to the global `TheWorld.Map` object for map queries.        |
| `_world`            | `table`  | `TheWorld`                                   | A reference to the global `TheWorld` object.                              |
| `_internaltimes`    | `table`  | `{}`                                         | Stores the elapsed time for each configured prefab type since the last regrowth attempt. |
| `_replacementdata`  | `table`  | `{}`                                         | Stores configuration data (product, regrowth time, search tags, time multiplier function) for each prefab type enabled for desolation spawning. |
| `_areadata`         | `table`  | `{}`                                         | Stores density and next regrowth time for each configured prefab per world area (topology node). |

## Main Functions

### `SetSpawningForType(prefab, product, regrowtime, searchtags, timemult)`
*   **Description:** Configures a specific prefab type for desolation regrowth. This function stores the necessary data for the component to manage regrowth for `prefab`, which will spawn `product` after `regrowtime`.
*   **Parameters:**
    *   `prefab`: (`string`) The original prefab name to track for regrowth.
    *   `product`: (`string`) The prefab name of the item to spawn (e.g., a sapling).
    *   `regrowtime`: (`number`) The base time (in seconds) it takes for this prefab to regrow.
    *   `searchtags`: (`table`) A table of tags used when searching for existing entities in `SEARCH_RADIUS` to avoid spawning if an entity with these tags is already present.
    *   `timemult`: (`function` or `nil`) An optional function that returns a time multiplier for `regrowtime`, allowing for season- or moon phase-dependent regrowth rates. If `nil`, a multiplier of `1` is used.

### `LongUpdate(dt)`
*   **Description:** This function is called periodically (based on `UPDATE_PERIOD`). It updates the internal timers for all configured prefab types, applying any time multipliers. It then iterates through world areas and attempts to trigger regrowth for any prefab whose timer has exceeded its `regrowtime` for that area. It only attempts one regrowth per `LongUpdate` call for performance reasons.
*   **Parameters:**
    *   `dt`: (`number`) The delta time since the last update.

### `OnSave()`
*   **Description:** Serializes the component's current state, specifically the `_areadata` (densities and remaining regrowth times) into a savable table. Regrowth times are adjusted relative to `_internaltimes` for consistent loading.
*   **Parameters:** None.

### `OnLoad(data)`
*   **Description:** Deserializes the component's state from save `data`. It reconstructs the `_areadata` table, adjusting loaded regrowth times by the current `_internaltimes` to resume progress accurately.
*   **Parameters:**
    *   `data`: (`table`) The table containing the saved component state.

### `GetDebugString()`
*   **Description:** Provides a string containing debug information, primarily showing the next predicted regrowth time for each configured prefab type.
*   **Parameters:** None.

### `TestForRegrow(x, y, z, prefab, searchtags)` (Private)
*   **Description:** A helper function that checks if a specific world point (`x, y, z`) is suitable for a given `prefab` to regrow. It performs checks for existing entities (too dense), proximity to player structures (`BASE_RADIUS`), presence of existing seeded entities (`SEARCH_RADIUS`), and valid ground for planting.
*   **Parameters:**
    *   `x`: (`number`) The X coordinate of the potential spawn point.
    *   `y`: (`number`) The Y coordinate of the potential spawn point.
    *   `z`: (`number`) The Z coordinate of the potential spawn point.
    *   `prefab`: (`string`) The prefab name to test for regrowth suitability.
    *   `searchtags`: (`table`) Tags used for `SEARCH_RADIUS` check.

### `DoRegrowth(area, prefab, product, searchtags)` (Private)
*   **Description:** Attempts to spawn the `product` prefab in a random valid point within the specified `area` (topology node). It first calls `TestForRegrow` to ensure the location is suitable. If successful, it spawns the prefab and places it at the determined position.
*   **Parameters:**
    *   `area`: (`number`) The ID of the world topology node (area) to spawn within.
    *   `prefab`: (`string`) The original prefab type being regrown.
    *   `product`: (`string`) The actual prefab name to spawn.
    *   `searchtags`: (`table`) Tags passed to `TestForRegrow`.

### `PopulateAreaData(prefab)` (Private)
*   **Description:** Initializes the `_areadata` for a given `prefab`. It iterates through the world's generated densities, finding areas where this `prefab` naturally occurred and setting up its initial regrowth timer.
*   **Parameters:**
    *   `prefab`: (`string`) The prefab name for which to populate area data.

### `PopulateAreaDataFromReplacements()` (Private)
*   **Description:** Iterates through all prefabs configured in `_replacementdata` and calls `PopulateAreaData` for each, ensuring that regrowth data is set up for all desired resource types. This is typically called shortly after world startup.
*   **Parameters:** None.