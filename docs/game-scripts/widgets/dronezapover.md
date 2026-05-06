---
id: dronezapover
title: Dronezapover
description: A UI overlay for the WX-78 drone remote control that displays signal strength, power level, and visual effects during drone operation.
tags: [ui, wx78, drone, overlay]
sidebar_position: 10
last_updated: 2026-05-05
build_version: 722832
change_status: stable
category_type: widgets
source_hash: 17f3f1c7
system_scope: ui
---

# Dronezapover

> Based on game build **722832** | Last updated: 2026-05-05

## Overview
A reusable UI widget that displays status information for the WX-78 drone remote control. It renders signal strength indicators, power level bars, and a directional arrow showing drone position relative to the player. The widget activates when the drone is in use and handles visual transitions, screen resizing, and controller input help text. It is embedded in HUD screens and manages its own lifecycle through focus events.

## Usage example
```lua
local DroneZapOver = require("widgets/dronezapover")

-- Inside a screen's _ctor:
self.droneOverlay = self:AddChild(DroneZapOver(self.owner))
self.droneOverlay:Toggle(true, drone_entity)
```

## Dependencies & tags
**External dependencies:**
- `widgets/uianim` -- base UI animation class for the widget
- `easing` -- provides easing functions for fade animations

**Components used:**
- `finiteuses` -- accessed via `item.components.finiteuses` to get power percentage; used for displaying power level

**Tags:**
- `"wx_remotecontroller"` -- checked on equipped item to determine if it's a drone remote

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity using the drone remote control. |
| `signal_level` | number | `4` | Current signal strength level (0-4). |
| `arrow` | UIAnim | `nil` | Child widget displaying the range arrow. |
| `source` | entity | `nil` | The active drone entity. |
| `fade_ent` | entity | `nil` | Entity currently being faded. |
| `fade_t` | number | `nil` | Current fade progress time. |
| `fade_len` | number | `nil` | Total fade duration in seconds. |
| `fade_in` | boolean | `nil` | Whether fading in (`true`) or out (`false`). |
| `item` | entity | `nil` | The equipped remote controller item. |
| `aspect_ratio` | number | `nil` | Current screen aspect ratio for distortion effects. |

## Main functions
### `_ctor(owner)`
* **Description:** Initializes the widget, sets up child elements (arrow), configures animation states, and registers event listeners for drone control operations.
* **Parameters:** `owner` -- entity instance that owns the drone remote control
* **Returns:** nil
* **Error states:** None.

### `GetDrone()`
* **Description:** Returns the currently active drone entity.
* **Parameters:** None
* **Returns:** Entity instance or `nil` if no drone is active
* **Error states:** None.

### `Toggle(show, source)`
* **Description:** Toggles the drone overlay on or off based on the source entity. Enables if showing and source differs from current, disables if hiding and source matches.
* **Parameters:**
  - `show` -- boolean indicating whether to enable or disable
  - `source` -- entity instance of the drone
* **Returns:** nil
* **Error states:** None. Safely handles nil source via conditional checks.

### `SetSkinBuild(source)`
* **Description:** Updates the animation skin build for the widget based on the drone's current skin. Appends "_overlay" to the skin build name if present.
* **Parameters:** `source` -- drone entity to get skin from
* **Returns:** nil
* **Error states:** None. Handles nil source by defaulting to "wx78_drone_zap_overlay" build.

### `Enable(source)`
* **Description:** Activates the drone overlay, sets up event listeners for the source drone, updates power level based on equipped item, and applies visual effects.
* **Parameters:** `source` -- drone entity to enable
* **Returns:** nil
* **Error states:** Errors if `source` is nil (assertion failure) or `self.owner` is nil (nil dereference on self.owner.replica).

### `Disable()`
* **Description:** Deactivates the drone overlay, removes event listeners, and starts fade-out animation.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None. Safely handles cases where source is not set.

### `OnHide(was_visible)`
* **Description:** Handles widget hiding by canceling fades and stopping updates. Called when the widget is hidden.
* **Parameters:** `was_visible` -- boolean indicating if the widget was previously visible
* **Returns:** nil
* **Error states:** None.

### `TryClose()`
* **Description:** Attempts to close the drone overlay by stopping drone usage if possible. Returns true if closed successfully.
* **Parameters:** None
* **Returns:** boolean indicating if the overlay was closed
* **Error states:** Errors if self.owner is nil (nil dereference on self.owner:StopUsingDrone)..

### `StartFadeIn(ent, len)`
* **Description:** Initiates a fade-in effect on the specified entity over the given duration.
* **Parameters:**
  - `ent` -- entity to fade
  - `len` -- duration of the fade in seconds
* **Returns:** nil
* **Error states:** Errors if ent is nil (causes crash in OnUpdate when checking IsValid)..

### `StartFadeOut(ent, len)`
* **Description:** Initiates a fade-out effect on the specified entity over the given duration.
* **Parameters:**
  - `ent` -- entity to fade
  - `len` -- duration of the fade in seconds
* **Returns:** nil
* **Error states:** Errors if ent is nil (causes crash in OnUpdate when checking IsValid)..

### `CancelFade()`
* **Description:** Immediately cancels any active fade effect and resets fade state.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `EndFade()`
* **Description:** Resets fade state variables to nil after fade completes.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `SetPowerLevel(pct)`
* **Description:** Updates the power level display based on the percentage value (0-1), showing 0-4 power indicators.
* **Parameters:** `pct` -- float percentage of power remaining (0.0 to 1.0)
* **Returns:** nil
* **Error states:** Errors if pct is nil (math.ceil(nil) causes crash).

### `SetSignalLevel(pctsq)`
* **Description:** Updates the signal strength display based on squared distance percentage (0-1), showing 0-4 signal indicators.
* **Parameters:** `pctsq` -- float normalized squared distance (0.0 to 1.0)
* **Returns:** nil
* **Error states:** Errors if pctsq is nil (math.ceil(nil) causes crash).

### `OnUpdate(dt)`
* **Description:** Updates the widget each frame, adjusting signal level, arrow position, and fade effects based on current state.
* **Parameters:** `dt` -- delta time in seconds since last frame
* **Returns:** nil
* **Error states:** None.

### `GetHelpText()`
* **Description:** Returns localized help text for controller actions related to the drone overlay.
* **Parameters:** None
* **Returns:** string containing help instructions
* **Error states:** None.

### `OnAnimOver(inst)` (local)
* **Description:** Removes the animover event callback and attempts to hide inst.widget (which is not present in the widget class, causing a crash).
* **Parameters:** `inst` -- widget instance
* **Returns:** nil
* **Error states:** Errors if inst is nil (nil dereference on inst:RemoveEventCallback) or inst has no widget property (nil dereference on inst.widget:Hide()).

## Events & listeners
**Listens to:**
- `"onremove"` -- triggers `_onremovesource` (when source is set) and sets PostProcessor fish lens radius to 0 (when widget entity is removed)
- `"dronevision"` -- triggers `Toggle`; data includes `enable` and `source` to toggle overlay
- `"continuefrompause"` -- triggers when game resumes; sets focus if overlay is shown
- `"animover"` -- triggers `OnAnimOver`; when animation completes
- `"percentusedchange"` -- triggers `_onperecentusedchange`; when item's usage percentage changes

**Pushes:** None.

**World state watchers:** None.