---
id: homeseeker
title: Homeseeker
description: Manages an entity's association with a home structure and facilitates movement toward it.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 8da11099
---

# Homeseeker

## Overview
The `homeseeker` component allows an entity to designate, track, and move toward a designated home structure. It manages the relationship between the entity and its home, listens for home removal events, and provides utilities for pathfinding and travel-time estimation.

## Dependencies & Tags
- Relies on `self.inst` having a `Transform` component (via `GetWorldPosition()`).
- Relies on `self.inst.components.locomotor` (optional, used in `GoHome` and `GetHomeDirectTravelTime`).
- If `self.home` is provided, it must support the `"onremove"` event (typically structures with a `destroyable` or `burnable` component).
- Adds no tags itself; does not add or remove components during initialization.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(passed to constructor)* | Reference to the entity the component is attached to. |
| `removecomponent` | `boolean` | `true` | If `true`, the `homeseeker` component is automatically removed from `inst` when the current home is destroyed. |
| `onhomeremoved` | `function(home)` | *(lambda defined in constructor)* | Callback invoked when the home entity is removed; sets `self.home = nil` and optionally removes the component. |
| `home` | `Entity?` | `nil` | The entity currently designated as the home structure. |

## Main Functions
### `HasHome()`
* **Description:** Returns whether the entity currently has a valid home. A home is considered invalid if it is `nil` or currently burning (per its `burnable` component).
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a debug-friendly string representation of the current home state.
* **Parameters:** None.

### `GetHome()`
* **Description:** Returns the current home entity (may be `nil`).
* **Parameters:** None.

### `SetHome(home)`
* **Description:** Assigns a new home entity. If a previous home existed, the `"onremove"` event listener is removed. If the new home is non-`nil`, a listener is added to detect its removal.
* **Parameters:**  
  `home` (`Entity?`) — The entity to set as the home.

### `GoHome(shouldrun)`
* **Description:** Initiates movement toward the home using a `GOHOME` action. If a `locomotor` component exists, it pushes the action at the specified speed; otherwise, the action is queued directly.
* **Parameters:**  
  `shouldrun` (`boolean`) — Whether the entity should run (if supported by `locomotor`) instead of walk.

### `GetHomePos()`
* **Description:** Returns the world position (`x, y, z`) of the current home, or `nil` if no home exists.
* **Parameters:** None.

### `GetHomeDirectTravelTime()`
* **Description:** Estimates the time (in seconds) it would take the entity to walk directly to its home, assuming no obstacles. Uses Euclidean distance and the entity's walk speed (or higher of default/walk speed if `locomotor` is present).
* **Parameters:** None.

## Events & Listeners
- Listens for `"onremove"` on `self.home` (if set), triggering `onhomeremoved(home)`.  
  *(This callback resets `self.home` to `nil` and optionally removes the `homeseeker` component.)*