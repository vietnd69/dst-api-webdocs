---
id: focalpoint
title: Focalpoint
description: Manages camera focus points from multiple sources with priority-based selection for client-side camera control.
tags: [camera, client, focus]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: ab8e0988
system_scope: entity
---

# Focalpoint

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Focalpoint` is a client-side component that manages camera focus points from multiple sources. It allows different game systems to register focus targets with priorities, ranges, and custom updater functions. The component selects the highest-priority valid focus source within range and applies camera offset calculations accordingly. This component should NOT drive server-side logic as it operates exclusively on the client.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("focalpoint")

-- Register a focus source with priority 4
inst.components.focalpoint:StartFocusSource(
    some_entity,
    "large",
    target_entity,
    5,      -- minrange
    12,     -- maxrange
    4,      -- priority
    updater -- optional updater table with UpdateFn, ActiveFn, IsEnabled
)

-- Remove specific focus source
inst.components.focalpoint:StopFocusSource(some_entity, "large")

-- Reset camera to default
inst.components.focalpoint:Reset()
```

## Dependencies & tags
**External dependencies:**
- `TheCamera` -- global camera controller for offset and snap operations
- `distsq` -- global utility function for squared distance calculation

**Components used:**
- None identified

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The owning entity instance. |
| `targets` | table | `{}` | Stores all registered focus sources indexed by source entity, then by id. |
| `_onsourceremoved` | function | --- | Callback triggered when a focus source entity is removed. |
| `current_focus` | table | `nil` | The currently active focus source parameters (target, priority, updater, etc.). |

## Main functions
### `Reset(no_snap)`
* **Description:** Resets the camera to default settings and clears the current focus. Optionally skips the camera snap animation.
* **Parameters:**
  - `no_snap` -- boolean; if `true`, skips `TheCamera:Snap()` call
* **Returns:** nil
* **Error states:** None

### `StartFocusSource(source, id, target, minrange, maxrange, priority, updater)`
* **Description:** Registers a new focus source or updates an existing one. Multiple sources can be registered with different priorities; the highest priority valid source within range becomes active. If `id` is omitted, defaults to `"_default_"`. Registers an `onremove` event listener on the source entity for automatic cleanup.
* **Parameters:**
  - `source` -- entity that owns this focus request
  - `id` -- string identifier for this focus source (default `"_default_"`)
  - `target` -- entity to focus on (defaults to `source` if nil)
  - `minrange` -- number; minimum distance for focus to be active
  - `maxrange` -- number; maximum distance for focus to be active
  - `priority` -- number; higher values take precedence
  - `updater` -- table with optional callbacks: `UpdateFn`, `ActiveFn`, `IsEnabled`
* **Returns:** nil
* **Error states:** None

### `StopFocusSource(source, id)`
* **Description:** Removes a focus source by source entity and optional id. If `id` is nil, removes all focus sources from that source entity. Triggers camera reset if the removed source was the current focus.
* **Parameters:**
  - `source` -- entity that owns the focus request
  - `id` -- string identifier (optional; removes all ids from source if nil)
* **Returns:** nil
* **Error states:** None

### `RemoveAllFocusSources(no_snap)`
* **Description:** Removes all registered focus sources and resets the camera. Iterates through all sources and calls `StopFocusSource` for each, then resets camera state.
* **Parameters:**
  - `no_snap` -- boolean; passed to `Reset()` to control snap behavior
* **Returns:** nil
* **Error states:** None

### `PushTempFocus(target, minrange, maxrange, priority)`
* **Description:** Deprecated function kept for backward compatibility. Prints a deprecation message and does nothing.
* **Parameters:**
  - `target` -- entity (unused)
  - `minrange` -- number (unused)
  - `maxrange` -- number (unused)
  - `priority` -- number (unused)
* **Returns:** nil
* **Error states:** None

### `CameraUpdate(dt)`
* **Description:** **Client-only.** Evaluates all registered focus sources and selects the highest priority valid source within range. Calls the focus updater function to apply camera offset. Automatically removes invalid targets (nil or not valid entities). If no valid focus exists, resets camera to default.
* **Parameters:**
  - `dt` -- number; delta time since last update
* **Returns:** nil
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns a formatted debug string with current camera offset, gains, active focus, and all registered focus sources with their parameters.
* **Parameters:** None
* **Returns:** string -- multi-line debug information
* **Error states:** None

### `UpdateFocus(dt, params, parent, dist_sq)` (local)
* **Description:** Default focus updater function used when no custom updater is provided. Calculates offset based on target position and applies it to the camera with a fixed Y offset of 1.5.
* **Parameters:**
  - `dt` -- number; delta time
  - `params` -- table; focus source parameters
  - `parent` -- entity; parent entity (camera owner)
  - `dist_sq` -- number; squared distance to target
* **Returns:** nil
* **Error states:** Errors if `params.target` is nil (inherited from `FocalPoint_CalcBaseOffset` which calls `GetPosition()` without guard).

### `FocalPoint_CalcBaseOffset(dt, params, parent, dist_sq)` (global)
* **Description:** Calculates the base camera offset vector from parent to target, scaled by distance within the min/max range bounds. Returns zero offset if within minrange, full offset if at maxrange, interpolated otherwise.
* **Parameters:**
  - `dt` -- number; delta time (unused in calculation)
  - `params` -- table; focus source parameters with `target`, `minrange`, `maxrange`
  - `parent` -- entity; parent entity for position reference
  - `dist_sq` -- number; squared distance to target
* **Returns:** vector -- calculated offset vector
* **Error states:** Errors if `params.target` is nil (unguarded `GetPosition()` call).

## Events & listeners
- **Listens to:** `onremove` — triggered on source entities; automatically calls `StopFocusSource` when the source entity is removed from the world