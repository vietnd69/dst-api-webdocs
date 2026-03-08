---
id: mapwidget
title: Mapwidget
description: Renders and manages the player's minimap and world-position mapping on the HUD, handling zoom, panning, and texture updates.
tags: [ui, minimap, hud, world]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 8ec7b831
system_scope: ui
---

# Mapwidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MapWidget` is a UI widget responsible for displaying the minimap in the `MapScreen`. It wraps the `MiniMap` instance from `TheWorld`, manages its visual representation (background, center reticle, texture), and handles user input for panning (via mouse drag) and zooming. It integrates with the `MiniMap` system to translate between world coordinates and map-screen coordinates, and notifies the mapscreen of decoration updates when the map changes.

## Usage example
```lua
local mapscreen = ... -- The current MapScreen instance
local mapwidget = MapWidget(mapscreen)
mapwidget:Show()
mapwidget:OnZoomIn(-0.1)  -- Zoom in
mapwidget:OnZoomOut(0.1)  -- Zoom out
mapwidget:Offset(10, -5)  -- Pan the map
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `ThePlayer` | `ThePlayer` | The player instance this mapwidget is bound to. |
| `mapscreen` | `MapScreen` (or `nil`) | passed-in `mapscreen` | The owning mapscreen instance; used to trigger decoration updates. |
| `bg` | `Image` | `Image("images/hud.xml", "map.tex")` | The background texture image for the map. |
| `centerreticle` | `Image` | `Image("images/hud.xml", "cursor02.tex")` | The fixed center reticle overlay on the map. |
| `minimap` | `MiniMap` | `TheWorld.minimap.MiniMap` | The underlying minimap instance used for coordinate transformations and zoom/offset state. |
| `img` | `Image` | `Image()` | The primary image widget used to render the minimap texture (additive blend). |
| `lastpos` | `vector2` or `nil` | `nil` | Stores last mouse position during panning; `nil` when not panning. |

## Main functions
### `WorldPosToMapPos(x, y, z)`
*   **Description:** Converts a world-space position to minimap screen coordinates.
*   **Parameters:**  
  - `x`, `y`, `z` (numbers) — the world position coordinates.  
*   **Returns:** `x_map`, `y_map` (numbers) — the minimap screen-space coordinates.
*   **Error states:** May return `nil` if `minimap` is not yet initialized (not expected under normal operation).

### `MapPosToWorldPos(x, y, z)`
*   **Description:** Converts minimap screen coordinates back to world-space position (for 2D map interactions).
*   **Parameters:**  
  - `x`, `y`, `z` (numbers) — the minimap screen-space coordinates (typically `z=0`).  
*   **Returns:** `x_world`, `y_world`, `z_world` (numbers) — world-space coordinates.
*   **Error states:** May return `nil` if `minimap` is not yet initialized.

### `SetTextureHandle(handle)`
*   **Description:** Updates the texture used by the `img` widget to render the minimap.
*   **Parameters:**  
  - `handle` (string or handle type) — texture handle provided by `MiniMap:GetTextureHandle()`.  
*   **Returns:** Nothing.

### `OnZoomIn(negativedelta)`
*   **Description:** Attempts to zoom the minimap in by the specified delta (negative value). Only works if the widget is shown and zoom is above the minimum clamp.
*   **Parameters:**  
  - `negativedelta` (number, optional) — zoom delta (default `-0.1`).  
*   **Returns:** `true` if zoom was applied; `false` otherwise (clamped or hidden).
*   **Error states:** Returns `false` if `self.shown` is `false` or zoom is already at or below `ZOOM_CLAMP_MIN`.

### `OnZoomOut(positivedelta)`
*   **Description:** Attempts to zoom the minimap out by the specified delta (positive value). Only works if the widget is shown and zoom is below the maximum clamp.
*   **Parameters:**  
  - `positivedelta` (number, optional) — zoom delta (default `0.1`).  
*   **Returns:** `true` if zoom was applied; `false` otherwise (clamped or hidden).
*   **Error states:** Returns `false` if `self.shown` is `false` or zoom is already at or above `ZOOM_CLAMP_MAX`.

### `GetZoom()`
*   **Description:** Returns the current zoom level of the minimap.
*   **Parameters:** None.  
*   **Returns:** `zoom` (number) — current zoom level (between `ZOOM_CLAMP_MIN` and `ZOOM_CLAMP_MAX`).

### `UpdateTexture()`
*   **Description:** Fetches the latest minimap texture handle from `MiniMap` and updates the `img` widget.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `UpdateMapscreenDecorations()`
*   **Description:** Marks the mapscreen's decoration data as dirty, triggering a redraw of map overlays and annotations.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Handles map panning while the primary mouse button is held. Computes delta in screen space and applies it to `MiniMap:Offset()`.
*   **Parameters:**  
  - `dt` (number) — delta time in seconds.  
*   **Returns:** Nothing.
*   **Error states:** Early exit if `self.shown` is `false`.

### `Offset(dx, dy)`
*   **Description:** Manually offsets the minimap view by the given screen-space delta.
*   **Parameters:**  
  - `dx`, `dy` (numbers) — screen-space offset amounts.  
*   **Returns:** Nothing. Also calls `UpdateMapscreenDecorations()` to refresh overlays.

### `OnShow()`
*   **Description:** Resets minimap offset when the widget is shown (e.g., opening the map screen).
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `OnHide()`
*   **Description:** Clears `lastpos` to stop panning tracking when the widget is hidden.
*   **Parameters:** None.  
*   **Returns:** Nothing.

## Events & listeners
None identified