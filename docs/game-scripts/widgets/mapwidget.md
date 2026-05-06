---
id: mapwidget
title: MapWidget
description: A UI widget that renders the world minimap with zoom, pan, and coordinate conversion functionality for the map screen.
tags: [widget, ui, minimap]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: widgets
source_hash: 0f77f266
system_scope: ui
---

# MapWidget

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`MapWidget` is a UI widget extending `Widget` that displays the world minimap texture with interactive zoom and pan controls. It manages coordinate conversion between world space and map space, handles drag-based panning via input polling in `OnUpdate`, and syncs texture updates from `TheWorld.minimap.MiniMap`. Embedded inside map screens via `screen:AddChild(MapWidget(owner, mapscreen))`.

## Usage example
```lua
local MapWidget = require("widgets/mapwidget")

-- Inside a map screen's _ctor:
self.mapwidget = self:AddChild(MapWidget(ThePlayer, self))
self.mapwidget:SetPosition(0, 0, 0)
self.mapwidget:UpdateTexture()

-- Zoom controls:
if self.mapwidget:OnZoomIn() then
    -- zoomed in successfully
end

-- Coordinate conversion:
local mapx, mapy, mapz = self.mapwidget:WorldPosToMapPos(wx, wy, wz)
```

## Dependencies & tags
**External dependencies:**
- `widgets/widget` -- Widget base class
- `widgets/image` -- Image child widget for background, reticle, and minimap texture

**Components used:** None — widgets do not interact with ECS components directly.

**Tags:** None.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `ThePlayer` | Entity owning the map widget; defaults to `ThePlayer` for backward compatibility. |
| `mapscreen` | Screen | `nil` | Reference to the parent map screen; used to call `OnMinimapMoved` on offset. |
| `bg` | Image | --- | Background image widget; fills screen with `map.tex`. |
| `centerreticle` | Image | --- | Center reticle image widget; child of `bg`, shows `cursor02.tex`. |
| `img` | Image | --- | Minimaps texture image widget; receives texture handle via `SetTextureHandle`. |
| `minimap` | MiniMap | --- | Reference to `TheWorld.minimap.MiniMap`; source of texture and zoom state. |
| `lastpos` | table | `nil` | Last recorded screen position during drag; cleared on input release or hide. |
| `dragthreshold` | number | `nil` | Drag threshold as percentage of screen size; if set, ignores small movements. |
| `ZOOM_CLAMP_MIN` | constant (local) | `1` | Minimum zoom level clamp; `OnZoomIn` will not zoom below this. |
| `ZOOM_CLAMP_MAX` | constant (local) | `20` | Maximum zoom level clamp; `OnZoomOut` will not zoom above this. |

## Main functions
### `_ctor(owner, mapscreen)`
*   **Description:** Initialises the widget, calls `Widget._ctor(self, "MapWidget")`, creates background/reticle/texture image children, and starts the update loop. Handles backward compatibility for old constructor signature.
*   **Parameters:**
    - `owner` -- entity owning the widget, or (legacy) the mapscreen if called with old signature
    - `mapscreen` -- parent map screen instance, or (legacy) ignored if `owner` is not an entity
*   **Returns:** nil
*   **Error states:** None — backward compatibility branch asserts on dev branch but otherwise defaults to `ThePlayer`.

### `WorldPosToMapPos(x, y, z)`
*   **Description:** Converts world coordinates to minimap texture coordinates via the MiniMap component.
*   **Parameters:**
    - `x` -- number world X coordinate
    - `y` -- number world Y coordinate
    - `z` -- number world Z coordinate
*   **Returns:** Three numbers representing map texture coordinates.
*   **Error states:** Errors if `self.minimap` is nil (would only occur if `TheWorld.minimap` is not initialized).

### `MapPosToWorldPos(x, y, z)`
*   **Description:** Converts minimap texture coordinates back to world coordinates via the MiniMap component.
*   **Parameters:**
    - `x` -- number map texture X coordinate
    - `y` -- number map texture Y coordinate
    - `z` -- number map texture Z coordinate
