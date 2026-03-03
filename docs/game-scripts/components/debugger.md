---
id: debugger
title: Debugger
description: Provides runtime line-drawing debug visualization for entities by rendering debug lines between specified origin and target points.
tags: [debug, rendering, tools]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 64b6f918
system_scope: entity
---

# Debugger

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Debugger` is a development-only component that enables on-screen debug visualization of debug lines (e.g., for pathing, positioning, or spatial relationships). It attaches to an entity and uses the engine's debug rendering API to draw colored lines defined by key-value pairs. It is intended for internal use during development and debugging—not for production gameplay.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("debugger")
inst.components.debugger:SetAll("path", {x=0, y=0}, {x=10, y=10}, {r=1, g=0, b=0, a=1})
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in) | The entity instance this component is attached to. |
| `debugger` | `DebugRender` | (internal) | The underlying debug renderer instance. |
| `z` | number | `0.5` | Fixed Z-layer offset used for rendering order. |
| `debuggerdraws` | table | `{}` | Internal dictionary storing line definitions by key. |

## Main functions
### `SetOrigin(key, x, y)`
* **Description:** Sets the origin point (`p1`) of a debug line identified by `key`.
* **Parameters:**  
  `key` (string) — Unique identifier for the line segment.  
  `x`, `y` (number) — Coordinates of the line's starting point.
* **Returns:** Nothing.

### `SetTarget(key, x, y)`
* **Description:** Sets the target point (`p2`) of a debug line identified by `key`.
* **Parameters:**  
  `key` (string) — Unique identifier for the line segment.  
  `x`, `y` (number) — Coordinates of the line's ending point.
* **Returns:** Nothing.

### `SetColour(key, r, g, b, a)`
* **Description:** Sets the color (RGBA) of the debug line identified by `key`.
* **Parameters:**  
  `key` (string) — Unique identifier for the line segment.  
  `r`, `g`, `b`, `a` (number) — Red, green, blue, and alpha components in the range `[0,1]`.
* **Returns:** Nothing.

### `SetAll(key, origin, tar, colour)`
* **Description:** Convenience method to set origin, target, and color of a debug line in one call.
* **Parameters:**  
  `key` (string) — Unique identifier for the line segment.  
  `origin` (table or `nil`) — `{x, y}` or `{x, z}` (uses `.y` or `.z` depending on presence of `.z`).  
  `tar` (table or `nil`) — `{x, y}` or `{x, z}` (uses `.y` or `.z` depending on presence of `.z`).  
  `colour` (table or `nil`) — `{r, g, b, a}` with values in `[0,1]`.
* **Returns:** Nothing.

### `SetZ(val)`
* **Description:** Attempts to update the Z-layer of the debug renderer; **note**: internally ignored — the value `val` is unused, and `self.z` remains unchanged.
* **Parameters:**  
  `val` (number) — Desired Z offset (not used).
* **Returns:** Nothing.

### `OnUpdate()`
* **Description:** Called each frame to flush and redraw all debug lines using current `debuggerdraws` contents. Outputs lines between `p1` and `p2` with their assigned colors.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
