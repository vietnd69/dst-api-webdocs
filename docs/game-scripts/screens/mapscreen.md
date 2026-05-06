---
id: mapscreen
title: Mapscreen
description: The MapScreen UI class manages minimap display, zoom controls, decoration rendering, map target selection, and input handling for various map actions including scout, deliver, blink, toss, jump-in, courier, and body swap interactions in Don't Starve Together.
tags: [ui, map, input, navigation, decorations]
sidebar_position: 10

last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: screens
source_hash: 352c54e5
system_scope: ui
---

# Mapscreen

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`mapscreen.lua` defines the MapScreen class, a UI screen component that extends the base Screen widget to provide full minimap interaction functionality. This screen handles map rendering through a MapWidget child, manages zoom controls with cursor-following options, and processes decoration overlays for various character-specific map actions. The screen tracks a maptarget entity for action context, validates container ownership through inventoryitem and inventory components, and dispatches map action decorations based on left and right mouse button interactions. Input handling supports both controller and mouse input, with coordinate conversion utilities for translating between screen, widget, and world positions.

## Usage example
```lua
local MapScreen = require "screens.mapscreen"

-- MapScreen is typically instantiated by the game's screen manager
-- when the player opens the map (default key: M)
local owner = ThePlayer
local mapscreen = MapScreen(owner)

-- The screen becomes active when pushed to TheFrontEnd
TheFrontEnd:PushScreen(mapscreen)

-- Zoom can be controlled programmatically
mapscreen:SetZoom(0.5)
mapscreen:DoZoomIn(-0.1)

-- Map target can be set for action context
local target = GetEntityWithPrefab("wormhole")
mapscreen:SetNewMapTarget(target, nil)

-- Screen cleans up automatically on destroy
mapscreen:OnDestroy()
```

## Dependencies & tags
**External dependencies:**
- `widgets/screen` -- Base Screen class extended by MapScreen
- `widgets/mapwidget` -- MapWidget class for minimap rendering and interaction
- `widgets/widget` -- Widget class for UI element containers
- `widgets/mapcontrols` -- MapControls widget for map control buttons
- `widgets/hudcompass` -- HudCompass widget for compass display
- `widgets/hoverer` -- HoverText widget for tooltip display
- `widgets/text` -- Text widget module for UI text rendering
- `widgets/uianim` -- UIAnim widget for animated map decorations

**Components used:**
- `inventoryitem` -- Checked on maptarget to verify container ownership access
- `inventory` -- Accessed on owner to check if container is opened
- `container` -- Accessed on owner to check if container is opened by self.owner
- `playercontroller` -- Used in UpdateMapActions to update actions for map position
- `playeractionpicker` -- Checked for existence before calling UpdateMapActions

**Tags:**
- `CLASSIFIED` -- check
- `globalmapicon` -- check
- `wormholetrackericon` -- check
- `globalmapicon_player` -- check

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | owner parameter | The player entity that owns this map screen instance. |
| `minimap` | Widget | MapWidget instance | The minimap widget child that renders the world map. |
| `bottomright_root` | Widget | Widget instance | Container widget for bottom-right UI elements like compass and map controls. |
| `mapcontrols` | Widget | MapControls instance | Map control buttons widget, only added when controller is not attached. |
| `hover` | Widget | HoverText instance | Hover text widget for displaying tooltips over map elements. |
| `hudcompass` | Widget | HudCompass instance | Compass widget displayed on the map screen. |
| `zoom_to_cursor` | boolean | Profile:IsMinimapZoomCursorFollowing() | Whether zoom operations should follow the cursor position. |
| `zoom_target` | number | self.minimap:GetZoom() | Target zoom level for animated zoom transitions. |
| `zoom_old` | number | zoom_target | Previous zoom level for tracking zoom changes. |
| `zoom_target_time` | number | 0 | Timer for zoom transition animation. |
| `zoomsensitivity` | number | 15 | Zoom sensitivity value for input handling. |
| `decorationdata` | table | `{ staticdecorations = {} }` | Table storing map decoration data including static, LMB, and RMB decorations. |
| `decorationrootstatic` | Widget | Widget instance | Root widget for static map decorations that persist across interactions. |
| `decorationrootlmb` | Widget | Widget instance | Root widget for left-mouse-button triggered decorations. |
| `decorationrootrmb` | Widget | Widget instance | Root widget for right-mouse-button triggered decorations. |
| `handle_LMB_up` | boolean | nil | Flag indicating whether left-mouse-button up events should be handled. |
| `maptarget` | Entity | nil | Currently selected map target entity. |
| `forced_actiondef` | table | nil | Forced action definition for the current map target. |
| `inherentmapactions` | table | nil | Table of inherent map actions available for the current context. |
| `quitting` | boolean | nil | Flag indicating if the game is quitting, used in OnDestroy. |

