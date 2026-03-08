---
id: uianim
title: Uianim
description: Provides a UI-specific animation state wrapper for entities used in the UI system.
tags: [ui, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: badb5cdf
system_scope: ui
---

# Uianim

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`UIAnim` is a UI widget component that extends `Widget` and manages animation state for UI entities. It ensures the entity has an `AnimState` component attached and exposes helpers to query animation properties (e.g., playback time, bounding box, facing direction), scale-corrected visual bounds, and debugging introspection. It is intended for use in UI elements (e.g., icons, menu graphics) that require animated visuals.

## Usage example
```lua
local ui_widget = CreateWidget("UIAnim")
local animstate = ui_widget.components.uianim:GetAnimState()
animstate:PlayAnimation("idle", true)
ui_widget.components.uianim:SetFacing(1)
local width, height = ui_widget.components.uianim:GetBoundingBoxSize()
```

## Dependencies & tags
**Components used:** None (relies on `AnimState`, `UITransform`, and `Widget` base functionality, but does not directly access them via `inst.components.X`)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The entity instance to which the widget is attached (inherited from `Widget`). |
| `inst.entity` | entity | `nil` | Internal entity used to manage `AnimState` and `UITransform`. |

## Main functions
### `GetAnimState()`
* **Description:** Returns the `AnimState` component attached to the entity.
* **Parameters:** None.
* **Returns:** `AnimState` — the animation state object (e.g., used to play animations, query timing).
* **Error states:** May return `nil` if `AnimState` is missing or not yet attached, though the constructor explicitly adds it.

### `SetFacing(dir)`
* **Description:** Sets the facing direction of the UI entity's `UITransform` component.
* **Parameters:** `dir` (number) — facing direction (e.g., `1` for right, `-1` for left).
* **Returns:** Nothing.

### `GetBoundingBoxSize()`
* **Description:** Returns the scaled width and height of the visual bounding box.
* **Parameters:** None.
* **Returns:** `width` (number), `height` (number) — bounding box dimensions in local units, scaled by `GetScale()`.
* **Error states:** May return `0, 0` if `AnimState:GetVisualBB()` yields zero or invalid bounds.

### `GetVisualBB()`
* **Description:** Returns the scaled bounding box coordinates in local space.
* **Parameters:** None.
* **Returns:** `x1`, `y1`, `x2`, `y2` (all numbers) — coordinates of the top-left and bottom-right corners, scaled by `GetScale()`.

### `DebugDraw_AddSection(dbui, panel)`
* **Description:** Adds debug visualization data for this component to the provided debugger UI panel.
* **Parameters:**  
  - `dbui` (DebugUI) — debugger UI instance.  
  - `panel` (widget) — panel into which debug entries are added.
* **Returns:** Nothing.
* **Error states:** The "Might crash" node attempts to fetch `GetCurrentAnimationLength()`, which will throw an error if the animation asset is missing or invalid; it is guarded only by user expansion.

## Events & listeners
None identified