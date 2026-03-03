---
id: messagebottlemanager
title: Messagebottlemanager
description: Manages message bottle treasure hunts and hermit crab interactions in DST's ocean world.
tags: [ocean, loot, quest, world, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 846684bb
system_scope: world
---

# Messagebottlemanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MessageBottleManager` is a world-level component that governs the spawning and tracking of message bottle treasure hunts. It ensures treasures spawn at valid locations far from players and obstacles, coordinates with the hermit crab quest, and maintains a registry of active treasure markers. It is only instantiated on the master simulation (server) and supports save/load for persistent state.

## Usage example
```lua
if TheWorld.components.messagebottlemanager ~= nil then
    TheWorld.components.messagebottlemanager:SetPlayerHasUsedABottle(inst)
    local pos, reason = TheWorld.components.messagebottlemanager:UseMessageBottle(bottle, inst, false)
    if pos then
        -- handle treasure spawn at pos
    end
end
```

## Dependencies & tags
**Components used:** `treasuremarked` (via `data.underwater_object.components.treasuremarked:TurnOn()`).  
**Tags:** None added or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GObject` | — | The entity instance the component is attached to (`TheWorld`). |
| `hermitcrab` | `GObject?` | `nil` | Reference to the hermit crab entity, set externally. |
| `hermit_has_been_found_by` | table | `{}` | Map of player user IDs who have found the hermit crab. |
| `active_treasure_hunt_markers` | table | `{}` | Map of active treasure marker entities (keys only, values `true`). |
| `player_has_used_a_bottle` | table | `{}` | Map of player user IDs who have used a message bottle. |

## Main functions
### `GetHermitCrab()`
* **Description:** Returns the current hermit crab entity if it exists and is valid; otherwise returns `nil`.
* **Parameters:** None.
* **Returns:** `GObject?` — Valid hermit crab instance or `nil`.

### `SetPlayerHasFoundHermit(player)`
* **Description:** Records that the given player has found the hermit crab.
* **Parameters:** `player` (`GObject`) — The player entity.
* **Returns:** Nothing.

### `GetPlayerHasFoundHermit(player)`
* **Description:** Checks whether the given player has previously found the hermit crab.
* **Parameters:** `player` (`GObject`) — The player entity.
* **Returns:** `boolean` — `true` if the player has found the hermit crab; otherwise `false`.

### `SetPlayerHasUsedABottle(player)`
* **Description:** Records that the given player has used a message bottle.
* **Parameters:** `player` (`GObject`) — The player entity.
* **Returns:** Nothing.

### `GetPlayerHasUsedABottle(player)`
* **Description:** Checks whether the given player has previously used a message bottle.
* **Parameters:** `player` (`GObject`) — The player entity.
* **Returns:** `boolean` — `true` if the player has used a message bottle; otherwise `false`.

### `UseMessageBottle(bottle, doer, is_not_from_hermit)`
* **Description:** Processes a message bottle use by either returning the hermit crab's position (if quest condition is met) or spawning a new treasure hunt marker at a valid ocean position.
* **Parameters:**  
  - `bottle` (`GObject`) — The message bottle prefab instance.  
  - `doer` (`GObject`) — The entity performing the action (typically a player).  
  - `is_not_from_hermit` (`boolean`) — If `true`, skips the hermit crab interaction branch.  
* **Returns:**  
  - On success: `Vector3`, `nil` (position of hermit crab or newly spawned treasure)  
  - On failure: `nil`, `string` (reason: `"NO_VALID_SPAWN_POINT_FOUND"` or `"STALE_ACTIVE_HUNT_REFERENCES"`)  
* **Error states:**  
  - If a spawn point cannot be found (e.g., map boundaries too constrained), returns `nil, "NO_VALID_SPAWN_POINT_FOUND"`.  
  - If all active hunt markers are stale/invalid, clears them and returns `nil, "STALE_ACTIVE_HUNT_REFERENCES"`.

## Events & listeners
- **Listens to:**  
  - `messagebottletreasure_marker_added` — Calls `OnMarkerAdded` to register a new marker in `active_treasure_hunt_markers`.  
  - `messagebottletreasure_marker_removed` — Calls `OnMarkerRemoved` to remove a stale marker.  
- **Pushes:** None (does not fire any custom events).

## Save / Load
- **`OnSave()`**: Returns a table containing `hermit_has_been_found_by` and `player_has_used_a_bottle` maps if non-empty.
- **`OnLoad(data)`**: Restores saved player state from the `data` table. Skips if `data` is `nil`.