## Main functions

### `RemoveStaticDecorations()`
* **Description:** Removes all static decoration children from the decoration root widget.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `RemoveLMBDecorations()`
* **Description:** Clears LMB decoration data and removes all LMB decoration children.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `RemoveRMBDecorations()`
* **Description:** Clears RMB decoration data and removes all RMB decoration children.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `RemoveDecorations()`
* **Description:** Removes LMB and RMB decorations but preserves static decorations as noted in comments.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnMinimapMoved()`
* **Description:** Marks decoration data as dirty and disables LMB up handling when minimap is moved.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetHandleLmbUp(enable)`
* **Description:** Enables or disables LMB up event handling and sets drag threshold on minimap accordingly.
* **Parameters:**
  - `enable` -- boolean indicating whether to enable left-mouse-button up event handling
* **Returns:** None
* **Error states:** None

### `OnBecomeInactive()`
* **Description:** Called when screen becomes inactive; hides hover text, center reticle, removes decorations, and clears decoration data.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnBecomeActive()`
* **Description:** Called when screen becomes active; toggles minimap visibility, updates texture, configures hover and reticle based on controller attachment, and loads zoom sensitivity from profile.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnDestroy()`
* **Description:** Cleans up on screen destruction; toggles minimap visibility, hides hover, clears decorations, pushes cancelmaptarget event if maptarget exists, and resets autopause.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `GetZoomOffset(scaler)`
* **Description:** Calculates zoom offset coordinates based on cursor position and zoom factor for cursor-following zoom.
* **Parameters:**
  - `scaler` -- number representing zoom scaler value for offset calculation
* **Returns:** x, y (number, number) -- offset coordinates
* **Error states:** None

### `DoZoomIn(negativedelta)`
* **Description:** Performs zoom in operation and applies cursor offset fixup if zoom_to_cursor is enabled.
* **Parameters:**
  - `negativedelta` -- number representing zoom delta value, defaults to -0.1 if nil
* **Returns:** None
* **Error states:** None

### `DoZoomOut(positivedelta)`
* **Description:** Performs zoom out operation and applies cursor offset fixup if zoom_to_cursor is enabled.
* **Parameters:**
  - `positivedelta` -- number representing zoom delta value, defaults to 0.1 if nil
* **Returns:** None
* **Error states:** None

### `SetZoom(zoom_target)`
* **Description:** Sets zoom to specific target level by calculating delta and calling OnZoomIn or OnZoomOut accordingly.
* **Parameters:**
  - `zoom_target` -- number representing target zoom level to set
* **Returns:** None
* **Error states:** None

### `ValidateMapTarget()`
* **Description:** Validates current maptarget entity; clears it if invalid or if inventoryitem owner's container is not opened by self.owner.
* **Parameters:** None
* **Returns:** self.maptarget (Entity or nil)
* **Error states:** None

### `UpdateMapActions(x, y, z)`
* **Description:** Updates map actions by validating maptarget and calling playercontroller UpdateActionsToMapActions with position and target.
* **Parameters:**
  - `x` -- number representing world X coordinate
  - `y` -- number representing world Y coordinate
  - `z` -- number representing world Z coordinate
* **Returns:** Result from playercontroller:UpdateActionsToMapActions or nil
* **Error states:** None

### `ProcessStaticDecorations_CharlieResidue(staticdecorations, zoomscale, w, h, charlieresidue)`
* **Description:** Processes wormhole tracker icons for charlie residue map action context, creating UIAnim decorations for visible wormholes within detection radius.
* **Parameters:**
  - `staticdecorations` -- table representing static decorations table to populate
  - `zoomscale` -- number representing current zoom scale value
  - `w` -- number representing screen width
  - `h` -- number representing screen height
  - `charlieresidue` -- Entity representing charlie residue entity to process
