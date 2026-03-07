---
id: ghostbabysitter
title: Ghostbabysitter
description: Manages the tracking and lifecycle of ghosts being watched over by an entity, handling state tags and persistence.
tags: [ghost, persistence, entity_state, network_sync]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e3f27c81
system_scope: entity
---

# Ghostbabysitter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Ghostbabysitter` tracks which ghosts an entity is currently "babysitting"—i.e., monitoring or managing. It maintains a simple dictionary of ghost references, adds/removes the `inactive` and `activatable_forceright` tags on the owner entity based on babysitting state, and ensures proper persistence across saves/loads. The component also supports optional per-frame updates via an optional `updatefn` callback, which is invoked during `OnUpdate` while babysitting at least one ghost.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("ghostbabysitter")

local ghost = GetSomeGhostInstance()
inst.components.ghostbabysitter:AddGhost(ghost)

-- Optional: set a custom update function
inst.components.ghostbabysitter.updatefn = function(owner, babysitter, dt)
    -- custom logic here
end

-- Later, stop babysitting
inst.components.ghostbabysitter:RemoveGhost(ghost)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds/removes `inactive` and `activatable_forceright` on the owning entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *assigned in constructor* | Reference to the entity that owns this component. |
| `inactive` | boolean | `true` | Indicates whether the component is currently inactive (i.e., not babysitting any ghosts). |
| `forcerightclickaction` | boolean | `false` | Controls whether `activatable_forceright` tag is applied. |
| `babysitting` | table | `{}` | Dictionary mapping ghost entity references to `true`. |
| `updatefn` | function | `nil` | Optional callback `(owner, self, dt) => void`, invoked each frame while `babysitting` is non-empty. |

## Main functions
### `AddGhost(ghost)`
*   **Description:** Begins babysitting the specified ghost, adding it to the internal tracking table and starting the component's update loop on the entity.
*   **Parameters:** `ghost` (Entity) — the ghost entity to track.
*   **Returns:** Nothing.

### `RemoveGhost(ghost)`
*   **Description:** Stops babysitting the ghost and removes it from tracking. If no ghosts remain, stops the update loop.
*   **Parameters:** `ghost` (Entity) — the ghost entity to stop tracking.
*   **Returns:** Nothing.

### `IsBabysittingGhost(ghost)`
*   **Description:** Checks whether the given ghost is currently being babysat.
*   **Parameters:** `ghost` (Entity) — the ghost to check.
*   **Returns:** `true` if `ghost` is in `babysitting`; otherwise `nil`.
*   **Error states:** Returns `nil` if the ghost is not being babysat.

### `OnUpdate(dt)`
*   **Description:** Called each frame while the component is active (i.e., while `babysitting` is non-empty). Invokes `updatefn` if set.
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.
*   **Error states:** No effect if `updatefn` is `nil`.

### `OnSave()`
*   **Description:** Serializes the component's state for saving.
*   **Parameters:** None.
*   **Returns:** `data` (table), `ents` (table of GUIDs) — `data.babysitting` contains a list of GUIDs of babysat ghosts; `ents` contains the same list for dependency resolution.

### `LoadPostPass(newents, savedata)`
*   **Description:** Restores ghost references after loading is complete. Notifies each ghost that it is being babysat.
*   **Parameters:**  
    `newents` (table) — map of GUID → entity for all loaded entities;  
    `savedata` (table) — data from `OnSave`, including `babysitting` list of GUIDs.
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Cleanup handler called when component is removed from its entity. Ensures all tracking tags are removed.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a simple debug representation of the component’s `inactive` state.
*   **Parameters:** None.
*   **Returns:** string — `"true"` or `"false"`.

## Events & listeners
- **Listens to:** *None*  
- **Pushes:** `set_babysitter` — fired on each ghost entity when it is assigned a babysitter during `LoadPostPass`.
