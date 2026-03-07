---
id: treasuremarked
title: Treasuremarked
description: Manages the visual marker (messagebottletreasure_marker) that appears above an entity when it holds or emits treasure messages.
tags: [treasure, marker, visual]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: c80d07f4
system_scope: entity
---

# Treasuremarked

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Treasuremarked` is a component that attaches an invisible marker entity (`messagebottletreasure_marker`) to its owner entity. This marker is used to indicate that the entity is associated with treasure-related messaging, such as being a message bottle or treasure source. It provides methods to show/hide the marker, and supports save/load serialization to persist marker state across sessions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("treasuremarked")
inst.components.treasuremarked:TurnOn()
-- Later, hide the marker:
inst.components.treasuremarked:TurnOff()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `marker` | `Entity` or `nil` | `nil` | Reference to the spawned `messagebottletreasure_marker` prefab instance. `nil` when marker is inactive or removed. |

## Main functions
### `TurnOn()`
*   **Description:** Spawns and attaches the `messagebottletreasure_marker` prefab to the owner entity. The marker becomes a visual indicator above the entity (typically used to signal treasure status).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if the marker is already spawned or if `SpawnPrefab` fails.

### `TurnOff()`
*   **Description:** Safely removes the marker entity if it exists and is valid.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `marker` is `nil` or invalid.

### `OnRemoveFromEntity()`
*   **Description:** Auto-invoked when the component is removed from its owner entity. Calls `TurnOff()` to clean up the marker.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Returns state data used for world save serialization. Indicates whether the marker is currently active.
*   **Parameters:** None.
*   **Returns:** `{ on = true }` if marker exists and is valid; otherwise `nil`.
*   **Error states:** Returns `nil` when no marker is active.

### `LoadPostPass(ents, data)`
*   **Description:** Restores marker state after world load. If saved data indicates the marker was on, `TurnOn()` is called to re-spawn the marker.
*   **Parameters:**  
    - `ents` (`table`) — List of loaded entities (unused by this method).  
    - `data` (`table?`) — Saved state data, expected to contain `{ on = true }` if marker was active.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None  
- **Pushes:** None