* **Returns:** None
* **Error states:** None

### `ProcessStaticDecorations_WobyCourier(staticdecorations, zoomscale, w, h, courierdirector)`
* **Description:** Processes woby courier and player map icons, creating decorations with distance-based hiding logic.
* **Parameters:**
  - `staticdecorations` -- table representing static decorations table to populate
  - `zoomscale` -- number representing current zoom scale value
  - `w` -- number representing screen width
  - `h` -- number representing screen height
  - `courierdirector` -- Entity representing courier director entity (owner)
* **Returns:** None
* **Error states:** None

### `ProcessStaticDecorations_SwapBodies(staticdecorations, zoomscale, w, h, director)`
* **Description:** Processes WX78 backup body map icons, creating decorations with owner-based visibility on master sim.
* **Parameters:**
  - `staticdecorations` -- table representing static decorations table to populate
  - `zoomscale` -- number representing current zoom scale value
  - `w` -- number representing screen width
  - `h` -- number representing screen height
  - `director` -- Entity representing director entity (owner)
* **Returns:** None
* **Error states:** None

### `ProcessStaticDecorations_ScoutSelect(staticdecorations, zoomscale, w, h, director)`
* **Description:** Processes WX78 drone scout map icons, creating decorations with owner-based visibility on master sim.
* **Parameters:**
  - `staticdecorations` -- table representing static decorations table to populate
  - `zoomscale` -- number representing current zoom scale value
  - `w` -- number representing screen width
  - `h` -- number representing screen height
  - `director` -- Entity representing director entity (owner)
* **Returns:** None
* **Error states:** None

### `ProcessStaticDecorations_Internal(staticdecorations, zoomscale, w, h)`
* **Description:** Internal dispatcher that calls specific decoration processors based on maptarget prefab type or inherent map actions.
* **Parameters:**
  - `staticdecorations` -- table representing static decorations table to populate
  - `zoomscale` -- number representing current zoom scale value
  - `w` -- number representing screen width
  - `h` -- number representing screen height
* **Returns:** None
* **Error states:** None

### `SetNewMapTarget(maptarget, forced_actiondef)`
* **Description:** Sets new map target, pushes cancelmaptarget event on old target, pushes mapselected on new target, and clears inherent map actions.
* **Parameters:**
  - `maptarget` -- Entity representing new map target entity or nil
  - `forced_actiondef` -- table representing forced action definition or nil
* **Returns:** None
* **Error states:** None

### `SetInherentMapActions(mapactions)`
* **Description:** Sets inherent map actions, detects changes to clear and reprocess static decorations if actions changed.
* **Parameters:**
  - `mapactions` -- table representing map actions table or nil
* **Returns:** None
* **Error states:** None

### `ClearStaticDecorations()`
* **Description:** Clears static decorations table and removes all static decoration widgets if any exist.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `ProcessStaticDecorations()`
* **Description:** Calculates zoom scale and screen dimensions, then calls ProcessStaticDecorations_Internal to populate decorations.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `UpdateStaticDecorations()`
* **Description:** Updates all static decorations each frame; hides invalid entities or those with restrictions, updates position and scale for visible decorations, and handles animation focus transitions.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `ProcessLMBDecorations_MAPSCOUT_MAP(lmb, fresh)`
* **Description:** Processes and updates left mouse button decorations for the MAPSCOUT_MAP action, displaying drone scout icons and range indicators on the minimap. Adjusts decoration visibility and tint based on whether target is within valid drone range.
* **Parameters:**
  - `lmb` -- Left mouse button action object containing target, action point, and action definition
  - `fresh` -- Boolean indicating whether to initialize new decorations or reuse existing ones
* **Returns:** nil
* **Error states:** None

### `ProcessLMBDecorations_MAPDELIVER_MAP(lmb, fresh)`
* **Description:** Processes and updates left mouse button decorations for the MAPDELIVER_MAP action, displaying drone delivery icons on the minimap at the action point position.
* **Parameters:**
  - `lmb` -- Left mouse button action object containing target and action point
  - `fresh` -- Boolean indicating whether to initialize new decorations or reuse existing ones
* **Returns:** nil
* **Error states:** None

