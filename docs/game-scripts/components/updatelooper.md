---
id: updatelooper
title: Updatelooper
description: Manages multiple per-frame, long-interval, wall-logic, and post-update callbacks for an entity.
tags: [update, loop, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ac6e7164
system_scope: entity
---

# Updatelooper

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`UpdateLooper` provides a flexible mechanism for attaching multiple update callbacks to an entity at different update phases: per-frame (`OnUpdate`), long-interval (`LongUpdate`), wall-logic (`OnWallUpdate`), and post-update (`PostUpdate`). It exists because `DoPeriodicTask(0)` does not guarantee frame-precise execution. Each entity that uses this component can register arbitrary functions to be called at these phases, and the component intelligently starts/stops entity updates only when needed.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("updatelooper")

-- Register per-frame callbacks
inst.components.updatelooper:AddOnUpdateFn(function(ent, dt)
    -- runs every frame
end)

-- Register long-interval callbacks
inst.components.updatelooper:AddLongUpdateFn(function(ent, dt)
    -- runs less frequently (e.g., every 0.5 seconds via engine)
end)

-- Register post-update callbacks
inst.components.updatelooper:AddPostUpdateFn(function(ent)
    -- runs after all per-frame updates are complete
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags; relies on internal update registration via `StartUpdatingComponent`, `StartWallUpdatingComponent`, and `_PostUpdates` registry.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set in constructor) | The entity instance this component is attached to. |
| `onupdatefns` | `table` | `{}` | List of per-frame callback functions. |
| `longupdatefns` | `table` | `{}` | List of long-interval callback functions. |
| `onwallupdatefns` | `table` | `{}` | List of wall-update callback functions. |
| `postupdatefns` | `table` | `{}` | List of post-update callback functions. |
| `OnUpdatesToRemove` | `table?` | `nil` | Temporary list of functions pending removal during per-frame update. |
| `OnLongUpdatesToRemove` | `table?` | `nil` | Temporary list of functions pending removal during long update. |
| `OnWallUpdatesToRemove` | `table?` | `nil` | Temporary list of functions pending removal during wall update. |

## Main functions
### `AddOnUpdateFn(fn)`
*   **Description:** Registers a per-frame callback to be called on every entity update. Automatically starts per-frame updates if none were registered.
*   **Parameters:** `fn` (function) - Callback function taking `(entity, dt)` where `dt` is delta time in seconds.
*   **Returns:** Nothing.

### `RemoveOnUpdateFn(fn)`
*   **Description:** Schedules a per-frame callback for removal. Safe to call during an active update loop.
*   **Parameters:** `fn` (function) - The callback to remove.
*   **Returns:** Nothing.
*   **Error states:** No-op if `fn` is not currently registered.

### `AddLongUpdateFn(fn)`
*   **Description:** Registers a long-interval callback (typically called at longer intervals by the engine, e.g., `0.5s`).
*   **Parameters:** `fn` (function) - Callback function taking `(entity, dt)`.
*   **Returns:** Nothing.

### `RemoveLongUpdateFn(fn)`
*   **Description:** Schedules a long-interval callback for removal.
*   **Parameters:** `fn` (function) - The callback to remove.
*   **Returns:** Nothing.

### `AddOnWallUpdateFn(fn)`
*   **Description:** Registers a wall-update callback. Starts wall-updating if needed. *Only runs on the server*.
*   **Parameters:** `fn` (function) - Callback function taking `(entity, dt)`.
*   **Returns:** Nothing.

### `RemoveOnWallUpdateFn(fn)`
*   **Description:** Schedules a wall-update callback for removal.
*   **Parameters:** `fn` (function) - The callback to remove.
*   **Returns:** Nothing.

### `AddPostUpdateFn(fn)`
*   **Description:** Registers a post-update callback. Post-updates occur after all per-frame updates have completed in a given tick. Ensures safe concurrent modification of callbacks during iteration.
*   **Parameters:** `fn` (function) - Callback function taking `(entity)`.
*   **Returns:** Nothing.

### `RemovePostUpdateFn(fn)`
*   **Description:** Removes a post-update callback. Can safely remove *during* a `PostUpdate` loop; otherwise performs immediate removal and compaction.
*   **Parameters:** `fn` (function) - The callback to remove.
*   **Returns:** Nothing.

## Events & listeners
None identified  
*(Note: This component does not register or emit events via `inst:ListenForEvent` / `inst:PushEvent`; it integrates with the engine’s update loop via `StartUpdatingComponent`, `StartWallUpdatingComponent`, and the global `_PostUpdates` table.)*
