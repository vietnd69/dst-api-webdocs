---
id: mapscreen
title: Mapscreen
description: Manages the player's map interface, including minimap rendering, zoom controls, map decorations, and interaction handling via map actions.
tags: [ui, map, player, input, decoration]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: a08d6e9f
system_scope: ui
---

# Mapscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`MapScreen` is a UI screen that renders and manages the in-game map interface (including the minimap). It handles user input for navigation and map actions, displays dynamic and static decorations (e.g., wormhole indicators, courier markers), manages zoom behavior (including cursor-following zoom), and coordinates with `MapWidget`, `HoverText`, `MapControls`, `HudCompass`, and `UIAnim`. It does not own game entities but reacts to map-related actions via the `playercontroller` and `playeractionpicker` components.

## Usage example
```lua
local mapscreen = MapScreen(ThePlayer)
TheFrontEnd:AddScreen(mapscreen)
-- MapScreen is typically pushed via TheFrontEnd, not instantiated standalone.
-- It listens for keyboard/controller input and updates map decorations in OnUpdate().
```

## Dependencies & tags
**Components used:** `playercontroller`, `playeractionpicker`  
**Tags:** None added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | — | The player entity that owns this map screen. |
| `minimap` | `MapWidget` | — | The main minimap widget instance. |
| `bottomright_root` | `Widget` | — | Root widget for bottom-right HUD elements (compass, map controls). |
| `hover` | `HoverText` | — | Hover text widget used for non-controller map interaction. |
| `hudcompass` | `HudCompass` | — | Compass widget positioned in the bottom-right. |
| `mapcontrols` | `MapControls` or `nil` | — | Optional map control buttons; omitted when controller is attached. |
| `zoom_to_cursor` | `boolean` | — | Whether zoom should follow the cursor position. |
| `zoom_target` | `number` | — | Desired zoom level. |
| `zoom_old` | `number` | — | Previous zoom value for interpolation. |
| `zoom_target_time` | `number` | `0` | Time remaining to reach zoom target. |
| `zoomsensitivity` | `number` | — | Zoom speed sensitivity. |
| `decorationdata` | `table` | `{ staticdecorations = {} }` | Stores decoration state and metadata (static, LMB, RMB). |

## Main functions
### `SetZoom(zoom_target)`
* **Description:** Instantly sets the map zoom to the specified value. Triggers `OnZoomIn`/`OnZoomOut` on the minimap with delta values for mod compatibility.
* **Parameters:** `zoom_target` (number) – the target zoom level (clamped between `ZOOM_CLAMP_MIN` and `ZOOM_CLAMP_MAX` internally via `minimap`).
* **Returns:** Nothing.

### `DoZoomIn(negativedelta)`
* **Description:** Decreases the map zoom (zooms in) by the provided delta (default `−0.1`). Optionally offsets the minimap to follow cursor position if `zoom_to_cursor` is enabled.
* **Parameters:** `negativedelta` (number, optional) – magnitude of zoom change (must be negative). Defaults to `−0.1`.
* **Returns:** Nothing.

### `DoZoomOut(positivedelta)`
* **Description:** Increases the map zoom (zooms out) by the provided delta (default `0.1`). Optionally offsets the minimap to follow cursor position if `zoom_to_cursor` is enabled.
* **Parameters:** `positivedelta` (number, optional) – magnitude of zoom change (must be positive). Defaults to `0.1`.
* **Returns:** Nothing.

### `UpdateMapActions(x, y, z)`
* **Description:** Queries the `playercontroller` and `playeractionpicker` components to determine valid LMB and RMB map actions at the given world position.
* **Parameters:**  
  - `x`, `y`, `z` (numbers) – world coordinates.
* **Returns:**  
  - `LMBaction`, `RMBaction` (tables or `nil`) – action objects (or `nil` if no action found).