### `ProcessLMBDecorations(lmb, fresh)`
* **Description:** Main dispatcher for left mouse button decorations, routes to specific handlers based on action type (MAPSCOUT_MAP, MAPSCOUT_MAP_TOOFAR, MAPDELIVER_MAP). Initializes decorationdata.lmbents table when fresh.
* **Parameters:**
  - `lmb` -- Left mouse button action object with action type and target information
  - `fresh` -- Boolean indicating whether to initialize new decorations or reuse existing ones
* **Returns:** nil
* **Error states:** None

### `ProcessRMBDecorations_BLINK_MAP(rmb, fresh)`
* **Description:** Processes and updates right mouse button decorations for the BLINK_MAP action (Wortox soul hop), displaying soul icons with distance countdown indicators on the minimap. Shows different icons based on distance thresholds and aim assistance status.
* **Parameters:**
  - `rmb` -- Right mouse button action object containing doer, action point, distance count, and hop parameters
  - `fresh` -- Boolean indicating whether to initialize new decorations or reuse existing ones
* **Returns:** nil
* **Error states:** None

### `ProcessRMBDecorations_TOSS_MAP(rmb, fresh)`
* **Description:** Processes and updates right mouse button decorations for the TOSS_MAP action, displaying the equipped item icon at the toss trajectory point on the minimap. Supports custom decoration handlers if the equipped item defines InitMapDecorations and CalculateMapDecorations methods. Returns early if equipped hands item is nil/invalid or if decor initialization fails.
* **Parameters:**
  - `rmb` -- Right mouse button action object containing doer and action point
  - `fresh` -- Boolean indicating whether to initialize new decorations or reuse existing ones
* **Returns:** nil
* **Error states:** None

### `ProcessRMBDecorations_JUMPIN_MAP(rmb, fresh)`
* **Description:** Processes and updates right mouse button decorations for the JUMPIN_MAP action, handling Charlie residue wormhole targeting and triggering focus animations on valid wormhole entities within detection radius.
* **Parameters:**
  - `rmb` -- Right mouse button action object containing action point
  - `fresh` -- Boolean indicating whether to initialize new decorations or reuse existing ones
* **Returns:** nil
* **Error states:** None

### `ProcessRMBDecorations_DIRECTCOURIER_MAP(rmb, fresh)`
* **Description:** Processes and updates right mouse button decorations for the DIRECTCOURIER_MAP action (Walter/Woby courier), finding and animating player or courier marker entities within detection radius on the minimap.
* **Parameters:**
  - `rmb` -- Right mouse button action object containing action point
  - `fresh` -- Boolean indicating whether to initialize new decorations or reuse existing ones
* **Returns:** nil
* **Error states:** None

### `ProcessRMBDecorations_SWAPBODIES_MAP(rmb, fresh)`
* **Description:** Processes and updates right mouse button decorations for the SWAPBODIES_MAP action (WX-78 remote body swap), finding and animating backup body entities within detection radius on the minimap.
* **Parameters:**
  - `rmb` -- Right mouse button action object containing action point
  - `fresh` -- Boolean indicating whether to initialize new decorations or reuse existing ones
* **Returns:** nil
* **Error states:** None

### `ProcessRMBDecorations_MAPSCOUTSELECT_MAP(rmb, fresh)`
* **Description:** Processes and updates right mouse button decorations for the MAPSCOUTSELECT_MAP action (WX-78 drone scout selection), finding and animating drone scout entities within detection radius on the minimap.
* **Parameters:**
  - `rmb` -- Right mouse button action object containing action point
  - `fresh` -- Boolean indicating whether to initialize new decorations or reuse existing ones
* **Returns:** nil
* **Error states:** None

### `ProcessRMBDecorations(rmb, fresh)`
* **Description:** Main dispatcher for right mouse button decorations, routes to specific handlers based on action type (BLINK_MAP, TOSS_MAP, JUMPIN_MAP, DIRECTCOURIER_MAP, SWAPBODIES_MAP, MAPSCOUTSELECT_MAP). Initializes decorationdata.rmbents table when fresh.
* **Parameters:**
  - `rmb` -- Right mouse button action object with action type and target information
  - `fresh` -- Boolean indicating whether to initialize new decorations or reuse existing ones
