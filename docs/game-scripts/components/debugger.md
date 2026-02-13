---
id: debugger
title: Debugger
description: This component provides functionality for drawing persistent debug lines on an entity using its underlying debug rendering capabilities.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Debugger

## Overview
The `Debugger` component is attached to an entity to enable the display of persistent debugging lines in the game world. It leverages the entity's built-in `DebugRender` interface to draw lines, managing a collection of line definitions (origin, target, color) that are redrawn every frame. This is primarily used by developers or modders to visualize points, paths, or areas for debugging purposes.

## Dependencies & Tags
This component internally relies on the entity's `DebugRender` object, which is accessed via `self.inst.entity:AddDebugRender()`.
None identified.

## Properties
| Property        | Type           | Default Value                                | Description                                                               |
| :-------------- | :------------- | :------------------------------------------- | :------------------------------------------------------------------------ |
| `inst`          | `Entity`       | (Set in constructor)                         | A reference to the entity this component is attached to.                  |
| `debugger`      | `DebugRender`  | (Initialized via `inst.entity:AddDebugRender()`) | The internal DebugRender object used to draw lines.                       |
| `z`             | `number`       | `0.5`                                        | The Z-depth at which debug lines are rendered, affecting their draw order. |
| `debuggerdraws` | `table`        | `{}`                                         | A table storing definitions for each debug line to be drawn, keyed by a unique identifier. Each entry can contain `c` (color), `p1` (origin), and `p2` (target). |

## Main Functions
### `SetOrigin(key, x, y)`
*   **Description:** Sets or updates the starting point (`p1`) for a debug line identified by `key`. If the key does not exist, a new entry for it is created.
*   **Parameters:**
    *   `key`: A unique string or number identifier for the debug line.
    *   `x`: The X-coordinate of the origin.
    *   `y`: The Y-coordinate of the origin.

### `SetTarget(key, x, y)`
*   **Description:** Sets or updates the ending point (`p2`) for a debug line identified by `key`. If the key does not exist, a new entry for it is created.
*   **Parameters:**
    *   `key`: A unique string or number identifier for the debug line.
    *   `x`: The X-coordinate of the target.
    *   `y`: The Y-coordinate of the target.

### `SetColour(key, r, g, b, a)`
*   **Description:** Sets or updates the color (`c`) for a debug line identified by `key`. If the key does not exist, a new entry for it is created.
*   **Parameters:**
    *   `key`: A unique string or number identifier for the debug line.
    *   `r`: The red component of the color (0-1).
    *   `g`: The green component of the color (0-1).
    *   `b`: The blue component of the color (0-1).
    *   `a`: The alpha (transparency) component of the color (0-1).

### `SetAll(key, origin, tar, colour)`
*   **Description:** Sets or updates all properties (origin, target, and color) for a debug line identified by `key` in a single call. If the key does not exist, a new entry is created. This function handles `z` coordinate in `origin` and `tar` tables by mapping it to the `y` coordinate if present.
*   **Parameters:**
    *   `key`: A unique string or number identifier for the debug line.
    *   `origin`: A table `{x = #, y = #}` or `{x = #, z = #}` representing the starting point. Can be `nil` to leave unchanged.
    *   `tar`: A table `{x = #, y = #}` or `{x = #, z = #}` representing the ending point. Can be `nil` to leave unchanged.
    *   `colour`: A table `{r = #, g = #, b = #, a = #}` representing the line's color. Can be `nil` to leave unchanged.

### `SetZ(val)`
*   **Description:** Re-applies the component's internal `self.z` value to the underlying `DebugRender` object. Note that the `val` parameter is not used; the function always sets the `DebugRender` Z to `self.z`.
*   **Parameters:**
    *   `val`: (Unused) A value that would typically be the new Z-depth, but the function uses `self.z` instead.

### `OnUpdate()`
*   **Description:** This function is called every frame because the component is set to update. It clears all previously drawn debug lines from the `DebugRender` object, then iterates through `self.debuggerdraws` to redraw all currently defined lines. Default color and point values are used if specific properties are missing for a line.
*   **Parameters:** None.