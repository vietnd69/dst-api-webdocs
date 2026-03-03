---
id: moonstorms
title: Moonstorms
description: Manages the active moonstorm zones and calculates moonstorm intensity for entities based on their position relative to node indices in the world topology.
tags: [environment, storm, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 6a8353bb
system_scope: world
---

# Moonstorms

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`moonstorms` is a server-only component that tracks and manages active moonstorm zones across the world using the map topology's node indices. It provides utilities for determining whether an entity is currently inside a moonstorm, calculating the storm's intensity at a given point, and managing visual map markers. It depends on the `areaaware` component to determine an entity's current node and position for intensity calculations. This component is restricted to the master simulation thread and should not exist on clients.

## Usage example
```lua
local moonstorms = TheWorld.components.moonstorms
moonstorms:AddMoonstormNodes({12, 13, 14}, 12)
local level = moonstorms:GetMoonstormLevel(ThePlayer)
if moonstorms:IsInMoonstorm(ThePlayer) then
    print("Player is inside a moonstorm with intensity: " .. level)
end
```

## Dependencies & tags
**Components used:** `areaaware` (accessed via `ent.components.areaaware`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | Reference to the entity instance that owns this component. |
| `_moonstorm_nodes` | `net_ushortarray` | empty array | Networked list of active moonstorm node indices (server-to-client sync). |
| `_active_moonstorm_nodes` | table | `{}` (local) | Local lookup table mapping active node indices to `true`. |
| `_mapmarkers` | table | `{}` (local) | List of active map marker prefabs spawned for visual feedback. |

## Main functions
### `CalcMoonstormLevel(ent)`
* **Description:** Calculates the normalized storm intensity at the entity's last known position, based on proximity to the nearest non-storm node edge. Used internally by `GetMoonstormLevel`.
* **Parameters:** `ent` (entity) – the entity whose depth in the storm is to be calculated.
* **Returns:** number – a non-negative float representing squared distance-based depth, scaled by `TUNING.SANDSTORM_FULLY_ENTERED_DEPTH`.
* **Error states:** Returns `0` if `ent` is `nil`, is in an ocean tile, or lacks the `areaaware` component.

### `CalcMoonstormLevel(ent)` (public entry point)
> Note: The public method uses the same name and is accessible via `self:CalcMoonstormLevel(ent)`.

### `GetMoonstormLevel(ent)`
* **Description:** Returns the normalized and clamped moonstorm intensity (`0` to `1`) for the entity if inside a storm; otherwise `0`.
* **Parameters:** `ent` (entity) – the entity to evaluate.
* **Returns:** number – `0` if not in a storm, otherwise a value between `0` and `1`, inclusive.
* **Error states:** None.

### `IsInMoonstorm(ent)`
* **Description:** Determines whether the given entity is currently inside an active moonstorm zone.
* **Parameters:** `ent` (entity) – the entity to check.
* **Returns:** boolean – `true` if the entity's current node (via `areaaware.current_area`) is active in `_active_moonstorm_nodes` and the entity has the `areaaware` component; otherwise `false`.

### `IsXZInMoonstorm(x, z)`
* **Description:** Determines whether the given world coordinates (`x`, `z`) are inside a moonstorm zone.
* **Parameters:**  
  - `x` (number) – world X coordinate.  
  - `z` (number) – world Z coordinate.  
* **Returns:** boolean – `true` if the node at (`x`, `z`) is in `_active_moonstorm_nodes`; otherwise `false`.

### `IsPointInMoonstorm(pt)`
* **Description:** Same as `IsXZInMoonstorm`, but accepts a point/table with `x` and `z` fields.
* **Parameters:** `pt` (table) – `{x = number, z = number}`.
* **Returns:** boolean – `true` or `false`.

### `AddMoonstormNodes(node_indices, firstnode)`
* **Description:** Activates the specified node indices as part of the current moonstorm, spawns map markers for visual feedback, and notifies the world of the storm change.
* **Parameters:**  
  - `node_indices` (number or table) – a single node index or a list of indices.  
  - `firstnode` (number) – unused in current implementation; originally intended for marker placement.  
* **Returns:** Nothing.
* **Behavior:** Converts the node list to a compact integer list using `convertlist`, updates `_moonstorm_nodes`, spawns `"moonstormmarker_big"` prefabs at each node’s center, and fires `ms_stormchanged` and `ms_moonstormwindowover` events.

### `StopMoonstorm(is_relocating)`
* **Description:** Terminates the current moonstorm by clearing all active nodes and notifying the world.
* **Parameters:** `is_relocating` (boolean) – passed as the `setting` field in the `ms_stormchanged` event.
* **Returns:** Nothing.

### `ClearMoonstormNodes()`
* **Description:** Resets internal state: clears `_active_moonstorm_nodes`, removes all map markers, and resets `_moonstorm_nodes` to an empty array.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetMoonstormNodes()`
* **Description:** Returns a reference to the local `_active_moonstorm_nodes` lookup table.
* **Parameters:** None.
* **Returns:** table – `{ [node_index] = true, ... }`.

### `GetMoonstormCenter()`
* **Description:** Computes and returns the centroid of all active moonstorm node locations.
* **Parameters:** None.
* **Returns:** `Point` (or `nil`) – if any nodes are active, returns `{x, y=0, z}`; otherwise `nil`.

## Events & listeners
- **Listens to:**  
  - `moonstorm_nodes_dirty` – relays the event with data to `TheWorld:PushEvent("moonstorm_nodes_dirty_relay", data)`.
- **Pushes:**  
  - `ms_stormchanged` – fired with `{stormtype=STORM_TYPES.MOONSTORM, setting=boolean}` on start/stop.  
  - `ms_moonstormwindowover` – fired on start of a new moonstorm.