* **Returns:** nil
* **Error states:** None

### `UpdateMapActionsDecorations(x, y, z, LMBaction, RMBaction)`
* **Description:** Main update loop for map action decorations. Checks if decoration data is dirty or coordinates/actions changed, then processes LMB and RMB decorations accordingly. Clears dirty flag after processing and updates static decorations.
* **Parameters:**
  - `x` -- World X coordinate for decoration positioning
  - `y` -- World Y coordinate for decoration positioning
  - `z` -- World Z coordinate for decoration positioning
  - `LMBaction` -- Left mouse button action object or nil
  - `RMBaction` -- Right mouse button action object or nil
* **Returns:** nil
* **Error states:** None

### `AutoAimToStaticDecorations(x, y, z)`
* **Description:** Finds the closest static decoration within zoom radius and returns its position for auto-aiming. Iterates through decorationdata.staticdecorations, checking validity and zoom constraints.
* **Parameters:**
  - `x` -- number representing World X coordinate to check for nearby decorations
  - `y` -- number representing World Y coordinate to check for nearby decorations
  - `z` -- number representing World Z coordinate to check for nearby decorations
* **Returns:** rx, ry, rz (numbers) -- Closest decoration position, or x, y, z if no valid decoration found
* **Error states:** None

### `OnUpdate(dt)`
* **Description:** Per-frame update handler that processes controller input for map panning and zooming. Handles analog joystick input, digital zoom buttons, smooth zoom interpolation, and updates map action states.
* **Parameters:**
  - `dt` -- number representing delta time in seconds since last frame
* **Returns:** nil
* **Error states:** None

### `GetCursorPosition()`
* **Description:** Returns normalized cursor position from -1 to 1 on both axes. Centers cursor for controller users, calculates screen-relative position for mouse users.
* **Parameters:** None
* **Returns:** x, y (numbers) -- Normalized cursor coordinates
* **Error states:** None

### `GetWorldPositionAtCursor()`
* **Description:** Converts cursor position to world coordinates using minimap coordinate transformation. Returns Y as 0 for planar mapping.
* **Parameters:** None
* **Returns:** x, 0, y (numbers) -- World position at cursor location
* **Error states:** None

### `OnControl(control, down)`
* **Description:** Handles all map screen input including rotation, zoom, map actions, and screen dismissal. Processes LMB/RMB actions through playercontroller, manages map target cancellation, and handles quit state.
* **Parameters:**
  - `control` -- number representing control identifier (e.g., CONTROL_ACCEPT, CONTROL_MAP_ZOOM_IN)
  - `down` -- boolean indicating whether the control is being pressed (true) or released (false)
* **Returns:** boolean -- true if control was handled, false otherwise
* **Error states:** None

### `GetHelpText()`
* **Description:** Generates localized help text string showing available controls for rotation, zoom, cancel/back, and map actions based on current controller state and map target.
* **Parameters:** None
* **Returns:** string -- Concatenated help text with control bindings and descriptions
* **Error states:** None

### `MapPosToWidgetPos(mappos)`
* **Description:** Converts map coordinates to widget/screen coordinates using resolution scaling. Centers output around origin.
* **Parameters:**
  - `mappos` -- Vector3 representing map coordinate position to convert
* **Returns:** Vector3 -- Widget position
* **Error states:** None

### `ScreenPosToWidgetPos(screenpos)`
* **Description:** Converts screen pixel coordinates to widget coordinates using screen size and resolution scaling. Centers output around origin.
* **Parameters:**
  - `screenpos` -- Vector3 representing screen pixel position to convert
* **Returns:** Vector3 -- Widget position
* **Error states:** None

### `WidgetPosToMapPos(widgetpos)`
* **Description:** Converts widget coordinates back to map coordinates using inverse resolution scaling.
* **Parameters:**
  - `widgetpos` -- Vector3 representing widget coordinate position to convert
* **Returns:** Vector3 -- Map position
* **Error states:** None

## Events & listeners
**Listens to:**
- `refreshhudsize` -- Listened on owner.HUD.inst to update bottomright_root scale when HUD size changes

**Pushes:**
- `cancelmaptarget` -- Pushed on maptarget entity when setting new map target or on destroy
- `mapselected` -- Pushed on maptarget entity when a new map target is set