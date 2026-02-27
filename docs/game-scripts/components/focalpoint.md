---
id: focalpoint
title: Focalpoint
description: Manages camera focus targets with configurable priority, range, and updater callbacks for client-side camera positioning in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: camera
source_hash: 94c62473
---

# Focalpoint

## Overview
The `focalpoint` component is a client-side manager that handles camera focus logic by evaluating registered focus sources (e.g., entities) and selecting the most appropriate one based on distance, priority, and updater conditions. It dynamically adjusts the camera offset to follow the highest-priority valid target within range. No server logic depends on this component.

## Dependencies & Tags
- **Component Dependencies:** None directly added or required.
- **Tags:** None added or removed.
- **External Systems:** Relies on `TheCamera` (camera system) and standard entity events (`onremove`).

## Properties
The component does not declare explicit public properties in a `_ctor`-like block, but the constructor initializes the following internal state variables used as de facto properties:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | passed to constructor | The entity the component is attached to (typically `TheFocalPoint`). |
| `targets` | `table` | `{}` | Nested table mapping sources → (id → parameters) for all registered focus sources. |
| `_onsourceremoved` | `function` | `function(source) self:StopFocusSource(source) end` | Event callback invoked when a registered source entity is removed. |
| `current_focus` | `table` or `nil` | `nil` | Holds the active focus parameters (source, id, target, etc.) currently dictating camera offset. |

## Main Functions

### `Reset(no_snap)`
* **Description:** Clears the current focus state and resets the camera to its default offset and behavior. Optionally skips snapping the camera to the new default position.
* **Parameters:**
  - `no_snap` (`boolean`, optional): If `true`, the camera offset is set but not snapped; if `false` or omitted, `TheCamera:Snap()` is called.

### `StartFocusSource(source, id, target, minrange, maxrange, priority, updater)`
* **Description:** Registers a new or updates an existing focus source (e.g., player, object) with camera tracking parameters. Focus is computed based on the source’s relationship to the camera parent (e.g., player entity). 
* **Parameters:**
  - `source` (`Entity` or `table`): The focus source entity (used to track when to deregister via `onremove`).
  - `id` (`string`, optional, default `"_default_"`): Identifier for this focus entry under the source (allows multiple concurrent focus entries per source).
  - `target` (`Entity`, optional): The entity whose position is tracked; defaults to `source` if omitted.
  - `minrange` (`number`): Minimum distance (in world units) where the camera begins to lead toward the target.
  - `maxrange` (`number`): Maximum distance beyond which the focus source is ignored.
  - `priority` (`number`): Higher priority values take precedence; ties are broken by closer distance.
  - `updater` (`table`, optional): Contains optional functions: `IsEnabled(parent, params, source)`, `ActiveFn(params, parent, dist_sq)`, and `UpdateFn(dt, params, parent, dist_sq)`. Defaults to `UpdateFocus` if `UpdateFn` is missing.

### `StopFocusSource(source, id)`
* **Description:** Removes a registered focus source or specific ID under a source. If the stopped focus was the current active focus, resets the camera.
* **Parameters:**
  - `source` (`Entity` or `table`): The focus source to remove.
  - `id` (`string` or `nil`): Specific ID to remove under the source; if `nil`, all focus entries under `source` are removed.

### `RemoveAllFocusSources(no_snap)`
* **Description:** Clears all registered focus sources and resets the camera to default.
* **Parameters:**
  - `no_snap` (`boolean`, optional): Passed to `Reset()` to control snapping behavior.

### `CameraUpdate(dt)`
* **Description:** Evaluates all registered focus sources to determine the best current focus candidate based on distance, priority, and `IsEnabled()` conditions. Updates the camera offset using the selected focus’s updater or the default `UpdateFocus`.
* **Parameters:**
  - `dt` (`number`): Delta time (unused directly but passed to updater functions).

### `GetDebugString()`
* **Description:** Returns a multi-line string with debug information: current camera offset, camera gains, active focus, and a list of all registered focus sources with their parameters.
* **Parameters:** None.

## Events & Listeners
- Listens to `"onremove"` event on registered `source` entities via `inst:ListenForEvent("onremove", self._onsourceremoved, source)` to automatically deregister removed focus sources.
- Raises no custom events (only interacts with existing camera system and entity lifecycle events).