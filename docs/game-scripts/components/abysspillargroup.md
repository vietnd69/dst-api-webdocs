---
id: abysspillargroup
title: Abysspillargroup
description: Manages spawning, tracking, collapsing, and persistence of a group of pillar entities attached to a parent entity.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# abysspillargroup

## Overview
The `abysspillargroup` component is responsible for managing a collection of "pillar" entities associated with a parent entity. It provides functionality to spawn, track, collapse, and persist these pillars, acting as a centralized manager for a group of dynamic environmental objects. It allows for custom functions to define how pillars are spawned and collapsed, and provides callbacks for when pillars are added or removed from its tracking list.

## Dependencies & Tags
None identified. This component primarily interacts with the `Entity` instances it manages and relies on the entity's standard "onremove" event.

## Properties
| Property                 | Type      | Default Value | Description                                                                                                                                                                    |
| :----------------------- | :-------- | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `self.inst`              | `Entity`  | -             | A reference to the entity that owns this component.                                                                                                                            |
| `self.spawnfn`           | `Function`| `nil`         | A user-defined function `(parent_inst, x, z, instant)` called when a new pillar needs to be spawned. Expected to return the newly created pillar `Entity`.                   |
| `self.collapsefn`        | `Function`| `nil`         | A user-defined function `(parent_inst, pillar)` called when a tracked pillar needs to be collapsed.                                                                            |
| `self.onaddpillarfn`     | `Function`| `nil`         | A user-defined function `(parent_inst, pillar)` called whenever a pillar is added to the group's tracking list (either newly spawned or loaded from save).                  |
| `self.onremovepillarfn`  | `Function`| `nil`         | A user-defined function `(parent_inst, pillar)` called whenever a pillar is removed from the group's tracking list (e.g., when it collapses or is untracked manually).        |
| `self.pillars`           | `Table`   | `{}`          | A table used as a set to track all currently active pillar entities managed by this group. Keys are the pillar entities, values are `true`.                                  |
| `self.spawnpts`          | `Table`   | `{}`          | A flattened list of X and Z coordinates `[x1, z1, x2, z2, ...]` representing locations where pillars should be spawned or have previously existed, used for `RespawnAllPillars`. |
| `self._onpillarcollapsed`| `Function`| -             | An internal callback function (`pillar`) assigned during construction, triggered when a tracked pillar is removed (destroyed). It handles untracking the pillar.               |

## Main Functions
### `SetSpawnAtXZFn(fn)`
*   **Description:** Sets the function that will be called to spawn new pillar entities. This function should create and return a pillar entity at the given coordinates.
*   **Parameters:**
    *   `fn`: (`Function`) A function with the signature `function(parent_inst, x, z, instant)` that returns the spawned pillar `Entity`.

### `SetCollapseFn(fn)`
*   **Description:** Sets the function that will be called to collapse (or destroy) existing pillar entities.
*   **Parameters:**
    *   `fn`: (`Function`) A function with the signature `function(parent_inst, pillar)` that handles the collapsing logic for the given `pillar`.

### `SetOnAddPillarFn(fn)`
*   **Description:** Sets a callback function to be invoked when a pillar is added to the tracking list of this group.
*   **Parameters:**
    *   `fn`: (`Function`) A function with the signature `function(parent_inst, pillar)`.

### `SetOnRemovePillarFn(fn)`
*   **Description:** Sets a callback function to be invoked when a pillar is removed from the tracking list of this group.
*   **Parameters:**
    *   `fn`: (`Function`) A function with the signature `function(parent_inst, pillar)`.

### `StartTrackingPillar(pillar)`
*   **Description:** Begins tracking a given pillar entity. This marks the pillar as part of this group, attaches an internal reference (`_abysspillargroup`), and sets up event listeners for its removal. If an `onaddpillarfn` is set, it will be called.
*   **Parameters:**
    *   `pillar`: (`Entity`) The pillar entity to start tracking.

### `StopTrackingPillar(pillar)`
*   **Description:** Stops tracking a given pillar entity. This removes the internal reference, detaches event listeners, and removes it from the `self.pillars` table. If an `onremovepillarfn` is set, it will be called.
*   **Parameters:**
    *   `pillar`: (`Entity`) The pillar entity to stop tracking.

### `SpawnPillarAtXZ(x, z, instant)`
*   **Description:** Calls the `spawnfn` to create a new pillar at the specified coordinates and immediately starts tracking it.
*   **Parameters:**
    *   `x`: (`Number`) The X-coordinate for the new pillar.
    *   `z`: (`Number`) The Z-coordinate for the new pillar.
    *   `instant`: (`Boolean`, optional) An optional parameter passed directly to the `spawnfn`, often used to control spawn animations or instant creation.

### `AddPillarSpawnPointXZ(x, z)`
*   **Description:** Adds the given X and Z coordinates to the `self.spawnpts` list, which can later be used to respawn pillars.
*   **Parameters:**
    *   `x`: (`Number`) The X-coordinate to add.
    *   `z`: (`Number`) The Z-coordinate to add.

### `RespawnAllPillars()`
*   **Description:** Iterates through all stored spawn points in `self.spawnpts`, spawning a new pillar at each location using `SpawnPillarAtXZ`, and then clears the `self.spawnpts` list.
*   **Parameters:** None.

### `CollapseAllPillars()`
*   **Description:** Iterates through all currently tracked pillars in `self.pillars` and calls the `collapsefn` for each one.
*   **Parameters:** None.

### `Clear()`
*   **Description:** Clears all stored spawn points and stops tracking all currently managed pillars. It also removes the pillar entities from the world.
*   **Parameters:** None.

### `HasPillars()`
*   **Description:** Checks if there are any pillars currently being tracked by this component.
*   **Parameters:** None.
*   **Returns:** (`Boolean`) `true` if any pillars are tracked, `false` otherwise.

### `HasSpawnPoints()`
*   **Description:** Checks if there are any pillar spawn points stored in `self.spawnpts`.
*   **Parameters:** None.
*   **Returns:** (`Boolean`) `true` if any spawn points exist, `false` otherwise.

### `OnSave()`
*   **Description:** Gathers data for persistence. It saves the `self.spawnpts` and the GUIDs of all currently tracked pillars.
*   **Parameters:** None.
*   **Returns:**
    *   `data`: (`Table`) A table containing `pts` (the spawn points) and `ents` (a list of pillar GUIDs) if any data exists, otherwise `nil`.
    *   `refs`: (`Table`) A table of pillar GUIDs, used by the game's persistence system to resolve entity references.

### `OnLoad(data)`
*   **Description:** Loads saved spawn points for the component.
*   **Parameters:**
    *   `data`: (`Table`) A table containing `pts` (saved spawn points).

### `LoadPostPass(ents, data)`
*   **Description:** After entities have been loaded, this function resolves the GUIDs of previously tracked pillars to their actual entity references and starts tracking them again.
*   **Parameters:**
    *   `ents`: (`Table`) A mapping from GUIDs to loaded entity references (possibly wrappers).
    *   `data`: (`Table`) The full saved data for this component, expected to contain `ents` (a list of pillar GUIDs).

## Events & Listeners
*   Listens for `inst:ListenForEvent("onremove", self._onpillarcollapsed, pillar)` on each tracked pillar entity.
    *   **Description:** When a tracked `pillar` entity is removed from the world (e.g., destroyed, despawned), the `self._onpillarcollapsed` function is invoked. This function then untracks the pillar, adds its last known world position to `self.spawnpts` for potential future respawning, and triggers the `onremovepillarfn` callback if set.