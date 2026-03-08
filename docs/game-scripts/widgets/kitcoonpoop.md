---
id: kitcoonpoop
title: Kitcoonpoop
description: A UI widget representing a single piece of poop in the Kitcoon Poop minigame that responds to user interaction and animates upon interaction.
tags: [ui, minigame, interaction]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: f32363ab
system_scope: ui
---

# KitcoonPoop

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`KitcoonPoop` is a UI widget that visually represents a single piece of poop in the Kitcoon Poop minigame. It creates an animated UI element using `UIAnim`, binds user interaction (accept control click) to gameplay logic (removing the poop), and manages its own lifecycle based on animation state.

## Usage example
```lua
local kitcoonpoop = KitcoonPoop(kit, gamescreen, profile)
-- The widget is self-contained and self-deleting after interaction
-- It is typically added to a parent UI container by the minigame logic
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `kit` | table | — | Reference to the parent Kitcoon kit controller. |
| `gamescreen` | table | — | Reference to the game screen managing the minigame instance. |
| `anim` | UIAnim | instance | The child UI animation widget. |
| `animstate` | AnimState | instance | Animation state controller for rendering and playing animations. |
| `onclick` | function | `function()` | Callback invoked on user interaction (accept button press). Set to `nil` after use. |

## Main functions
### `OnGainFocus()`
* **Description:** Called when the widget gains keyboard/gamepad focus. Delegates to the parent `Widget` implementation.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Periodically checks whether the "poop_gone" animation has finished. If so, destroys the widget.
* **Parameters:** `dt` (number) - delta time in seconds.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles user input. Responds only to *release* of the accept control (e.g., mouse click or gamepad A button) and invokes `onclick` if present.
* **Parameters:**
  * `control` (string) - the control name (e.g., `CONTROL_ACCEPT`).
  * `down` (boolean) — `true` if the control is pressed, `false` on release.
* **Returns:** `true` if input was handled (prevents further propagation).
* **Error states:** No-op if `down` is `true`, or if `onclick` is `nil`.

## Events & listeners
None identified