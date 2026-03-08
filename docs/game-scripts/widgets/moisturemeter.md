---
id: moisturemeter
title: Moisturemeter
description: Manages the visual HUD widget displaying a player's current moisture level and change rate in Don't Starve Together.
tags: [ui, hud, moisture, player, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: be023ff1
system_scope: ui
---

# Moisturemeter

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MoistureMeter` is a UI widget that visually represents a player's current moisture level and the direction/rate of change via animated symbols and an arrow indicator. It extends `Widget` and uses multiple `UIAnim` children to render the backing, fill, and frame layers, alongside a `Text` element to display the numeric value. The widget automatically activates or deactivates based on the moisture value and updates its appearance in response to networked moisture changes.

## Usage example
```lua
-- Typically added and managed by the character's HUD system
local inst = CreateEntity()
inst:AddWidget("moisturemeter")
-- When moisture changes (e.g., from rain or fire proximity)
inst.components.moisturemeter:SetValue(new_moisture_value, max_moisture, rate_scale)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity (usually a player) this meter belongs to. |
| `moisture` | number | `0` | Current moisture value. |
| `moisturedelta` | number | `0` | Reserved for future use — not actively used. |
| `active` | boolean | `false` | Whether the meter is currently visible (animating open). |
| `backing` | UIAnim | `UIAnim` | Background frame layer. |
| `anim` | UIAnim | `UIAnim` | Fill indicator layer (colored). |
| `circleframe` | UIAnim | `UIAnim` | Outer frame with moisture icon override. |
| `arrow` | UIAnim | `UIAnim` | Directional indicator (increase/decrease rate). |
| `num` | Text | `Text` | Numeric display of current moisture. |
| `arrowdir` | string | `"neutral"` | Current animation name for the arrow. |
| `animtime` | number | `0` | Internal timer used during updates (e.g., frame-based scale changes). |

## Main functions
### `Activate()`
* **Description:** Triggers the open animation sequence for the backing and frame layers, makes the fill `anim` visible, starts the update loop, and plays the HUD open sound.
* **Parameters:** None.
* **Returns:** Nothing.

### `Deactivate()`
* **Description:** Plays the close animation for backing and frame layers, hides the `anim`, stops updating, and plays the HUD close sound.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnGainFocus()`
* **Description:** Called when the widget gains focus (e.g., HUD becomes active); shows the numeric text overlay.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnLoseFocus()`
* **Description:** Called when the widget loses focus; hides the numeric text overlay.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetValue(moisture, max, ratescale)`
* **Description:** Updates the meter’s visual state: shows/hides based on `moisture`, sets fill percentage, displays current moisture as text, and updates the directional arrow animation based on `ratescale`.
* **Parameters:**
  * `moisture` (number) — Current moisture value.
  * `max` (number) — Maximum moisture value (used to compute fill percentage).
  * `ratescale` (RATE_SCALE enum) — Direction and magnitude of change (e.g., `INCREASE_LOW`, `DECREASE_MED`).
* **Returns:** Nothing.
* **Error states:** No-op if `ratescale` is `nil` or invalid; if `moisture <= 0` and active, it triggers `Deactivate()`.

### `OnUpdate(dt)`
* **Description:** Applies per-frame scale adjustments to the `anim` fill layer during open animation to create a smooth "pop" effect. Stops updating when the open animation completes (frame ≥ 5).
* **Parameters:**
  * `dt` (number) — Delta time since last frame.
* **Returns:** Nothing.
* **Error states:** Early-exits if `TheNet:IsServerPaused()` is true.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified