---
id: reticule
title: Reticule
description: Provides a visual targeting reticule for controller-based items, dynamically updating position and color based on validity and input mode (mouse or twin-stick).
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: ui
source_hash: e476c341
---

# Reticule

## Overview
The `Reticule` component enables items to display a dynamic targeting reticule when used with a game controller. It manages the creation, positioning, coloring (valid/invalid), and movement of the reticule prefab in response to input (mouse, twin-stick aiming, or entity target functions), camera updates, and world geometry constraints. It integrates with `aoetargeting`, input handlers, and camera listeners to ensure responsive and context-aware targeting feedback.

## Dependencies & Tags
- **Dependencies:** Relies on external components and systems:
  - `aoetargeting` component (if present on `self.inst`) for deployment constraints (`alwaysvalid`, `allowwater`, `deployradius`).
  - `TheInput` system for reading controller/mouse input, handlers, and world projection.
  - `TheCamera` for camera-relative aiming and heading data.
  - `TheWorld.Map` for spatial validity checks (`CanCastAtPoint`).
- **Tags:** None explicitly added/removed. The component is designed to be attached to entities (typically items) that require targeting visual feedback.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | The entity the component is attached to. |
| `ease` | `boolean` | `false` | Whether reticule movement should be smoothed (lerped). |
| `smoothing` | `number` | `6.66` | Lerp speed factor for eased movement. |
| `reticuleprefab` | `string` | `"reticule"` | Prefab name for the reticule visual. |
| `validcolour` | `{r,g,b,a}` | `{204/255, 131/255, 57/255, 1}` | RGBA color used when target position is valid. |
| `invalidcolour` | `{r,g,b,a}` | `{1, 0, 0, 1}` | RGBA color used when target position is invalid. |
| `currentcolour` | `{r,g,b,a}` | `self.invalidcolour` | Current active RGBA color of the reticule. |
| `mouseenabled` | `boolean` | `false` | Enables mouse input tracking (for non-controller scenarios). |
| `fadealpha` | `number` | `1` | Fade level multiplier, used when mouse is over HUD entity (reduces visibility). |
| `blipalpha` | `number` | `1` | Alpha multiplier for blip animation (used on activation). |

*Note: Several fields are commented out in `_ctor` (`targetpos`, `targetfn`, `mousetargetfn`, etc.) and initialized dynamically during runtime; they are not part of the initial constructor defaults.*

## Main Functions

### `CreateReticule()`
* **Description:** Spawns the reticule prefab, sets up input handlers (mouse or controller), initializes position, and registers the camera update listener.
* **Parameters:** None. Uses internal state (`mouseenabled`, `targetfn`, `mousetargetfn`) to configure behavior.

### `DestroyReticule()`
* **Description:** Removes the reticule prefab, unregisters input handlers, and stops camera updates. Cleans up all active resources.
* **Parameters:** None.

### `PingReticuleAt(pos)`
* **Description:** Spawns a temporary "ping" effect (e.g., for item placement feedback) at the specified world position. Handles `DynamicPosition` entities and applies color/styling.
* **Parameters:**  
  `pos` (`Vector3` or `DynamicPosition`): World position for the ping.

### `Blip()`
* **Description:** Initiates a visual blip animation by resetting `blipalpha` to 0 and starting component updates to gradually fade it in.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Handles blip fade-in animation over time (`dt`), updating `blipalpha` and the reticule’s color.
* **Parameters:**  
  `dt` (`number`): Delta time since last frame.

### `UpdatePosition(dt)`
* **Description:** Positions the reticule at `targetpos`, checks validity (via `TheWorld.Map` and optional `validfn`), updates color (valid/invalid), and applies easing if enabled.
* **Parameters:**  
  `dt` (`number`): Delta time (used only if `ease` is true and `dt` is provided).

### `OnCameraUpdate(dt)`
* **Description:** Core update loop driven by camera events. Handles reticule updates for mouse aiming (HUD hover fade), or twin-stick aiming modes (Modes 1/2), depending on input state.
* **Parameters:**  
  `dt` (`number`): Delta time (used for updates in non-mouse modes).

### `IsTwinStickAiming()`
* **Description:** Returns `true` if twin-stick aiming is currently active (i.e., reticule exists, no mouse handler, and `targetfn`/`twinstickmode` are set).
* **Parameters:** None.

### `UpdateTwinStickMode1()`
* **Description:** Implements twin-stick aiming Mode 1, where the reticule offset is calculated relative to the player’s heading and clamped to a radial range. Handles deadzone and offset tracking.
* **Parameters:** None.

### `UpdateTwinStickMode2()`
* **Description:** Implements twin-stick aiming Mode 2, where the reticulelerps toward an edge point on the aiming circle based on stick input magnitude and camera heading.
* **Parameters:** None.

### `ClearTwinStickOverrides()`
* **Description:** Resets twin-stick state variables (`twinstickoverride`, `twinstickx`, `twinstickz`) to abort aiming override.
* **Parameters:** None.

### `ShouldHide()`
* **Description:** Returns `true` if the reticule should be hidden, based on optional `shouldhidefn`.
* **Parameters:** None.

## Events & Listeners
- **Listens to:**
  - `TheInput:AddMoveHandler(...)` — triggered on mouse movement when `mouseenabled` is true and no controller is attached.
  - `TheCamera:AddListener(...)` — registers `_oncameraupdate` for camera updates (handled in `CreateReticule`/`DestroyReticule`).
  - Custom `onremove` event on platform entities in `PingReticuleAt(...)` to reset parent/position cleanup.
- **Triggers/Emits:**
  - `self:UpdatePosition()` — called internally to refresh reticule position.
  - `self:UpdateColour()` — called internally to refresh reticule color.
  - `self.inst:StartUpdatingComponent(self)` / `self.inst:StopUpdatingComponent(self)` — activates/deactivates `OnUpdate(dt)` for blip animation.