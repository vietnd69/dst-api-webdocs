---
id: wx78moisturemeter
title: Wx78MoistureMeter
description: A UI widget that displays WX-78's moisture/wetness level with animated meter, rate arrow, and spark effects.
tags: [widget, ui, wx78]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: widgets
source_hash: a5058159
system_scope: ui
---

# Wx78MoistureMeter

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Wx78MoistureMeter` is a UI widget extending `Widget` that displays WX-78's moisture level in the HUD. It composes multiple `UIAnim` children for the meter bar, frame, direction arrow, bad-moisture marker, and spark effects, plus a `Text` label for the numeric value. The widget activates/deactivates with animations based on moisture state and listens to owner entity events for module upgrades and robot spark triggers. Embedded inside WX-78's character HUD screen.

## Usage example
```lua
local Wx78MoistureMeter = require("widgets/wx78moisturemeter")

-- Inside a screen's _ctor (e.g., WX-78 HUD screen):
self.moisturemeter = self:AddChild(Wx78MoistureMeter(owner_entity))
self.moisturemeter:SetPosition(200, -150, 0)
self.moisturemeter:SetValue(50, 100, RATE_SCALE.INCREASE_LOW)
```

## Dependencies & tags
**External dependencies:**
- `widgets/uianim` -- UIAnim child widgets for animated meter elements
- `widgets/widget` -- Widget base class
- `widgets/text` -- Text child widget for numeric display

**Components used:** None — widgets do not interact with ECS components directly.

**Tags:** None.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | --- | The WX-78 character entity that owns this widget. |
| `moisture` | number | `0` | Current moisture value stored locally. |
| `moisturedelta` | number | `0` | Moisture change delta (unused in visible logic). |
| `active` | boolean | `false` | Whether the meter is currently visible/active. |
| `backing` | UIAnim | --- | Background meter animation; bank `status_meter`, build `status_wet`. |
| `anim` | UIAnim | --- | Main moisture bar animation; bank `status_meter`, build `status_meter`. |
| `circleframe` | UIAnim | --- | Circular frame animation with icon override. |
| `arrowdir` | string | `"neutral"` | Current arrow animation direction state. |
| `arrow` | UIAnim | --- | Rate direction arrow; bank `sanity_arrow`, build `sanity_arrow`. |
| `marker` | UIAnim | --- | Bad moisture threshold marker; bank `status_wet_wx`. Scaled to 0 by default. |
| `right_sparks` | UIAnim | --- | Right-side spark effect; bank `status_wet_wx`. |
| `left_sparks` | UIAnim | --- | Left-side spark effect; bank `status_wet_wx`. |
| `num` | Text | --- | Numeric moisture display; hidden by default, shown on gain focus. |
| `ondorobotspark` | function | --- | Event callback that triggers `DoSpark()`. |
| `onupgrademoduleownerupdate` | function | --- | Event callback that triggers `UpdateBadMoistureMarkerLevel()`. |
| `FRAME_RADIUS` | constant (local) | `30` | Radius constant used in spark angle calculation. |

## Main functions
### `_ctor(owner)`
* **Description:** Initialises the widget, calls `Widget._ctor(self, "WX78MoistureMeter")`, creates all child UIAnim and Text widgets, configures animation banks/builds, sets up event listeners on the owner entity, and calls `UpdateBadMoistureMarkerLevel()`.
* **Parameters:** `owner` -- the WX-78 character entity that owns this widget
* **Returns:** nil
* **Error states:** None — Widget._ctor handles nil internally; event listeners gracefully handle nil owner.

### `UpdateBadMoistureMarkerLevel()`
* **Description:** Queries the owner's `GetMinimumAcceptableMoisture()` method (if available) and passes the result as a percentage to `SetBadMoistureMarkerLevel()`. Called on construction and when upgrade module events fire.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None — guards missing `GetMinimumAcceptableMoisture` with `and` check, defaults to 0.

### `SetBadMoistureMarkerLevel(new_percent)`
* **Description:** Sets the bad moisture marker animation percent to `(1 - new_percent)` and calculates spark angles based on the meter percent. Rotates left and right sparks symmetrically around the marker position.
* **Parameters:** `new_percent` -- number between 0 and 1 representing the threshold position
* **Returns:** nil
* **Error states:** None.

### `Activate()`
* **Description:** Plays open animations on backing and circleframe, shows the main anim bar, scales marker from 0 to 1 over 5 frames, starts the updating loop, and plays the open sound. Sets `self.active = true`.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `Deactivate()`
* **Description:** Plays close animations on backing and circleframe, hides the main anim bar, scales marker from 1 to 0 over 5 frames, stops the updating loop, and plays the close sound. Sets `self.active = false`.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `DoSpark()`
* **Description:** Plays the `right_spark` and `left_spark` animations on the respective spark widgets. Triggered by the `do_robot_spark` event from the owner.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnGainFocus()`
* **Description:** Calls base `Widget:OnGainFocus()`, then shows the numeric text label (`self.num`).
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnLoseFocus()`
* **Description:** Calls base `Widget:OnLoseFocus()`, then hides the numeric text label (`self.num`).
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `SetValue(moisture, max, ratescale)`
* **Description:** Updates the moisture display. If `moisture > 0` and widget is inactive, activates the widget. Sets the anim bar percent to `1 - moisture / max` and updates the numeric text. If `moisture <= 0` and widget is active, deactivates. Updates the arrow animation based on `ratescale` and current moisture state.
* **Parameters:**
  - `moisture` -- current moisture value (number)
  - `max` -- maximum moisture capacity (number)
  - `ratescale` -- rate scale enum from `RATE_SCALE` table. Valid values:
    - `RATE_SCALE.INCREASE_HIGH` -- fast moisture increase arrow
    - `RATE_SCALE.INCREASE_MED` -- medium moisture increase arrow
    - `RATE_SCALE.INCREASE_LOW` -- slow moisture increase arrow
    - `RATE_SCALE.DECREASE_HIGH` -- fast moisture decrease arrow
    - `RATE_SCALE.DECREASE_MED` -- medium moisture decrease arrow
    - `RATE_SCALE.DECREASE_LOW` -- slow moisture decrease arrow
* **Returns:** nil
* **Error states:** None.

### `OnUpdate(dt)`
* **Description:** **Updating loop.** Checks if server is paused (returns early if so). Reads the current animation frame of `circleframe` and applies frame-based scale values to `anim` and `marker` widgets to create a pulsing effect. Stops updating after frame 5. Called automatically while widget is active.
* **Parameters:** `dt` -- delta time since last update (unused)
* **Returns:** nil
* **Error states:** None.

## Events & listeners
**Listens to:**
- `do_robot_spark` -- on owner entity; triggers `DoSpark()` to play spark animations
- `upgrademodulesdirty` -- on owner entity; triggers `UpdateBadMoistureMarkerLevel()` to recalculate marker position
- `energylevelupdate` -- on owner entity; triggers `UpdateBadMoistureMarkerLevel()` to recalculate marker position

**Pushes:** None.