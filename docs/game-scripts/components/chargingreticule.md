---
id: chargingreticule
title: Chargingreticule
description: Manages a visual reticle that follows a target entity and points toward a dynamic aim direction (mouse or controller), used for indicating where a charging attack will land.
tags: [combat, ui, visual, aim]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: eb5077a1
system_scope: ui
---

# Chargingreticule

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Chargingreticule` is a UI-related component that renders and animates a visual reticle (typically used for charging attacks like the Beekeeper's hammer or other directed mechanics). It tracks a designated owner entity, updates its position to match the owner, and dynamically points toward a target direction derived from mouse position (when using keyboard/mouse) or analog stick input (when using a controller). It supports eased rotation smoothing and integrates with the camera system for proper world-space projection.

## Usage example
```lua
local inst = Prefab("chargingreticule")
inst:AddComponent("chargingreticule")
inst:AddTag("worldfx")
inst:AddTag("do_not_pickle")
-- After the owner entity is created:
inst.components.chargingreticule:LinkToEntity(owner_entity)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `worldfx`, `do_not_pickle` internally viaPrefab setup (not directly by this component). This component itself does not manipulate tags on its owner.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ease` | boolean | `false` | Whether rotation should be eased/smoothed. |
| `smoothing` | number | `6.66` | Controls the speed of rotation easing when `ease` is true. |
| `targetpos` | Vector3? | `nil` | The `(x, z)` world position the reticle should point toward (y is always `0`). |
| `followhandler` | function? | `nil` | Internal handler ID for mouse movement updates (set only when using mouse). |
| `owner` | Entity? | `nil` | The entity this reticle is associated with (its position is tied to this entity). |

## Main functions
### `OnRemoveEntity()`
* **Description:** Cleans up internal references and removes listeners when the owning entity is removed. Prevents memory leaks and dangling callbacks.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetMouseTargetXZ(x, y)`
* **Description:** Projects screen-space coordinates `(x, y)` into world-space `(x, z)` using `TheSim:ProjectScreenPos`. Returns `nil` if projection fails.
* **Parameters:**  
  - `x` (number) – Screen X coordinate.  
  - `y` (number) – Screen Y coordinate.  
* **Returns:**  
  - `x` (number?) – World X coordinate or `nil` on failure.  
  - `z` (number?) – World Z coordinate or `nil` on failure.

### `GetControllerTargetXZ()`
* **Description:** Computes a target world position based on the controller’s analog stick input. Uses camera relative vectors to derive a direction and offsets the owner’s position by that direction.
* **Parameters:** None.
* **Returns:**  
  - `x` (number?) – World X coordinate or `nil` if input is within deadzone.  
  - `z` (number?) – World Z coordinate or `nil` if input is within deadzone.

### `LinkToEntity(target)`
* **Description:** Associates this reticle with a target entity (the owner), initializes its position, sets up input handlers (mouse or controller), and configures the initial aim direction. Registers for camera updates.
* **Parameters:**  
  - `target` (Entity) – The entity this reticle will follow and point toward.  
* **Returns:** Nothing.
* **Error states:** If neither mouse nor controller input yields a valid target position, it defaults to a position one unit ahead of the owner in the owner’s facing direction.

### `UpdatePosition_Internal()`
* **Description:** Syncs the reticle’s position to the owner’s current `(x, z)` world position (y is always set to `0`). This is called on every camera update and after linking.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateRotation_Internal(dt)`
* **Description:** Rotates the reticle to face `targetpos`. If `ease` is `true` and `dt` is provided, applies linear interpolation to rotation change based on `smoothing`.
* **Parameters:**  
  - `dt` (number?) – Delta time for smoothing. If `nil`, rotation updates instantly.  
* **Returns:** Nothing.

### `OnCameraUpdate(dt)`
* **Description:** Callback for camera updates. Refreshes the reticle’s position (due to owner movement) and updates the aim direction based on current input (mouse or controller), then updates rotation.
* **Parameters:**  
  - `dt` (number) – Delta time since last frame.  
* **Returns:** Nothing.

### `Snap()`
* **Description:** Instantly updates position and forces the reticle to face `targetpos` without smoothing.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `OnCameraUpdate` (via `TheCamera:AddListener`) — triggers `OnCameraUpdate(dt)`.
- **Pushes:** None identified.
