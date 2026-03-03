---
id: focalpoint
title: Focalpoint
description: Manages camera focal point targeting on the client, updating camera offset based on prioritized sources and distance constraints.
tags: [camera, client, focus, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 94c62473
system_scope: world
---

# Focalpoint

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Focalpoint` is a client-side component that manages dynamic camera focus targeting. It allows multiple sources to register focal point requests (each with a target entity, range, priority, and optional updater callbacks), and selects the highest-priority valid target within range to drive the camera offset. It is typically attached to `TheFocalPoint` and interacts with `TheCamera` to set offsets and reset to default.

## Usage example
```lua
-- Register a new focus source (e.g., player selection)
TheFocalPoint.components.focalpoint:StartFocusSource(c_sel(), "large", nil, 5, 12, 4)

-- Register another source with higher priority but smaller range
TheFocalPoint.components.focalpoint:StartFocusSource(c_sel(), "small", nil, 999, 999, 3)

-- Stop a specific source when no longer relevant
TheFocalPoint.components.focalpoint:StopFocusSource(c_sel(), "large")

-- Reset camera to default when all sources are removed
TheFocalPoint.components.focalpoint:RemoveAllFocusSources(false)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to (typically `TheFocalPoint`). |
| `targets` | `table` | `{}` | Nested table mapping `source → {id → params}` for registered focus sources. |
| `current_focus` | `table?` | `nil` | Currently active focus parameters table, or `nil` if no focus. |
| `_onsourceremoved` | `function` | — | Internal callback bound to `self:StopFocusSource(source)` for source removal events. |

## Main functions
### `Reset(no_snap)`
* **Description:** Clears the current focus and resets the camera to default settings. Optionally snaps camera immediately.
* **Parameters:**  
  `no_snap` (boolean, optional) — if `true`, camera transition is not snapped; otherwise, `TheCamera:Snap()` is called.
* **Returns:** Nothing.

### `StartFocusSource(source, id, target, minrange, maxrange, priority, updater)`
* **Description:** Registers or updates a focus request from a given source. If multiple sources exist, the one with highest priority (and smallest distance on tie) becomes active.
* **Parameters:**  
  `source` (entity or token) — unique source identifier.  
  `id` (string, optional) — sub-id for the source; defaults to `"_default_"`.  
  `target` (entity, optional) — entity to follow; defaults to `source`.  
  `minrange` (number) — minimum distance before offset scaling begins.  
  `maxrange` (number) — maximum range; target outside this range is ignored.  
  `priority` (number) — priority score; higher values win in selection.  
  `updater` (table, optional) — optional table containing `UpdateFn` and/or `ActiveFn` callbacks and an `IsEnabled(parent, params, source)` function.  
* **Returns:** Nothing.

### `StopFocusSource(source, id)`
* **Description:** Removes a focus source (or specific `id` under the source). If the removed focus was current, resets the camera.
* **Parameters:**  
  `source` (entity or token) — source to remove.  
  `id` (string?, optional) — if omitted, all `id`s under this source are removed.  
* **Returns:** Nothing.

### `RemoveAllFocusSources(no_snap)`
* **Description:** Clears all registered focus sources and resets camera.
* **Parameters:**  
  `no_snap` (boolean, optional) — passed to `Reset()`.  
* **Returns:** Nothing.

### `CameraUpdate(dt)`
* **Description:** Evaluates all registered focus sources and selects the best one (by priority and distance). Updates camera offset using the source’s updater or the default `UpdateFocus` function. Handles removal of invalid targets.
* **Parameters:**  
  `dt` (number) — delta time for smooth updates.  
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a multi-line debug string showing current offset, camera gains, active focus, and all registered sources.
* **Parameters:** None.
* **Returns:** `string` — formatted debug output.

## Events & listeners
- **Listens to:** `onremove` — on registered sources, triggers `self._onsourceremoved(source)` to clean up focus entries when a source entity is removed.
- **Pushes:** None identified

## Deprecated functions
### `PushTempFocus(target, minrange, maxrange, priority)`
* **Description:** Kept for backward compatibility; prints deprecation warning and performs no action.
* **Parameters:**  
  `target` (entity), `minrange`, `maxrange`, `priority` (numbers) — unused.  
* **Returns:** Nothing.

> **Note:** This component is client-only. Server-side logic must not depend on it.
