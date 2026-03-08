---
id: wx78moisturemeter
title: Wx78Moisturemeter
description: Renders a visual moisture meter UI for WX-78, showing current moisture level, direction of change, and a warning marker for low moisture.
tags: [ui, hud, wx78]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: a9dbeb66
system_scope: ui
---

# Wx78Moisturemeter

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WX78MoistureMeter` is a UI widget that displays WX-78’s current moisture level as a horizontal progress bar, accompanied by animated indicators for moisture trend (increase/decrease) and a dynamic warning marker that appears when moisture falls below an acceptable threshold (`TUNING.WX78_MINACCEPTABLEMOISTURE`). It integrates with the frontend sound system to play UI feedback and responds to the `do_robot_spark` event (emitted by WX-78 during electrical interactions) to trigger spark animations.

## Usage example
```lua
-- The component is automatically instantiated and attached to the WX-78 entity
-- during character initialization. Typical usage involves updating its value:
if inst:HasTag("wx78") and inst.components.moisture ~= nil then
    local max_moisture = 100
    local current = inst.components.moisture:GetMoisture()
    local rate = RATE_SCALE.DECREASE_MED  -- e.g., from moisture loss
    inst.components.wx78moisturemeter:SetValue(current, max_moisture, rate)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The entity (WX-78) the meter belongs to. |
| `moisture` | number | `0` | Current moisture value (unused internally; likely legacy). |
| `moisturedelta` | number | `0` | Unused. |
| `active` | boolean | `false` | Whether the meter is currently visible. |
| `arrowdir` | string | `"neutral"` | Name of the currently playing arrow animation. |

## Main functions
### `SetValue(moisture, max, ratescale)`
* **Description:** Updates the meter’s visual state based on current moisture, maximum moisture, and the rate of change (`ratescale`). Shows/hides the meter, updates the fill percentage, numeric display, and arrow animation.
* **Parameters:**
  * `moisture` (number) – Current moisture value.
  * `max` (number) – Maximum possible moisture (used to compute fill percentage).
  * `ratescale` (RATE_SCALE constant) – Indicates direction and magnitude of change (`INCREASE_*` or `DECREASE_*`).
* **Returns:** Nothing.
* **Error states:** If `moisture <= 0`, the meter is deactivated (hidden). If `moisture > 0`, it is activated (shown). No effect occurs if the values do not change the active state or rate.

### `Activate()`
* **Description:** Opens the meter UI by playing "open" animations on backing and frame, shows the fill bar, scales up the warning marker, and plays the opening sound.
* **Parameters:** None.
* **Returns:** Nothing.

### `Deactivate()`
* **Description:** Closes the meter UI by playing "close" animations, hides the fill bar, shrinks the marker, stops updates, and plays the closing sound.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateBadMoistureMarkerLevel(new_percent)`
* **Description:** Configures the warning marker and spark positions to indicate the moisture threshold (`BADMOISTURE_PERCENT`). Updates marker and spark rotation/scale.
* **Parameters:** `new_percent` (number) – Threshold moisture ratio (e.g., `0.3` for 30%). Note: In practice, `BADMOISTURE_PERCENT` is precomputed and used directly.
* **Returns:** Nothing.

### `DoSpark()`
* **Description:** Triggers spark animations on both sides of the meter (used when WX-78 receives an electrical shock).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnGainFocus()`
* **Description:** Makes the numeric moisture value visible when the HUD is focused.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnLoseFocus()`
* **Description:** Hides the numeric moisture value when the HUD loses focus.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Runs periodically while the meter is active to animate the fill bar and marker scale in sync with the meter’s animation frame loop. Stops automatically after completion.
* **Parameters:** `dt` (number) – Time delta since last frame.
* **Returns:** Nothing.
* **Error states:** Early-exits if the game is server-paused (`TheNet:IsServerPaused()`).

## Events & listeners
- **Listens to:** `do_robot_spark` – triggered on the `owner` entity; calls `DoSpark()` to animate sparks.
- **Pushes:** None identified.