---
id: messagebottlemanager
title: Messagebottlemanager
description: Manages the spawning of message bottle treasures and tracks player interactions with hermit crabs and bottles in the DST world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 846684bb
---

# Messagebottlemanager

## Overview
The `MessageBottleManager` component is responsible for managing treasure hunts initiated via message bottles. It handles the logic for generating valid spawn positions for treasures, tracking active treasure hunt markers, recording which players have found the hermit crab or used a bottle, and supporting save/load persistence. It exists only on the master simulation and is attached to the world entity.

## Dependencies & Tags
- `TheWorld.ismastersim`: Requires the component to be created only on the master side (client instances are explicitly prevented).
- `inst:ListenForEvent("messagebottletreasure_marker_added", ...)`
- `inst:ListenForEvent("messagebottletreasure_marker_removed", ...)`
- Relies on external modules:
  - `messagebottletreasures` (for treasure generation)
  - Global utilities: `FindSwimmableOffset`, `IsPointCoveredByBlocker`, `TheSim:CountEntities`, `TUNING.MAX_ACTIVE_TREASURE_HUNTS`, `AllPlayers`, `GetTableSize`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The world entity the component is attached to. |
| `hermitcrab` | `Entity?` | `nil` | Reference to the active hermit crab (set externally), used to reveal its location under specific conditions. |
| `hermit_has_been_found_by` | `table` | `{}` | Dictionary mapping player `userid` to `true`, tracking who has found the hermit crab. |
| `active_treasure_hunt_markers` | `table` | `{}` | Dictionary mapping valid marker entities to `true`, representing ongoing treasure hunts. |
| `player_has_used_a_bottle` | `table` | `{}` | Dictionary mapping player `userid` to `true`, tracking who has used a message bottle. |
| *(Private)* `treasure_spawn_positions` | `table?` | `nil` | Cached array of spawn points along map boundaries, initialized on first use. |

## Main Functions

### `GetHermitCrab()`
* **Description:** Returns the current hermit crab entity if it exists and is valid; otherwise returns `nil`.
* **Parameters:** None.

### `SetPlayerHasFoundHermit(player)`
* **Description:** Records that a given player has successfully found the hermit crab.
* **Parameters:**  
  - `player` (`PlayerEntity`): The player who found the hermit crab.

### `GetPlayerHasFoundHermit(player)`
* **Description:** Checks whether a given player has previously found the hermit crab.
* **Parameters:**  
  - `player` (`PlayerEntity`): The player to check.

### `SetPlayerHasUsedABottle(player)`
* **Description:** Records that a given player has used a message bottle.
* **Parameters:**  
  - `player` (`PlayerEntity`): The player who used the bottle.

### `GetPlayerHasUsedABottle(player)`
* **Description:** Checks whether a given player has previously used a message bottle.
* **Parameters:**  
  - `player` (`PlayerEntity`): The player to check.

### `UseMessageBottle(bottle, doer, is_not_from_hermit)`
* **Description:** Handles the core logic for using a message bottle. If invoked by the hermit crab and the player hasn’t found it yet, returns the hermit crab’s position. Otherwise, attempts to spawn a new treasure or reuse an existing active hunt if the maximum active hunts limit is reached.
* **Parameters:**  
  - `bottle` (`Entity`): The message bottle entity being used.  
  - `doer` (`PlayerEntity`): The player initiating the action.  
  - `is_not_from_hermit` (`boolean`): Flag indicating whether the action originated from the hermit crab itself.

  **Returns:**  
  - `pos` (`Vector3?`): Spawn position of the new treasure or location of an existing active hunt; may be `nil` on failure.  
  - `reason` (`string?`): Reason for failure, e.g., `"NO_VALID_SPAWN_POINT_FOUND"`, `"STALE_ACTIVE_HUNT_REFERENCES"`, or `nil`.

### `OnSave()`
* **Description:** Serializes persistent state for the hermit crab findings and bottle usage records.
* **Parameters:** None.  
  **Returns:** `data` (`table`) — A table containing optional keys `hermit_has_been_found_by` and `player_has_used_a_bottle`.

### `OnLoad(data)`
* **Description:** Restores state after loading from save data, populating the tracking tables.
* **Parameters:**  
  - `data` (`table?`): Deserialized data from `OnSave()`.

## Events & Listeners
- Listens for `messagebottletreasure_marker_added` → triggers `OnMarkerAdded`
- Listens for `messagebottletreasure_marker_removed` → triggers `OnMarkerRemoved`
- `AddMinimapMarker` is attached as a one-time callback on `on_submerge` events of new treasures to enable minimap visibility.