*   **Returns:** Three numbers representing world coordinates.
*   **Error states:** Errors if `self.minimap` is nil (would only occur if `TheWorld.minimap` is not initialized).

### `SetTextureHandle(handle)`
*   **Description:** Sets the image widget's texture handle to display the current minimap render target.
*   **Parameters:** `handle` -- texture handle from `MiniMap:GetTextureHandle()`
*   **Returns:** nil
*   **Error states:** Errors if `self.img` or `self.img.inst.ImageWidget` is nil (widget construction failure).

### `OnZoomIn(negativedelta)`
*   **Description:** Zooms the minimap in by applying a negative delta. Only works when widget is shown and zoom is above minimum clamp.
*   **Parameters:** `negativedelta` -- number zoom delta (default `-0.1`); negative values zoom in
*   **Returns:** `true` if zoom was applied, `false` if blocked by visibility or zoom clamp.
*   **Error states:** Errors if `self.minimap` is nil (no nil guard present before MiniMap:Zoom call).

### `OnZoomOut(positivedelta)`
*   **Description:** Zooms the minimap out by applying a positive delta. Only works when widget is shown and zoom is below maximum clamp.
*   **Parameters:** `positivedelta` -- number zoom delta (default `0.1`); positive values zoom out
*   **Returns:** `true` if zoom was applied, `false` if blocked by visibility or zoom clamp.
*   **Error states:** Errors if `self.minimap` is nil (no nil guard present before MiniMap:Zoom call).

### `GetZoom()`
*   **Description:** Returns the current zoom level from the MiniMap component.
*   **Parameters:** None
*   **Returns:** Number representing current zoom level.
*   **Error states:** Errors if `self.minimap` is nil (would only occur if `TheWorld.minimap` is not initialized).

### `UpdateTexture()`
*   **Description:** Fetches the current texture handle from MiniMap and applies it via `SetTextureHandle`. Called to refresh the displayed map image.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** Errors if `self.minimap` is nil (no nil guard before GetTextureHandle call).

### `StartDragThreshold(threshold)`
*   **Description:** Begins drag tracking by recording the current screen position and setting a movement threshold. Small movements below threshold are ignored until threshold is exceeded or cancelled.
*   **Parameters:** `threshold` -- number percentage of screen size; movements below this are filtered
*   **Returns:** nil
*   **Error states:** None — `TheInput:GetScreenPosition()` is safe to call.

### `CancelDragThreshold()`
*   **Description:** Cancels the active drag threshold, allowing immediate pan response on next input.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `OnUpdate(dt)`
*   **Description:** **Periodic update hook.** Polls primary input control for drag-based panning. Applies offset based on screen movement scaled by `2/9` (MiniMapRenderer ZOOM_MODIFIER scaler). Respects drag threshold if set.
*   **Parameters:** `dt` -- number delta time since last frame
*   **Returns:** nil
*   **Error states:** Errors if `TheInput:GetScreenPosition()` or `TheSim:GetScreenSize()` is unavailable (engine not initialized).

### `Offset(dx, dy)`
*   **Description:** Applies a pan offset to the minimap and notifies the parent screen via `OnMinimapMoved` if callback exists.
*   **Parameters:**
    - `dx` -- number horizontal offset
    - `dy` -- number vertical offset
*   **Returns:** nil
*   **Error states:** Errors if `self.minimap` is nil (no nil guard present before MiniMap:Offset call).

### `OnShow()`
*   **Description:** Lifecycle hook called when widget becomes visible. Resets minimap offset to center.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** Errors if `self.minimap` is nil (no nil guard present before MiniMap:ResetOffset call).

### `OnHide()`
*   **Description:** Lifecycle hook called when widget is hidden. Clears drag tracking state.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

## Events & listeners
None — this widget does not register event listeners or push events. Input is polled directly in `OnUpdate`.