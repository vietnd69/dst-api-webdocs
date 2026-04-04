---
id: beefaloherd
title: Beefaloherd
description: Manages beefalo herd behavior, mating seasons, and baby beefalo spawning.
tags: [herd, spawning, season, ai]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e989e761
system_scope: entity
---

# Beefaloherd

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`beefaloherd` is a prefab entity that acts as a manager for a group of beefalo. It coordinates the `herd`, `mood`, and `periodicspawner` components to handle herd membership, mating seasons, and the spawning of baby beefalo. This entity is typically invisible and non-interactive, serving as a logical anchor for herd mechanics in the world.

## Usage example
```lua
-- Spawn the herd manager entity
local herd = SpawnPrefab("beefaloherd")

-- Access configured components
local herd_comp = herd.components.herd
local mood_comp = herd.components.mood
local spawner_comp = herd.components.periodicspawner

-- Check if herd is full
if herd_comp:IsFull() then
    print("Herd is at max capacity")
end
```

## Dependencies & tags
**Components used:** `herd`, `mood`, `periodicspawner`, `domesticatable`, `rideable`, `transform`
**Tags:** Adds `herd`, `NOBLOCK`, `NOCLICK` to self. Sets member tags to `beefalo` or `beefalo_migratory`. Checks `baby`, `HasCarrat`, `herdmember`.

## Properties
No public properties

## Main functions
The following local functions are assigned as callbacks to components to define herd behavior.

### `CanSpawn(inst)`
*   **Description:** Determines if a new baby beefalo can be spawned based on herd capacity and range density.
*   **Parameters:** `inst` (entity) - The herd manager entity.
*   **Returns:** `boolean` - `true` if spawning is allowed, `false` otherwise.
*   **Error states:** Returns `false` if the herd is full or no valid parent beefalo is found.

### `OnSpawned(inst, newent)`
*   **Description:** Callback executed when a baby beefalo is spawned. Adds the new entity to the herd and positions it near a valid parent.
*   **Parameters:** `inst` (entity) - The herd manager entity. `newent` (entity) - The spawned baby beefalo.
*   **Returns:** Nothing.

### `InMood(inst)`
*   **Description:** Called when the herd enters mating mood. Starts the periodic spawner and notifies members.
*   **Parameters:** `inst` (entity) - The herd manager entity.
*   **Returns:** Nothing.

### `LeaveMood(inst)`
*   **Description:** Called when the herd leaves mating mood. Stops the periodic spawner and notifies members.
*   **Parameters:** `inst` (entity) - The herd manager entity.
*   **Returns:** Nothing.

### `AddMember(inst, member)`
*   **Description:** Callback executed when a new beefalo joins the herd. Syncs the member's mood state with the herd.
*   **Parameters:** `inst` (entity) - The herd manager entity. `member` (entity) - The joining beefalo.
*   **Returns:** Nothing.

### `SpawnableParent(inst)`
*   **Description:** Iterates through herd members to find a beefalo that is not domesticated and not being ridden.
*   **Parameters:** `inst` (entity) - The herd manager entity.
*   **Returns:** `entity` or `nil` - A valid beefalo entity for spawning, or `nil` if none found.

### `spawncarrat(inst, phase)`
*   **Description:** Special logic for the Year of the Carrat event. Spawns carrat attributes on beefalo during night phase.
*   **Parameters:** `inst` (entity) - The herd manager entity. `phase` (string) - The current world phase (e.g., `night`).
*   **Returns:** Nothing.
*   **Error states:** Only executes if `SPECIAL_EVENTS.YOTC` is active.

## Events & listeners
-   **Listens to:** `phasechanged` (on `TheWorld`) - Triggers `spawncarrat` logic during the Year of the Carrat event.
-   **Pushes:** `entermood` - Fired to herd members when mating season starts.
-   **Pushes:** `leavemood` - Fired to herd members when mating season ends.