### `ProcessStaticDecorations()`
* **Description:** Scans the map for relevant static decoration targets (e.g., wormholes, courier markers) and creates static `UIAnim` widgets positioned on the minimap. Called during `OnBecomeActive` and `UpdateMapActionsDecorations`.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateStaticDecorations()`
* **Description:** Updates the positions, scales, and animations of all static decoration widgets based on current map zoom and visibility rules (e.g., distance, restrictions).
* **Parameters:** None.
* **Returns:** Nothing.

### `ProcessRMBDecorations(rmb, fresh)`
* **Description:** Handles dynamic RMB map decorations for specific actions (`BLINK_MAP`, `TOSS_MAP`, `JUMPIN_MAP`, `DIRECTCOURIER_MAP`). Instantiates and positions UI elements (images/text or custom decorations).
* **Parameters:**  
  - `rmb` (table) – RMB action data (includes `action`, `doer`, `pos`, etc.).  
  - `fresh` (boolean) – if `true`, initializes new decoration widgets.
* **Returns:** Nothing.

### `UpdateMapActionsDecorations(x, y, z, LMBaction, RMBaction)`
* **Description:** Orchestrates decoration updates based on changes in world position, LMB/RMB actions, or dirty flags. Removes outdated LMB/RMB decorations and regenerates them as needed. Calls `ProcessLMBDecorations`, `ProcessRMBDecorations`, and `UpdateStaticDecorations`.
* **Parameters:**  
  - `x`, `y`, `z` (numbers) – current cursor world position.  
  - `LMBaction`, `RMBaction` (table or `nil`) – action definitions.
* **Returns:** Nothing.

### `GetWorldPositionAtCursor()`
* **Description:** Converts screen-space cursor coordinates to world coordinates using the minimap widget’s `MapPosToWorldPos` transformation.
* **Parameters:** None.
* **Returns:** `x`, `y`, `z` (numbers) – world coordinates corresponding to the cursor.

### `AutoAimToStaticDecorations(x, y, z)`
* **Description:** Returns a new world position for auto-aiming to the nearest valid static decoration (e.g., wormhole or courier marker) within range and scale. Otherwise, returns the original position unchanged.
* **Parameters:**  
  - `x`, `y`, `z` (numbers) – original world coordinates.
* **Returns:** `x`, `y`, `z` (numbers) – auto-aimed or original position.

### `OnControl(control, down)`
* **Description:** Handles UI input (keyboard/controller) while the map screen is active. Processes rotation, zoom, cancel/map keys, and map actions (LMB/RMB) via `playercontroller:OnMapAction`.
* **Parameters:**  
  - `control` (string) – control identifier (e.g., `CONTROL_MAP_ZOOM_IN`, `CONTROL_PRIMARY`).  
  - `down` (boolean) – whether the control was pressed (`true`) or released (`false`).
* **Returns:** `boolean` – `true` if the control was handled, `false` otherwise.

### `GetCursorPosition()`
* **Description:** Returns the cursor position normalized in the range `[-1, 1]` for both X and Y axes, with origin at screen center. Returns `(0, 0)` for controller users (no cursor).
* **Parameters:** None.
* **Returns:** `x`, `y` (numbers) – normalized cursor coordinates.

### `OnBecomeActive()`
* **Description:** Called when the screen becomes active. Shows the minimap (toggles if hidden), updates its texture, hides HUD hover text, adjusts hover scale, and resets zoom sensitivity.

### `OnBecomeInactive()`
* **Description:** Called when the screen is inactive but not destroyed (e.g., when another screen is pushed on top). Hides the hover text, minimap center reticle, and clears dynamic decorations.

### `OnDestroy()`
* **Description:** Called when the screen is destroyed. Hides minimap, cleans up hover and decoration state, and resets autopaused state (unless quitting).

## Events & listeners
- **Listens to:** `refreshhudsize` (on `owner.HUD.inst`) – updates `bottomright_root` scale in response to HUD scaling changes.