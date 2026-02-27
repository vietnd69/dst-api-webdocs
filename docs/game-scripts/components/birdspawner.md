---
id: birdspawner
title: Birdspawner
description: Manages the ambient spawning of birds and bird corpses near players based on world conditions like tile type, weather, and special events.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
source_hash: 98229fed
---

# Birdspawner

## Overview
The Birdspawner is a world-level component responsible for dynamically spawning birds and bird corpses in the environment around active players. It operates exclusively on the master simulation. The component adjusts its spawning behavior based on various factors, including the time of day, ground tile type, weather conditions (rain), and special events like Lunar Hail storms. During a Lunar Hail, it shifts from spawning live birds to dropping bird corpses, some of which may mutate.

## Dependencies & Tags
**Dependencies:**
- `timer`: The component uses timers to schedule spawn events and manage states related to Lunar Hail.

**Tags:**
- None identified.

## Properties
While this component does not have a formal `_ctor` function, its properties are initialized within the main class constructor.

| Property | Type   | Default Value | Description                                  |
|----------|--------|---------------|----------------------------------------------|
| `inst`   | entity | `inst`        | A reference to the entity instance this component is attached to. |

## Main Functions

### `OnPostInit()`
* **Description:** This is a lifecycle function called after the component and its entity are fully initialized. It synchronizes the spawner's state with the current world conditions (e.g., rain, lunar hail) and initiates the spawning loop.
* **Parameters:** None.

### `GetSpawnPoint(pt, is_corpse)`
* **Description:** Finds a valid spawn location in a circular area around a given point. The check ensures the point is on a passable tile, not inside a Wagstaff arena, and not near a `birdblocker`. It also checks for ground creep unless spawning a corpse.
* **Parameters:**
    * `pt` (vector3): The center point to search around.
    * `is_corpse` (boolean): If true, relaxes some spawning rules (e.g., allows spawning on ground creep).

### `SpawnBird(spawnpoint, ignorebait)`
* **Description:** Spawns a specific bird prefab at the given spawn point. The type of bird is determined by the tile type and other factors like nearby scarecrows. The bird may be attracted to nearby bait unless `ignorebait` is true.
* **Parameters:**
    * `spawnpoint` (vector3): The location where the bird will spawn.
    * `ignorebait` (boolean): If true, the bird will not be attracted to any nearby bait upon spawning.

### `SpawnBirdCorpse(spawnpoint)`
* **Description:** Spawns a `birdcorpse` prefab at the given location. The appearance of the corpse (e.g., crow, robin) is chosen based on the tile type. The corpse is spawned at a height of 15 units and enters its falling state.
* **Parameters:**
    * `spawnpoint` (vector3): The location where the corpse will spawn.

### `StartTracking(target)`
* **Description:** Begins tracking a bird entity, making it non-persistent. This allows the game to automatically remove the bird when it goes off-screen and is asleep, helping to manage entity counts.
* **Parameters:**
    * `target` (entity): The bird entity to start tracking.

### `StopTracking(target)`
* **Description:** Stops tracking a bird entity, restoring its original persistence value.
* **Parameters:**
    * `target` (entity): The bird entity to stop tracking.

### `SetBirdTypesForTile(tile_id, bird_list)`
* **Description:** A utility function primarily for modding. It allows overriding the list of bird prefabs that can spawn on a specific world tile.
* **Parameters:**
    * `tile_id` (number): The `WORLD_TILES` enum value for the tile.
    * `bird_list` (table): A list of bird prefab names (strings).

### `SetTimeScaleModifier(factor, key)`
* **Description:** A utility function for modding. Adds or updates a multiplier that affects the delay between bird spawns.
* **Parameters:**
    * `factor` (number): The multiplicative factor to apply.
    * `key` (string): A unique identifier for this modifier.

### `RemoveTimeScaleModifier(key)`
* **Description:** A utility function for modding. Removes a previously set time scale modifier.
* **Parameters:**
    * `key` (string): The unique identifier of the modifier to remove.

### `SpawnCorpseForPlayer(player)`
* **Description:** Immediately attempts to spawn a bird corpse near the specified player. This is used by external systems, such as Wickerbottom's "On Tentacles" book.
* **Parameters:**
    * `player` (entity): The player entity to spawn a corpse near.

### `GetPostHailEasingMult()`
* **Description:** Returns a multiplier from 0.0 to 1.0 that represents the progression of the post-lunar-hail recovery period. A value of 0 means the period has just started (high chance of mutated birds), while 1 means it has ended.
* **Parameters:** None.

## Events & Listeners
The component listens for several world-level and entity-specific events to manage its state.

*   **`islunarhailing` (World State):** Triggers `OnIsLunarHailing` to manage timers and sound levels related to the lunar hail bird event, and switches between spawning live birds and corpses.
*   **`israining` (World State):** Triggers `OnIsRaining` to apply a modifier that increases the bird spawn rate.
*   **`isnight` (World State):** Triggers `ToggleUpdate` to halt bird spawning during the night.
*   **`ms_playerjoined` (on TheWorld):** Adds the new player to the list of active players for whom birds should be spawned.
*   **`ms_playerleft` (on TheWorld):** Removes the departing player from the active list and cancels any scheduled spawns for them.
*   **`timerdone` (on TheWorld):** Handles the completion of internal timers, primarily used to trigger different phases of the Lunar Hail bird event (e.g., start sounds, drop corpses, restore normal ambient sounds).
*   **`entitysleep` (on tracked birds):** When a tracked bird falls asleep, this event triggers its removal to manage performance.