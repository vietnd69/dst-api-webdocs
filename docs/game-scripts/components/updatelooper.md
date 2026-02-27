---
id: updatelooper
title: Updatelooper
description: Enables entities to register and execute custom update functions every frame, during long updates, wall updates, and post-update phases.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: ac6e7164
---

# Updatelooper

## Overview
The `UpdateLooper` component provides a flexible mechanism for entities to run custom code at specific points in the game loop: every frame (`OnUpdate`), less frequently (`LongUpdate`), only when the entity is visible on screen (`OnWallUpdate`), and after all per-frame updates complete (`PostUpdate`). It replaces the unreliable `DoPeriodicTask(0)` pattern for precise, per-frame callbacks.

## Dependencies & Tags
- Relies on entity methods: `StartUpdatingComponent`, `StopUpdatingComponent`, `StartWallUpdatingComponent`, `StopWallUpdatingComponent`.
- Uses global `_PostUpdates` table to coordinate post-update callbacks.
- No component tags are added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the component is attached to. |
| `onupdatefns` | `table` | `{}` | List of functions registered via `AddOnUpdateFn`, called every frame. |
| `longupdatefns` | `table` | `{}` | List of functions registered via `AddLongUpdateFn`, called at lower frequency (exact interval determined by caller). |
| `onwallupdatefns` | `table` | `{}` | List of functions registered via `AddOnWallUpdateFn`, called only when the entity is visible on screen. |
| `postupdatefns` | `table` | `{}` | List of functions registered via `AddPostUpdateFn`, called after all per-frame updates in the current tick. |
| `OnUpdatesToRemove` | `table?` | `nil` | Temporary list used during `OnUpdate` to defer removal of functions. |
| `OnLongUpdatesToRemove` | `table?` | `nil` | Temporary list used during `LongUpdate` to defer removal of functions. |
| `OnWallUpdatesToRemove` | `table?` | `nil` | Temporary list used during `OnWallUpdate` to defer removal of functions. |

## Main Functions

### `AddOnUpdateFn(fn)`
* **Description:** Registers a function to be called every frame during the entity’s `OnUpdate` phase. Automatically starts per-frame updates if none were previously registered.
* **Parameters:**  
  `fn (function)` — Callback function `(entity, dt)` where `dt` is the delta time since the last frame.

### `RemoveOnUpdateFn(fn)`
* **Description:** Deferably removes a previously registered on-update function. Actual removal occurs *during* the next `OnUpdate` call to avoid modifying the list while iterating.
* **Parameters:**  
  `fn (function)` — The callback to remove.

### `AddLongUpdateFn(fn)`
* **Description:** Registers a function to be called periodically (e.g., less frequently than every frame). The caller is responsible for triggering `LongUpdate` via `DoPeriodicTask`.
* **Parameters:**  
  `fn (function)` — Callback function `(entity, dt)`.

### `RemoveLongUpdateFn(fn)`
* **Description:** Deferably removes a long-update function. Actual removal occurs during the next `LongUpdate` call.
* **Parameters:**  
  `fn (function)` — The callback to remove.

### `OnUpdate(dt)`
* **Description:** Main per-frame update handler. Executes all registered `onupdatefns`, handling deferred removals first. Automatically stops per-frame updates if the callback list becomes empty.
* **Parameters:**  
  `dt (number)` — Delta time in seconds.

### `LongUpdate(dt)`
* **Description:** Executes all registered `longupdatefns`, handling deferred removals. Typically invoked manually by the owner of this component.
* **Parameters:**  
  `dt (number)` — Delta time in seconds.

### `AddOnWallUpdateFn(fn)`
* **Description:** Registers a function to be called only when the entity is visible on screen (i.e., "on the wall"). Automatically starts wall-updating if not already active.
* **Parameters:**  
  `fn (function)` — Callback function `(entity, dt)`.

### `RemoveOnWallUpdateFn(fn)`
* **Description:** Deferably removes a wall-update function. Actual removal occurs during the next `OnWallUpdate` call.
* **Parameters:**  
  `fn (function)` — The callback to remove.

### `OnWallUpdate(dt)`
* **Description:** Executes all registered `onwallupdatefns`, skipping if the game is paused. Handles deferred removals and stops wall-updating if no callbacks remain.
* **Parameters:**  
  `dt (number)` — Delta time in seconds.

### `AddPostUpdateFn(fn)`
* **Description:** Registers a function to be executed once per tick *after* all per-frame updates complete. Ensures safe registration and removal even during post-update execution.
* **Parameters:**  
  `fn (function)` — Callback function `(entity)` (note: no `dt` argument).

### `RemovePostUpdateFn(fn)`
* **Description:** Removes a post-update function. If called *during* the post-update loop, removal is immediate (via `nil` assignment). Otherwise, the list is compacted eagerly.
* **Parameters:**  
  `fn (function)` — The callback to remove.

## Events & Listeners
- **Listens for:** None (no `inst:ListenForEvent` calls).
- **Triggers:** None directly via `PushEvent`, though registered callbacks *may* emit their own events.